const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

// CREATE SUB CATEGORY
exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
  } catch (err) {
    console.log(err);
    res.status(400).send("Create sub failed");
  }
};

// GET ALL SUB CATEGORIES
exports.list = async (req, res) =>
  res.json(await Sub.find({}).sort({ createdAt: -1 }));

// GET SINGEL SUB CATEGORY
exports.getOne = async (req, res) => {
  const sub = await Sub.findOne({ slug: req.params.slug });
  const products = await Product.find({ subs: sub }).populate('category');

  res.json({ sub, products });
};

// UPDATE SUB CATEGORY
exports.update = async (req, res) => {
  const { name, parent } = req.body;
  console.log(name);
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Sub update failed");
  }
};

// DELETE SUB CATEGORY
exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Sub delete failed");
  }
};