const makeRouter = require('../controllers/crudFactory');

module.exports = makeRouter(
  'journalEntry',
  ['title', 'content'],
  (b) => ({
    title: b.title,
    content: b.content,
    tags: b.tags || null,
    isPublic: b.isPublic || false,
    date: b.date || new Date().toISOString().split('T')[0],
  })
);
