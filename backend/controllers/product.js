const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

// CREATE PRODUCT
exports.create = async (req, res) => {
  try {
    // console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

// GET PRODUCTS BY COUNT
exports.getByCount = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']])
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

// GET ONE PRODUCT
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subs')
      .exec();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

// DELETE PRODUCT
exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deletedProduct);
  } catch (err) {
    console.log(err);
    return res.staus(400).send('Product delete failed');
  }
};

// UPDATE PRODUCT
exports.update = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

// GET PRODUCTS AND SORT
// exports.getAndSort = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ err: err.message });
//   }
// };

// GET PRODUCTS AND SORT WITH PAGINATION getAndSortWithPagination
exports.getAndSort = async (req, res) => {
  try {
    console.log(req.body);
    const { sort, order, page = 1 } = req.body;
    const perPage = 3;
    const products = await Product.find({})
      .skip((page - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.rating = async (req, res) => {
  const { star } = req.body;
  const product = await Product.findById(req.params.productId);
  const user = await User.findOne({ email: req.user.email });

  const alreadyRated = product.ratings.find(
    (one) => one.postedBy.toString() === user._id.toString()
  );
  if (!alreadyRated) {
    const ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      { $push: { ratings: { star, postedBy: user._id } } },
      { new: true }
    );
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      { $set: { 'ratings.$.star': star } },
      { new: true }
    );
    res.json(ratingUpdated);
  }
};

exports.getAllRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

  res.json(related);
};

// ########################################################
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');

  res.json(products);
};
const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name');

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name');

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
const handleStars = async (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        // title: "$title",
        floorAverage: {
          $floor: { $avg: '$ratings.star' }, // floor value of 3.33 will be 3
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log('AGGREGATE ERROR', err);
      console.log(aggregates);
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
          if (err) console.log('PRODUCT AGGREGATE ERROR', err);
          res.json(products);
        });
    });
};
const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');

  res.json(products);
};
const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name');

  res.json(products);
};

exports.search = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body;

  if (query) {
    await handleQuery(req, res, query);
  }
  if (price) {
    await handlePrice(req, res, price);
  }
  if (category) {
    await handleCategory(req, res, category);
  }
  if (stars) {
    await handleStars(req, res, stars);
  }
  if (sub) {
    await handleSub(req, res, sub);
  }
  if (shipping) {
    await handleShipping(req, res, shipping);
  }

  if (color) {
    await handleColor(req, res, color);
  }

  if (brand) {
    await handleBrand(req, res, brand);
  }
};
