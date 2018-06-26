var Product = require("../models/product");

var mongoose = require("mongoose");
mongoose.connect("mongodb://test:test@ds113169.mlab.com:13169/todo");

var products = [
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/414t4ZJ%2BZkL.jpg",
    title: "Exercise roller",
    description: " a very professional description 1",
    price: 1200
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/71HY%2Bu4eHqL._SL1500_.jpg",
    title: "dumbbells",
    description: "a very professional description 2",
    price: 3000
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/91YNqQT9kzL._SL1500_.jpg",
    title: "abs maker",
    description: "a very professional description 3",
    price: 125
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/61VUMGsfDjL._SX569_.jpg",
    title: "Skipping ropes",
    description: "a very professional description4",
    price: 1200
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/51YsMB4ibjL._SL1000_.jpg",
    title: "Push up bar",
    description: "a very professional description 5",
    price: 1290
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/61E8fRldQoL._SL1334_.jpg",
    title: "treadmill",
    description: "a very professional description 6",
    price: 10000
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
