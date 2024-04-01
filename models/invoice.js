const mongoose = require("mongoose");

const myObjectSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide username"],
  },
  address: {
    type: String,
    required: [true, "Please provide customer address"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Please provide payment method"],
  },
  totalMRP: {
    type: Number,
    required: [true, "Please provide total amount"],
  },
  extraCharges: {
    type: Number,
    required: [true, "Please provide extra charges"],
  },
  estimatedDate: {
    type: String,
    required: [true, "Please provide estimated date"],
  },
  uniqueCartItems: [myObjectSchema],
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide author id"],
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
