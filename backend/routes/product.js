const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares');

// controller
const {
  create,
  getByCount,
  getOne,
  remove,
  update,
  getAndSort,
  productsCount,
  rating,
  getAllRelated,
  search
} = require('../controllers/product');

// routes
router.post('/product', create);
router.get('/products/total', productsCount);
router.get('/products/:count', getByCount);
router.get('/product/:slug', getOne);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update);

router.post('/products', getAndSort);
// Rating
router.put('/product/star/:productId', authCheck, rating);
// Related
router.get('/product/related/:productId', getAllRelated);
// Search
router.post('/search', search)

module.exports = router;
