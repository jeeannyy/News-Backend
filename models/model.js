const db = require("../db/index");

exports.fetchTopics = () => {
    return db
      .query(
        `SELECT * FROM topics;`
      )
      .then((result) => {
        return result.rows;
      })
};


exports.selectArticleById = (article_id) => {
  return db
  .query( 'SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
  [article_id]
  )
  .then(({ rows }) => {
    const article = rows[0];
    // console.log(article);
    if(!article) {
      return Promise.reject({
        status: 404,
        msg: 'Page not found',
      })
    }
    return article;
  })
};
