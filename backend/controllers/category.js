const Product = require('../models/product');
const Category = require('../models/category');
const Sub = require('../models/sub');
const slugify = require('slugify');

// GET ALL CATEGORY
exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(400).send('Get Categories Failed');
  }
};

// CREATE CATEGORY
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send('Create Category Failed');
  }
};

// GET SINGLE CATEGORY
exports.getOne = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate('category');
    res.json({ category, products });
  } catch (error) {
    console.log(error);
    res.status(400).send('Get Category Failed');
  }
};

// UPDATE CATEGORY
exports.update = async (req, res) => {
  const { name } = req.body;
  const { slug } = req.params;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send('Update Category Failed');
  }
};

// DELETE CATEGORY
exports.remove = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send('Delete Category Failed');
  }
};

// GET SUB CATEGORIES
exports.getSubs = async (req, res) => {
  try {
    const subs = await Sub.find({ parent: req.params.id });
    res.json(subs);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
