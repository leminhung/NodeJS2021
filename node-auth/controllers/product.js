const Product = require("../models/Product");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");
module.exports = {
  postProduct: async (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;
    await Product.create({ title, price, description, userId });
    res.status(codeEnum.SUCCESS).json({ msg: msgEnum.ADD_SUCCESS });
  },
  getProducts: async (req, res, next) => {
    const products = await Product.find({});
    res.status(codeEnum.SUCCESS).json({ products });
  },
  getProduct: async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(codeEnum.NOT_FOUND)
        .json({ msg: msgEnum.DATA_NOT_FOUND });
    }
    return res.status(codeEnum.SUCCESS).json({ product });
  },
  deleteProduct: async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findOneAndDelete({
      _id: productId,
      userId: req.user._id,
    });
    if (!product) {
      return res
        .status(codeEnum.NOT_FOUND)
        .json({ msg: msgEnum.DATA_NOT_FOUND });
    }

    return res.status(codeEnum.SUCCESS).json({ product });
  },
};
