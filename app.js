const express = require("express");
const { getTopics, getArticleById, getUsers } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getArticleById);

app.use(express.json());

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
  });
  
module.exports = app;