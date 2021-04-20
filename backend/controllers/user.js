const User = require('../models/user')

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  )

  res.json({ ok: true, msg: 'successfully added' })
}

exports.getWishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')

  res.json(list)
}

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  )

  res.json({ ok: true, msg: 'successfully removed' })
}
