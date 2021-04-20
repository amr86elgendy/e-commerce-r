const User = require('../models/user')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')
const Product = require('../models/product')
const uniqueid = require('uniqueid')

exports.createCart = async (req, res) => {
  const { cart } = req.body

  const user = await User.findOne({ email: req.user.email })

  const cartExistByThisUser = await Cart.findOne({ orderedBy: user._id })
  if (cartExistByThisUser) cartExistByThisUser.remove()

  const products = cart.map((p) => {
    return {
      product: p._id,
      count: p.count,
      color: p.color,
      price: p.price,
    }
  })

  const totalPrice = cart.reduce((acc, p) => {
    return acc + p.price * p.count
  }, 0)

  const order = await Cart.create({
    products,
    totalPrice,
    orderedBy: user._id,
  })

  res.json({ order, ok: true })
}

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email })
  const order = await Cart.findOne({ orderedBy: user._id }).populate(
    'products.product',
    'title price'
  )
  res.json(order)
}

exports.deleteUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email })
  const order = await Cart.findOneAndDelete({ orderedBy: user._id })
  res.json(order)
}

exports.saveAddress = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address },
    { new: true }
  )

  res.json(user)
}

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body
  const validCoupon = await Coupon.findOne({ name: coupon })
  if (!validCoupon) {
    return res.json({
      err: 'Invalid coupon',
    })
  }
  const user = await User.findOne({ email: req.user.email })
  const { totalPrice } = await Cart.findOne({ orderedBy: user._id }).populate(
    'products.product',
    '_id title price'
  )
  // calculate the total after discount
  let totalAfterDiscount = (
    totalPrice -
    (totalPrice * validCoupon.discount) / 100
  ).toFixed(2) // 99.99

  await Cart.findOneAndUpdate({ orderedBy: user._id }, { totalAfterDiscount })
  res.json(totalAfterDiscount)
}

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse
  const user = await User.findOne({ email: req.user.email })
  const { products } = await Cart.findOne({ orderedBy: user._id })

  await Order.create({
    products,
    paymentIntent,
    orderedBy: user._id,
  })
  // decrement quantity, increment sold
  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })

  await Product.bulkWrite(bulkOption, {})
  res.json({ ok: true })
}

exports.getUserOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email })
  const userOrders = await Order.find({ orderedBy: user._id }).populate(
    'products.product'
  )
  res.json(userOrders)
}

exports.createCashOrder = async (req, res) => {
  const { COD, coupon } = req.body

  if (!COD) return res.status(400).send('Create cash order failed')

  const user = await User.findOne({ email: req.user.email })

  const userCart = await Cart.findOne({ orderedBy: user._id });
// console.log(userCart);
  let finalAmount = 0

  if (coupon && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100
  } else {
    finalAmount = userCart.totalPrice * 100
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: 'usd',
      status: 'Cash On Delivery',
      created: Date.now(),
      payment_method_types: ['cash'],
    },
    orderedBy: user._id,
    orderStatus: 'Cash On Delivery',
  }).save()

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })

  await Product.bulkWrite(bulkOption, {})

  console.log('NEW ORDER SAVED', newOrder)
  res.json({ ok: true })
}
