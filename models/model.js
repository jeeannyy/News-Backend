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

exports.fetchArticles = (topic, sort_by = "created_at", order="asc") => {
  const validSortOptions = 
  ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_id'];

    if (!validSortOptions.includes(sort_by)) {
    return Promise.reject(
      {
        status: 400,
        msg: 'Invalid sort_by query',
      })
    }
    if(!["ASC", "DESC"].includes(order.toUpperCase())) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    if (topic) {
      return db
      .query(
        `SELECT articles.*, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.topic = $1
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`,
        [topic]
      )
      .then((result) => {
        return result.rows;   
      });
    } else {
      return db
      .query(
        `SELECT articles.*, COUNT (comments.article_id)::INT AS comment_count
       FROM articles
       LEFT JOIN comments
       ON articles.article_id = comments.article_id      
       GROUP BY articles.article_id
       ORDER BY ${sort_by} ${order}`
      )
      .then((reviews) => {
        return reviews.rows;
      });
    }

};


exports.selectArticleById = (article_id) => {
  return db
  .query( 
  `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  WHERE articles.article_id = $1 
  GROUP BY articles.article_id;`,
  [article_id]
  )
  .then((review) => {
    if (review.rows.length) {
      return review.rows[0];
    }
    return Promise.reject ({
      status: 404,
      msg: "Invalid Path"
    });
  });
  }; 

  exports.updateVoteById = (article_id, inc_votes) => {
    return db
    .query(
      `UPDATE articles 
      SET votes = votes + $1 
      WHERE article_id = $2 
      RETURNING *;`, 
      [inc_votes, article_id]
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
  const { author, body} = newComment;
  return db
  .query(
    `INSERT INTO comments (votes, author, body, article_id) 
    VALUES(0, $1, $2, $3)
    RETURNING comment_id, votes, created_at, author, body;`
    ,[author, body, article_id]
  )
  .then(({ rows }) => {
    console.log(rows, "this is rows");
    return rows;
  });
}


  exports.removeCommentsById = async (comment_id) => {
    const result = await db.query(
      "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
      [comment_id]
    );
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Invalid Path"
      });
    }
    return result.rows;
  };