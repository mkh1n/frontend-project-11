import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import locale from './locales/yupLocale.js';
import parseXml from './rss.js';
import render from './view.js';

const validateUrl = (link, collection) => {
  const schemaStr = yup.string().required().url().trim();
  const schemaMix = yup.mixed().notOneOf(collection);
  return schemaStr.validate(link)
    .then((url) => schemaMix.validate(url));
};

const addPosts = (posts, feedId, state) => {
  const isDouble = (post1, post2) => feedId === post2.feedId && post1.title === post2.title;
  const uniquePosts = posts.filter((post1) => !state.posts.some((post2) => isDouble(post1, post2)));
  const postsWithId = uniquePosts.map((post) => {
    const id = uniqueId();
    return {
      feedId,
      id,
      ...post,
    };
  });
  state.posts.unshift(...postsWithId);
};
const updateRss = (state, i18nI) => new Promise((resolve) => {
  const feedLinks = state.feeds.map((feed) => feed.url);
  feedLinks.forEach((rssLink, index) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${rssLink}`)
      .then((response) => {
        const { posts } = parseXml(response.data.contents);
        const feedId = state.feeds[index].id;
        addPosts(posts, feedId, state);
        resolve();
      })
      .catch(() => {
        state.form.errorMessage = i18nI.t('errors.network');
        state.status = 'error';
      })
      .finally(() => {
        setTimeout(() => {
          updateRss(state, i18nI);
        }, 5000);
      });
  });
});

const loadRss = (rssLink, state, i18nI) => new Promise((resolve) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${rssLink}`)
    .then((response) => {
      try {
        const { feed, posts } = parseXml(response.data.contents);
        const feedId = uniqueId();
        state.feeds.unshift({ id: feedId, url: rssLink, ...feed });
        addPosts(posts, feedId, state);
        state.form.errorMessage = '';
        state.status = 'sent';
        setTimeout(() => {
          updateRss(state);
        }, 5000);
        resolve();
      } catch (e) {
        console.log(e);
        state.form.errorMessage = i18nI.t('errors.noRss');
        state.status = 'error';
      }
    })
    .catch(() => {
      state.form.errorMessage = i18nI.t('errors.network');
      state.status = 'error';
    });
});

const translatePage = (elements, i18nI) => {
  Object.keys(elements.textNodes).forEach((node) => {
    elements.textNodes[node].textContent = i18nI.t(node);
  });
};

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    submitBtn: document.querySelector('button[type="submit"]'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    textNodes: {
      closeModal: document.querySelector('button[class="btn btn-secondary"]'),
      readAll: document.querySelector('a[class="btn btn-primary full-article"]'),
      heading: document.querySelector('h1[class="display-3 mb-0"]'),
      subheading: document.querySelector('p[class="lead"]'),
      RSSLink: document.querySelector('label[for="url-input"]'),
      addBtn: document.querySelector('button[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
      example: document.querySelector('p[class="mt-2 mb-0 text-muted"]'),
    },
  };

  const state = {
    feeds: [],
    posts: [],
    status: 'filling', // filing, sending, sent, error
    form: {
      errorMessage: '',
      value: '',
    },
    uiState: {
      openModalId: '',
      visitedPostsId: new Set(),
    },
    language: 'ru',
  };

  const i18nI = i18n.createInstance();
  i18nI.init({
    lng: state.language,
    resources,
  });

  yup.setLocale(locale);

  translatePage(elements, i18nI);

  const view = render(state, elements, i18nI);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    view.status = 'sending';
    const currentValue = elements.input.value;
    view.form.value = currentValue;
    const links = view.feeds.map((feed) => feed.url);
    validateUrl(currentValue, links)
      .then(() => {
        loadRss(currentValue, view, i18nI);
      }).catch((err) => {
        const message = err.errors.map((error) => i18nI.t(`errors.${error.key}`))[0];
        view.form.errorMessage = message;
        view.status = 'error';
      });
  });

  elements.posts.addEventListener('click', (event) => {
    if (event.target.matches('[data-bs-toggle="modal"]')) {
      view.uiState.openModalId = event.target.dataset.id;
      view.uiState.visitedPostsId.add(event.target.dataset.id);
    }
    if (event.target.matches(`a[data-id="${event.target.dataset.id}"]`)) {
      view.uiState.visitedPostsId.add(event.target.dataset.id);
    }
  });
};
