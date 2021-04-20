const express = require('express')
const { auth } = require('../firebase')
const { orders, orderStatus } = require('../controllers/admin')

const router = express.Router()

// middlewares
const { authCheck, adminCheck } = require('../middlewares')

router.get('/admin/orders', authCheck, adminCheck, orders)
router.put('/admin/order-status', authCheck, adminCheck, orderStatus)

module.exports = router