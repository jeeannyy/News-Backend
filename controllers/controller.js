const { fetchTopics, fetchArticles, selectArticleById, updateVoteById, selectCommentsById, fetchUsers, insertCommentsById } = require("../models/model");


exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => next(err));
};


exports.patchVoteById = (req, res, next) => {
  const { article_id } = req.params;
  const{ inc_votes } = req.body;

    updateVoteById(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsById(article_id)
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => next(err));
}


exports.postCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  insertCommentsById(article_id)
  .then((articles) => {
    res.status(201).send({ articles });
  })
  .catch((err) => next(err));
}