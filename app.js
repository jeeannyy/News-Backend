const express = require("express");
const { getTopics, getArticleById } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use(express.json());

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Invalid input" });
  });
  
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
  });

  
module.exports = app;