import * as yup from "yup";
import i18n from "i18next";
import resources from './locales/index.js';
import locale from "./locales/yupLocale.js";
import axios from "axios";
import {uniqueId} from 'lodash';
import parseXml from './rss.js'
import {watch, renderFeeds} from './view.js'

export default () => {
    const elements = {
        form: document.querySelector('form'),
        input: document.querySelector('#url-input'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        textNodes: {
            heading: document.querySelector('h1[class="display-3 mb-0"]'),
            subheading: document.querySelector('p[class="lead"]'),
            RSSLink: document.querySelector('label[for="url-input"]'),
            readAllBtn: document.querySelector('a[class="btn btn-primary full-article"]'),
            closeModalBtn: document.querySelector('button[class="btn btn-secondary"]'),
            addBtn: document.querySelector('button[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
            example: document.querySelector('p[class="mt-2 mb-0 text-muted"]'),
        },
    };

    const state = {
        feeds: [],
        posts: [],
        form: {
            error: '',
            value: '',
        },
        language: 'ru',
    }

    const i18nI = i18n.createInstance();
    i18nI.init({
        lng: state.language,
        resources,
    })

    yup.setLocale(locale);

    const translatePage = () => {
        Object.keys(elements.textNodes).forEach((node)=>{
            elements.textNodes[node].textContent = i18nI.t(node);
        })
    }

    translatePage();

    const watchedState = watch(state, elements, i18nI);

    const validateUrl = (link, collection) => {
        const schemaStr = yup.string().required().url().trim();
        const schemaMix = yup.mixed().notOneOf(collection);
        return schemaStr.validate(link)
            .then((url) => schemaMix.validate(url));
    };

    const addPosts = (posts, feedId, state) => {
        const postsWithId = posts.map(post => {
            const id = _.uniqueId();
            return {
                feedId,
                id,
                ...post
            }
        });
        state.posts.unshift(...postsWithId)
    }
    
    const getRss = (rssLink, state, i18nI) => {
        return new Promise((resolve, reject)=>{
            axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${rssLink}`)
            .then(response => {
                try {
                    const xmlDoc = response.data.contents;
                    const {feed, posts} = parseXml(xmlDoc)
                    const feedId = uniqueId();
                    state.feeds.unshift({id: feedId, url: rssLink, ...feed});
                    addPosts(posts, feedId, state);
                    watchedState.form.error = ''
                    resolve();
                } catch(e) {
                    watchedState.form.error = i18nI.t(`errors.noRss`);
                }
            })
            .catch(function (e) {
                watchedState.form.error = i18nI.t(`errors.network`);
            })
            .finally (() => {
    
            })
        })
        
    }
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentValue = elements.input.value
        watchedState.form.value = currentValue;
        const links = watchedState.feeds.map((feed)=>feed.url);
        validateUrl(currentValue, links).then(() => {
            getRss(currentValue, watchedState, i18nI)
            .then(()=>{
                renderFeeds(watchedState, elements, i18nI)
            })
        }).catch((err) => {
            console.log(err)
            const message = err.errors.map((error) => i18nI.t(`errors.${error.key}`))[0];
            watchedState.form.error = message;
        })
    })
}

