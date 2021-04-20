const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares");

// controller
const { create, remove, getAll } = require("../controllers/coupon");

// routes
router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", getAll);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;