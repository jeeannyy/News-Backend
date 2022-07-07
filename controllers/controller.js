const { fetchTopics, selectArticleById, updateVoteById } = require("../models/model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        res.status(200).send({ topics });
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

  console.log(req.body, "This is req.body");
  // if (!req.body.hasOwnProperty("inc_votes")) {
  //   console.log("err");
  //   return Promise.reject({
  //     status: 400, 
  //     msg: 'Invalid input'
  //   });
  // } else{
    updateVoteById(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => next(err));
    // }
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};