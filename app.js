const express = require("express");
const { getTopics, getArticleById, patchVoteById } = require("./controllers/controller");
const { handleInvalidPaths, handleCustomErrors, handlePSQLErrors, handle500Errors } = require("./controllers/error_handling.controller");


const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id', patchVoteById);

app.use(express.json());

app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

  
module.exports = app;