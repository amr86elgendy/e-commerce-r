const express = require('express');
const router = express.Router();
const { authCheck } = require('../middlewares');
const {
  createCart,
  getUserCart,
  deleteUserCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  createCashOrder,
  getUserOrders,
} = require('../controllers/cart')

router.post('/cart/create', authCheck, createCart)
router.get('/cart', authCheck, getUserCart)
router.delete('/cart', authCheck, deleteUserCart)
router.put('/user/address', authCheck, saveAddress);
router.post('/cart/coupon', authCheck, applyCouponToUserCart)
// Order
router.post('/order/create', authCheck, createOrder)
router.post('/cash-order/create', authCheck, createCashOrder)
router.get('/orders', authCheck, getUserOrders)

module.exports = router;
