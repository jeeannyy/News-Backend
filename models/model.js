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

