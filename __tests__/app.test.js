const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});


describe('News app', () => {
   describe('3.Get/api/topics', () => {
    it('200: return all topics', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
   }); 
});

   describe("Sad paths :( ", () => {
    it("404 for invalid paths", () => {
      return request(app)
        .get("/api/topicss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Path");
        });
    });
  });



  describe("4. GET /api/articles/:article_id", () => {
    it("check the properties of an article object", () => {
      // let ARTICLE_ID = 2;
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body:{ article }}) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article.article_id).toEqual(2);
          
        });
    });
  });


  describe("5. PATCH /api/articles/:article_id", () => {
    it("status:200, responds with the updated article", () => {
      let articleUpdates = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
      };
      let newVote = 1;
      let ARTICLE_ID = 2;

      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(200)
        .then(({body:{ article }}) => {
          expect(articleUpdates.votes).toEqual(101);
        });
    });
    // it("check the vote by passed newVote", () => {
    //   let newVote = 1;
    //   let testObj = { inc_votes: newVote };
    //   return request(app)
    //     .get(`/api/articles/2`)
    //     .expect(200)
    //     .then(({body:{ article }}) => {
    //       expect(article.votes).toEqual(1);
    //       console.log(article);
    //     });
    // });
    // it("check the vote by passed newVote", () => {
    //   let newVote = -100;
    //   let testObj = { inc_votes: newVote };
    //   return request(app)
    //     .get(`/api/articles/1`)
    //     .expect(200)
    //     .then(({body:{ article }}) => {
    //       expect(article.votes).toEqual(0);
    //     });
    // });
  });





});