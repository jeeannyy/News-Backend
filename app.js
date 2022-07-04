const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getTopics);

app.use(express.json());

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
    if (typeof err === "string") {
      res.status(400).send({ msg: err });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  });

  
  module.exports = app;