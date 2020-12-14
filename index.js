const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 5000;
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wascw.mongodb.net/emaJohn?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("connected successfully")
});

client.connect((err) => {
  const productsCollection = client.db("emaJohn").collection("products");
  const orderCollection = client.db("emaJohn").collection("orders");
  //   app.post("/addProducts", (req, res) => {
  //       const product = req.body
  //     productsCollection.insertMany(product)
  //     .then(result => {
  //         console.log(result.insertedCount > 0);
  //     })
  //   })
  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:key", (req, res) => {
    console.log(req.params.key);
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        console.log(documents[0]);
        res.send(documents[0]);
      });
  });
  app.post("/reviewProducts", (req, res) => {
    console.log(req.body);
    productsCollection
      .find({ key: { $in: req.body } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    orderCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});



