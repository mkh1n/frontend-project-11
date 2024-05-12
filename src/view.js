import onChange from 'on-change';

const formHandler = (elements, state, status, i18nI) => {
  elements.submitBtn.disabled = (status === 'sending');
  switch (status) {
    case 'error':
      elements.input.classList.add('is-invalid');
      elements.feedback.textContent = state.form.errorMessage;
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;

    case 'sent':
      elements.input.value = '';
      elements.input.focus();
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = i18nI.t('successfullyLoaded');
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      break;

    case 'filling':
    case 'sending':
      break;

    default:
      break;
  }
};
const visitPost = (visitedPostsid) => {
  visitedPostsid.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
  });
};
const renderModal = (state, postId, elements) => {
  const currentPost = state.posts.find((post) => post.id === postId);
  elements.modalBody.innerHTML = currentPost.description;
  elements.modalTitle.textContent = currentPost.title;
  elements.textNodes.readAll.href = currentPost.link;
};

const renderFeeds = (state, elements, i18nI) => {
  const feedsEl = document.createElement('div');
  feedsEl.classList.add('card', 'border-0');
  feedsEl.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nI.t('feeds')}</h2></div>`;

  const feedsUlEl = document.createElement('ul');
  feedsUlEl.classList.add('list-group', 'border-0', 'border-end-0');

  state.feeds.forEach((feed) => {
    const feedLi = document.createElement('li');
    feedLi.innerHTML = `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p></li>`;
    feedsUlEl.appendChild(feedLi);
  });
  feedsEl.appendChild(feedsUlEl);

  elements.feeds.innerHTML = '';
  elements.feeds.append(feedsEl);
};
const renderPosts = (state, elements, i18nI) => {
  elements.posts.innerHTML = '';
  const postsEl = document.createElement('div');
  postsEl.classList.add('card', 'border-0');
  postsEl.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nI.t('posts')}</h2></div>`;

  const postsUlEl = document.createElement('ul');
  postsUlEl.classList.add('list-group', 'border-0', 'rounded-0');

  state.posts.forEach((post) => {
    const postLi = document.createElement('li');

    postLi.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" 
    data-bs-target="#modal">${i18nI.t('view')}</button></li>`;

    postsUlEl.appendChild(postLi);
  });

  postsEl.appendChild(postsUlEl);
  elements.posts.append(postsEl);
  visitPost(state.uiState.visitedPostsId);
};
export default (state, elements, i18nI) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case ('status'):
        formHandler(elements, state, value, i18nI);
        break;
      case ('posts'):
        renderPosts(state, elements, i18nI);
        break;
      case ('feeds'):
        renderFeeds(state, elements, i18nI);
        break;
      case ('uiState.openModalId'):
        renderModal(state, value, elements);
        break;
      case ('uiState.visitedPostsId'):
        visitPost(value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
