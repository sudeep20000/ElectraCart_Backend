const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");

const getAllProducts = async (req, res) => {
  let query = {};
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.brand) {
    query.brand = req.query.brand;
  }
  if (req.query.color) {
    query.color = req.query.color;
  }
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    query.price = {
      $gte: parseInt(priceRange[0]),
      $lte: parseInt(priceRange[1]),
    };
  }
  if (req.query.search) {
    query.productName = {
      $regex: new RegExp(
        req.query.search.replace(/ [-[\]{}()*+?.,\\^$|#\s]/g, " "),
        "i"
      ),
    };
  }

  const sortOptions = req.query.sortBy ? req.query.sortBy.split(":") : [];
  const sortBy = sortOptions[0] || "brand";
  const sortOrder = sortOptions[1] === "desc" ? -1 : 1;

  const products = await Product.find(query).sort({ [sortBy]: sortOrder });
  res.status(StatusCodes.OK).json({ products });
};

module.exports = { getAllProducts };
