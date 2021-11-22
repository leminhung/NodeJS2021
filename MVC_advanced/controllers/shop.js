const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.id;
  Product.findById(prodID)
    .then(([product]) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    let cartProduct = [];
    Product.fetchAll()
      .then(([rows, fieldData]) => {
        for (prod of rows) {
          let displayProduct = cart.products.find(
            (product) => product.id === prod.id
          );
          if (displayProduct) {
            cartProduct.push({
              product: prod,
              qty: displayProduct.qty,
            });
          }
        }
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProduct,
        });
      })
      .catch((err) => console.log("[err--]", err.message));
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/cart");
  });
};
