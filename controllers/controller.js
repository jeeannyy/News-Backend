const { fetchTopics, updateVoteById } = require("../models/model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => next(err));
};

exports.patchVoteById = (req, res) => {
  const { article_id } = req.params;
  console.log(body);
  updateVoteById(req.body, article_id)
  .then((article) => res.status(200)
  .send({ article }));
};