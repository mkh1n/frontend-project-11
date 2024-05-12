export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
  };
  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).reduce((acc, item) => {
    const post = {};
    post.title = item.querySelector('title').textContent;
    post.description = item.querySelector('description').textContent;
    post.link = item.querySelector('link').textContent;
    return [...acc, post];
  }, []);

  return { feed, posts };
};
