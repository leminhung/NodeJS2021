const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log("[err--]", err.massage));
};

exports.getEditProduct = (req, res, next) => {
  // let editMode = req.query.edit;
  let productId = req.params.productId;
  // if (!editMode) {
  //   return res.redirect("/");
  // }
  Product.findById(productId, (product) => {
    if (!product) {
      return redirect("/");
    }
    console.log({ product });
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      // editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const updateProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updateProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId);
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
