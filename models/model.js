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
    if(!article) {
      return Promise.reject({
        status: 404,
        msg: 'Page not found',
      })
    }
    return article;
  })
  }; 


  exports.updateVoteById = (article_id, inc_votes) => {
    return db
    .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];

      if(!article){
        return Promise.reject({
          status: 404,
          msg: `Invalid Path`
        });
      }
      return article;
    });
};

exports.fetchUsers = () => {
  return db
      .query(
        `SELECT * FROM users;`
      )
      .then((result) => {
        console.log(result);
        return result.rows;
      })
} 

exports.selectCommentsById = (article_id) => {
  return db
  .query(
    `SELECT comments.*,
    LEFT JOIN articles ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY comments.article_id;`,
    [article_id]
  )
  .then((rows) => {
    const article = rows[0];
    if(!article) {
      return Promise.reject({
        status: 404,
        msg: 'Page not found',
      })
    }
    return article;
  })
}


