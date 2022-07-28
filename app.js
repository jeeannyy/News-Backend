const express = require("express");
const { getTopics, getArticles, getArticleById, getUsers, patchVoteById, getCommentsById, postCommentsById, deleteCommentsById } = require("./controllers/controller");
const { handleInvalidPaths, handleCustomErrors, handlePSQLErrors, handle500Errors } = require("./controllers/error_handling.controller");

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);
app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', patchVoteById);

app.post('/api/articles/:article_id/comments', postCommentsById);

app.delete('/api/comments/:comment_id', deleteCommentsById);

// app.get('/api', getApi);





app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

  
module.exports = app;