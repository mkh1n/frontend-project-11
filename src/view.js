import onChange from "on-change";

const watch = (state, elements, i18nI) => {
    const watchedState = onChange(state, (path) => {
        if (watchedState.form.error) {
            elements.input.classList.add('is-invalid');
            elements.feedback.textContent = state.form.error;
            elements.feedback.classList.remove('text-success');
            elements.feedback.classList.add('text-danger');
        } else {
            console.log('111', state)
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
const renderFeeds = (state, elements, i18nI) => {
    const { feeds } = state;

    //feeds render
    const feedsEl = document.createElement('div');
    feedsEl.classList.add('card', 'border-0');

    const feedCardBodyEl = document.createElement('div');
    feedCardBodyEl.classList.add('card-body');
    feedCardBodyEl.innerHTML = `<h2 class="card-title h4">Фиды</h2>`;
   
    const feedsUlEl = document.createElement('ul');
    feedsUlEl.classList.add('list-group', 'border-0', 'border-end-0');

    for (var feed of state.feeds) {
        const feedLi = document.createElement('li');
        feedLi.innerHTML = `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p></li>`
        feedsEl.appendChild(feedLi)
    }
    feedCardBodyEl.appendChild(feedsUlEl);
    feedsEl.appendChild(feedCardBodyEl);

    //posts render
    const postsEl = document.createElement('div');
    postsEl.classList.add('card', 'border-0');

    const postCardBodyEl = document.createElement('div');
    postCardBodyEl.classList.add('card-body');
    postCardBodyEl.innerHTML = `<h2 class="card-title h4">Посты</h2>`;

    const postsUlEl = document.createElement('ul');
    postsUlEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    console.log(state.posts)  
    console.log(Array.isArray(state.posts))
    state['posts'].map((post)=>{
        console.log('222', post)
    })
    state.posts.forEach(post => {
        console.log(111, post)
        const postLi = document.createElement('li');
        postLi.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="${post.link}" class="fw-bold" data-id="${post.d}" target="_blank" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li>`
        postsUlEl.appendChild(postLi);
    });

    postCardBodyEl.appendChild(postsUlEl);
    postsEl.appendChild(postCardBodyEl);


    console.log(state)  
    elements.feeds.append(feedsEl);
    elements.posts.append(postsEl);

}
export { watch, renderFeeds };