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
      cart.totalPrice = cart.totalPrice + +productPrice;
      // Write product to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("[err]", err);
      });
    });
  };
};
