const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updateProduct = [...products];
        updateProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  static deleteProduct(id) {
    getProductsFromFile((products) => {
      let updateProducts = products.filter((product) => product.id !== id);
      let productDelete = products.find((prod) => prod.id === id);
      fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
        console.log(err);
      });
      Cart.deleteProduct(id, productDelete.price);
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(prodID, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === prodID);
      if (product) cb(product);
    });
  }
};
