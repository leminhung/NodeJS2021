const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct = (id, productPrice) => {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => find existing product
      let existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      let existingProduct = cart.products.find((prod) => prod.id === id);
      let updateProduct;
      // Add new product/ increase qty
      if (existingProduct) {
        updateProduct = { ...existingProduct };
        updateProduct.qty = updateProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updateProduct;
      } else {
        updateProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updateProduct];
      }
      console.log({ productPrice, cartPrice: cart.totalPrice });
      cart.totalPrice = cart.totalPrice + +productPrice;
      // Write product to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("[err]", err);
      });
    });
  };
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      let cart = JSON.parse(fileContent);
      let product = cart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      let updateCart = { ...cart };
      updateCart.totalPrice =
        updateCart.totalPrice - product.qty * productPrice;
      updateCart.products = updateCart.products.filter(
        (prod) => prod.id !== id
      );
      fs.writeFile(p, JSON.stringify(updateCart), (err) => {
        console.log("[err]", err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
