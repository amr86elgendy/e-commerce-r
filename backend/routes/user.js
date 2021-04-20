const express = require('express');
// middlewares
const { authCheck } = require('../middlewares');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/user')

const router = express.Router()

// Wishlist
router.post('/user/wishlist', authCheck, addToWishlist)
router.get('/user/wishlist', authCheck, getWishlist)
router.delete('/user/wishlist/:productId', authCheck, removeFromWishlist)

module.exports = router;