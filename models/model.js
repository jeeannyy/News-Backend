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

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
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
        msg: 'Invalid Path',
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
        return result.rows;
      })
} 

exports.fetchUserName = () => {
  return db
        .query(
          `SELECT * FROM users where username = $1`, [username]
        )
        .then(({ rows }) => {
          const userName = rows[0];
          console.log(rows, "this is use result");

          if(userName.rowCount === 0){
            return Promise.reject({
              status: 404,
              msg: `No username found`
            })
          }
          return userName;
        })
}
