const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/public");

router.route(`/products`).get(getAllProducts);

module.exports = router;
