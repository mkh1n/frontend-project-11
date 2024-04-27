
export default  (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const feed = {
        title: doc.querySelector('title').textContent,
        description: doc.querySelector('description').textContent
    }
    const items = doc.querySelectorAll('item');
    const posts = Array.from(items).reduce((acc, item) => {
        const feed = {};
        feed.title = item.querySelector('title').textContent;
        feed.description = item.querySelector('description').textContent;
        feed.link = item.querySelector('link').textContent;
        return [...acc, feed]
    }, [])
    
    return {feed, posts};
}
