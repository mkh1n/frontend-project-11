export default (state, elements) => {
    const { feeds } = state;
    const feedListEl = document.createElement('div');
    feedListEl.classList.add('card', 'border-0');

    const feedEl = document.createElement('div');
    feedEl.classList.add('card-body');
    feedEl.innerHTML = `<h2 class="card-title h4">${i18n.t('feeds')}</h2>`;
    feedListEl.append(feedEl);

    const ulEl = document.createElement('ul');
    ulEl.classList.add('list-group', 'border-0', 'border-end-0');
    feedListEl.append(ulEl);
    
    feeds.array.forEach(feed => {
        
    });
}