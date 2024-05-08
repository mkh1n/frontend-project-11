import onChange from "on-change";

const watch = (state, elements, i18nI) => {
    const watchedState = onChange(state, (path) => {
        if (watchedState.form.error) {
            elements.input.classList.add('is-invalid');
            elements.feedback.textContent = state.form.error;
            elements.feedback.classList.remove('text-success');
            elements.feedback.classList.add('text-danger');
        } else {
            elements.input.value = '';
            elements.input.focus();
            elements.input.classList.remove('is-invalid');
            elements.feedback.textContent = i18nI.t('successfullyLoaded');
            elements.feedback.classList.add('text-success');
            elements.feedback.classList.remove('text-danger');
        }

    })
    return watchedState;
}
const renderFeeds = (wacthedState, elements, i18nI) => {
    const state = JSON.parse(JSON.stringify(wacthedState))

    //feeds render
    const feedsEl = document.createElement('div');
    feedsEl.classList.add('card', 'border-0');
    feedsEl.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nI.t('feeds')}</h2></div>`
   
    const feedsUlEl = document.createElement('ul');
    feedsUlEl.classList.add('list-group', 'border-0', 'border-end-0');

    state.feeds.forEach((feed) => {
        const feedLi = document.createElement('li');
        feedLi.innerHTML = `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p></li>`
        feedsUlEl.appendChild(feedLi)
    });
    feedsEl.appendChild(feedsUlEl);

    //posts render
    const postsEl = document.createElement('div');
    postsEl.classList.add('card', 'border-0');
    postsEl.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nI.t('posts')}</h2></div>`

    const postsUlEl = document.createElement('ul');
    postsUlEl.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((post) => {
        const postLi = document.createElement('li');
        postLi.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="${post.link}" class="fw-bold" data-id="${post.d}" target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">${i18nI.t('view')}</button></li>`
        postsUlEl.appendChild(postLi);
    });

    postsEl.appendChild(postsUlEl);

    elements.feeds.innerHTML = '';
    elements.posts.innerHTML = '';

    elements.feeds.append(feedsEl);
    elements.posts.append(postsEl);

}
export { watch, renderFeeds };