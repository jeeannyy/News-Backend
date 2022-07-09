const express = require("express");
const { getTopics, getArticles, getArticleById, getUsers, patchVoteById, getUserName } = require("./controllers/controller");
const { handleInvalidPaths, handleCustomErrors, handlePSQLErrors, handle500Errors } = require("./controllers/error_handling.controller");

const app = express();
app.use(express.json());
// should be on top!!!!!!!


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchVoteById);

app.get('/api/users', getUsers);
app.get('/api/users', getUserName);

app.get('/api/articles/:article_id/comments', getCommentsById);




app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

  
module.exports = app;