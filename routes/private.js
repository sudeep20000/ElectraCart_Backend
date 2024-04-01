const express = require("express");
const router = express.Router();
const {
  addFeedBack,
  addToCart,
  getFilteredCartData,
  getCartData,
  editQuantity,
  getInvoiceData,
  addInvoice,
} = require("../controllers/private");

router.route("/addFeedback").post(addFeedBack);
router.route("/cartItems").get(getCartData);
router.route("/filteredCartItems").get(getFilteredCartData);
router.route("/addItem").post(addToCart);
router.route("/editProductQuantity").post(editQuantity);
router.route("/invoice").get(getInvoiceData);
router.route("/addInvoiceData").post(addInvoice);

module.exports = router;
