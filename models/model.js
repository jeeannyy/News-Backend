const db = require("../db/connection");




exports.fetchTopics = () => {
    return db
      .query(
        `SELECT * FROM topics;`
      )
      .then((result) => {
        return result.rows;
      })
};

exports.fetchArticles = (sort_by = "created_at", order="asc") => {
  const validSortOptions = ['title', 'topic', 'author', 'body', 'created_at', 'votes'];
    if (!validSortOptions.includes(sort_by)) {
    return Promise.reject(
      {
        status: 400,
        msg: 'Invalid sort_by query',
      })
  }

  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};`
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


exports.selectCommentsById = (article_id) => {
  return db
  .query(
    `SELECT * FROM comments WHERE comments.article_id=$1;`
    ,[article_id]
  )
  .then((results) => {
    return results.rows;
  });

};


exports.insertCommentsById = (newComment, article_id) => {
  const { username, body} = newComment;
  return db
  .query(
    `INSERT INTO comments (username, body) 
    VALUES($1, $2)
    WHERE article_id = $3;
    RETURNING *;`
    ,[username, body, article_id]
  )
  .then(({ rows }) => {
    console.log(rows, "this is rows");

    return rows[0];
  });
}

