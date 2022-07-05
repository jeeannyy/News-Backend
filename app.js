const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();

app.get('/api/topics', getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});
  
module.exports = app;