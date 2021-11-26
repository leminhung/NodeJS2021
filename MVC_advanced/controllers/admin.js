const Product = require("../models/product");
const { v4: uuid_v4 } = require("uuid");

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
  const id = uuid_v4();
  req.user
    .createProduct({
      id,
      title,
      price,
      imageUrl,
      description,
    })
    .then((result) => {
      console.log(result);
      res.redirect("products");
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getEditProduct = (req, res, next) => {
  let productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: products[0],
      });
    })
    .catch((err) => {
      console.log("[err--]", err);
      return redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.update(
    {
      title,
      price,
      imageUrl,
      description,
    },
    { where: { id: id } }
  )
    .then(() => {
      console.log("update successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.destroy({
    where: {
      id,
    },
  })
    .then(() => {
      console.log("delete successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("[err--]", err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log("[err--]", err));
};
