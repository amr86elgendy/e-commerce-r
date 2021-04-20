const Order = require('../models/order')
const User = require('../models/user')

exports.orders = async (req, res) => {
  const orders = await Order
    .find({})
    .sort('-createdAt')
    .populate('products.product')

  res.json(orders)
}

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body
  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  )
  console.log(updated);
  res.json(updated)
}
