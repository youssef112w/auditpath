const makeRouter = require('../controllers/crudFactory');

module.exports = makeRouter(
  'vulnerability',
  ['name'],
  (b) => ({
    name: b.name,
    category: b.category || 'General',
    severity: b.severity || 'HIGH',
    description: b.description || '',
    code: b.code,
    exploit: b.exploit,
    fix: b.fix,
    refs: b.refs,
    isPublic: b.isPublic || false,
    ...(b.createdAt ? {} : { }),
  })
);
