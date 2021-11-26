const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.id;
  Product.findAll({ where: { id: prodID } })
    .then((products) => {
      console.log(products);
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      console.log("[cart--]", cart);
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log("[err--]", err.message));
    })
    .catch((err) => console.log("[err--]", err.message));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let newQty = 1;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart
        .getProducts({ where: { id: productId } })
        .then((products) => {
          let product;
          if (products.length > 0) {
            product = products[0];
          }
          // if have existing product in cart
          if (product) {
            let oldQty = product.cartItem.qty;
            newQty = oldQty + 1;
            return product;
          }
          // Add new product to cart
          return Product.findByPk(productId);
        })
        .then((product) => {
          return fetchedCart.addProduct(product, { through: { qty: newQty } });
        })
        .then(() => res.redirect("/cart"))
        .catch((err) => console.log("[err--]", err));
    })
    .catch((err) => console.log("[err--]", err));
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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: id } });
    })
    .then((products) => {
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log("[err--]", err));
};
