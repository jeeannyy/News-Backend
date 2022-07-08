\c nc_news_test;  
  
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes 
      FROM articles 
      COUNT(comments.article_id)::INT AS comment_count FROM comments 
      JOIN comments 
      ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id
      ORDER BY created_at DESC;