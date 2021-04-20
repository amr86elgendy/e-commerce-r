const express = require('express');
const { authCheck, adminCheck } = require('../middlewares');
const {
  list,
  create,
  getOne,
  update,
  remove,
  getSubs
} = require('../controllers/category');
const router = express.Router();

router.get('/category/all', list);
router.post('/category/create', authCheck, adminCheck, create);
router.get('/category/:slug', getOne);
router.put('/category/:slug', authCheck, adminCheck, update);
router.delete('/category/:slug', authCheck, adminCheck, remove);
router.get('/category/subs/:id', getSubs);

module.exports = router;
