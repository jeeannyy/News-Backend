const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");

const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");



beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});



describe('Testing for News app', () => {

  describe('3. Get /api/topics', () => {
    it('200: return all topics', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
   }); 
    it("404: invalid path", () => {
      return request(app)
        .get("/api/topicss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid Path');
        });
    });
});





  describe("4. GET /api/articles/:article_id", () => {
    it("Check the properties of article object", () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body:{ article }}) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article.article_id).toEqual(2);
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
      .get('/api/articles/notAnID')
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
      });
  });
    it("404: bad request response for the vaild ID but the article does not exist in the database", () => {
      return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path');
      });
    });
  });





  describe("5. PATCH /api/articles/:article_id", () => {
    test("check the vote by passed newVote", () => {
      const incrementVotes = { inc_votes: 1 };

      return request(app)
        .patch('/api/articles/1')
        .send(incrementVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
            article_id: 1,
          });
        });
    });
    test("400: bad request response for invalid ID", () => {
      const incrementVotes = { inc_votes: 99999999 };

      return request(app)
      .patch('/api/articles/NotID')
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Invalid input"); // invalid path
      });
  });

    test("400: bad request for patch body without inc_votes", () => {
      const incrementVotes = {};

      return request(app)
      .patch('/api/articles/1')
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
    });

    test("400: bad request for string inc_votes", () => {
      const incrementVotes = {inc_votes: 'potato'};

      return request(app)
      .patch('/api/articles/1')
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
    });
  });


  describe('6. GET /api/users', () => {

    test('200: return all users', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });

    test("404 for invalid paths", () => {
      return request(app)
        .get("/api/userss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid Path');
          });
        });
      });




  describe("7. GET /api/articles/:article_id (comment count)", () => {
    test("check an article object has comment_count property", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({body:{ article }}) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("comment_count");
        });
    });
    test("check comment count for an specific id", () => {
      return request(app)
        .get(`/api/articles/9`)
        .expect(200)
        .then(({body:{ article }}) => {
          expect(article.comment_count).toEqual(2);
        });
    });
    test("404: bad request response for the invaild ID", () => {
      return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path');
      });
    });
  });

  //Ticket 8
  describe("8. GET /api/articles", () => {
    test("200: check an article object has all property", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({body:{ articles }}) => {
          console.log(articles);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("comment_count");
          })
        });
      });

      test("200: check comment_count is the total count of all the comments with this article_id", () => {
        return request(app)
          .get(`/api/articles/3`)
          .expect(200)
          .then(({body:{ article }}) => {
            expect(article.comment_count).toEqual(2);
          });
      });

        test("200: check articles are sorted by date in descending order", () => {
          return request(app)
            .get(`/api/articles`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at", { descending: true });
            });
          });    
        });


  // Ticket 9 Starts
  describe("9. GET /api/articles/:article_id/comments", () => {
    test("check an article object has 5 property", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { articles } } ) => {
          // expect(articles).toHaveLength(10);
          articles.forEach((article) => {
          expect(article).toHaveProperty("comment_id");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
         });
        });
    });
    it("400: bad request response for invalid path", () => {
      return request(app)
      .get('/api/articles/notAnID')
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
      });
    });
    test("404: bad request response for the invaild ID", () => {
      return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe('Invalid Path');
      });
    });
  });   
   // Ticket 9 Ends
   
   
   // Ticket 10 Starts
//    Request body accepts:
// - an object with the following properties:
//   - `username`
//   - `body`

// Responds with:
// - the posted comment

   describe("10. POST /api/articles/:article_id/comments", () => {
    // test('201: responds with newly added to the database', () => {
    //   const newComment = {
    //     username: 'Jeeanny',
    //     body: 'Call me Jeeann',
    //   };
    //   return request(app)
    //     .post(`/api/articles/1/comments`)
    //     .send(newComment)
    //     .expect(201)
    //     .then(({ body } ) => {
    //       expect(body.article).toEqual({
    //         article_id: 1,
    //         ...newComment,
    //       });
    //      });
    //     });

      test("400: bad request response for invalid path", () => {
          return request(app)
          .get('/api/articles/notAnID/comments')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe("Invalid input");
          });
        });
    // test("404: bad request response for the invaild ID", () => {
    //       return request(app)
    //       .get('/api/articles/99999/comments')
    //       .expect(404)
    //       .then(({ body }) => {
    //           expect(body.msg).toBe('Invalid Path');
    //       });
    //     });
      
    });
  });  
