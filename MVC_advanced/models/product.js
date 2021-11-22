const Cart = require("./cart");
const db = require("../util/database");
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES(?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }
  static deleteProduct(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(prodID) {
    return db.execute("SELECT * FROM products WHERE id = ?", [prodID]);
  }
};
