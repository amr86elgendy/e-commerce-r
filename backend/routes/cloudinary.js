const express = require('express');
const { authCheck, adminCheck } = require('../middlewares');
const { uploadImages, deleteImage } = require('../controllers/cloudinary')

const router = express.Router();

router.post('/uploadimages', authCheck, adminCheck, uploadImages)
router.post('/deleteimage', authCheck, adminCheck, deleteImage)

module.exports = router;