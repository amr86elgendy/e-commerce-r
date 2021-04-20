const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body;
  const user = await User.findOne({ email: req.user.email });
  const { totalPrice, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  });

  let finalAmount;
  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = totalPrice * 100;
  }
  console.log(couponApplied, finalAmount);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    totalPrice,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
