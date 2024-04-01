const CartItem = require("../models/cart");
const Invoice = require("../models/invoice");
const Feedback = require("../models/feedback");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const addFeedBack = async (req, res) => {
  const { text, type } = req.body;
  if (!text || !type)
    throw new BadRequestError("plz provide feedback or feedback type");
  req.body.addBy = req.user.userId;
  const feedback = await Feedback.create({ ...req.body });
  if (!feedback) throw new BadRequestError("fail to add");
  res.status(StatusCodes.CREATED).json({ feedback });
};

const getCartData = async (req, res) => {
  const cartItem = await CartItem.find({ addBy: req.user.userId });
  if (!cartItem) throw new BadRequestError("no item present");
  res.status(StatusCodes.CREATED).json({ cartItem });
};

const getFilteredCartData = async (req, res) => {
  const cartItem = await CartItem.find({ addBy: req.user.userId });
  if (!cartItem) throw new BadRequestError("no item present");

  const countDuplicates = (array, propertyName) => {
    const countsObj = {};
    const uniqueObjects = {};

    array.forEach((obj) => {
      const value = obj[propertyName];
      if (countsObj[value]) {
        countsObj[value]++;
      } else {
        countsObj[value] = 1;
        uniqueObjects[value] = obj;
      }
    });
    const uniqueArray = Object.values(uniqueObjects);
    return { countsObj, uniqueArray };
  };
  const duplicatesCount = countDuplicates(cartItem, "model");

  res.status(StatusCodes.CREATED).json({ duplicatesCount });
};

const addToCart = async (req, res) => {
  const {
    about,
    available,
    brand,
    color,
    features,
    images,
    model,
    price,
    rating,
    reviews,
    type,
  } = req.body;

  const itemCount = await CartItem.find({ model });
  if (itemCount.length >= 8)
    throw new BadRequestError(
      `Maximum quantity limit exceeded for ${brand} ${model}`
    );

  req.body.addBy = req.user.userId;
  const item = await CartItem.create({ ...req.body });
  if (!item) throw new BadRequestError("fail to add");
  res.status(StatusCodes.CREATED).json({ itemName: item.model });
};

const editQuantity = async (req, res) => {
  let { productName, countObj, productObj } = req.body;

  let newProductObject = { ...productObj };
  delete newProductObject._id;
  newProductObject.addBy = req.user.userId;

  let quantity = countObj[productName];

  let newProductArray = [];
  while (quantity--) {
    newProductArray.push(newProductObject);
  }

  await CartItem.deleteMany({ model: productName });
  await CartItem.insertMany(newProductArray);

  res.status(StatusCodes.CREATED).json({ productName });
};

const getInvoiceData = async (req, res) => {
  const invoiceData = await Invoice.find({
    customerId: req.user.userId,
  });

  if (!invoiceData) throw new BadRequestError("no invoice data present");

  res.status(StatusCodes.CREATED).json({ invoiceData });
};

const addInvoice = async (req, res) => {
  const { uniqueCartItems } = req.body;

  let filteredCartItems = uniqueCartItems.map((item) => {
    const { brand, model, color, images } = item;
    return { brand, model, color, image: images[0] };
  });

  req.body.customerId = req.user.userId;

  const invoice = await Invoice.create({
    ...req.body,
    uniqueCartItems: filteredCartItems,
  });

  await CartItem.deleteMany({ addBy: req.user.userId });

  if (!invoice) throw new BadRequestError("fail to add invoice");

  res.status(StatusCodes.CREATED).json({ invoice });
};

module.exports = {
  addFeedBack,
  addToCart,
  getFilteredCartData,
  getCartData,
  editQuantity,
  getInvoiceData,
  addInvoice,
};
