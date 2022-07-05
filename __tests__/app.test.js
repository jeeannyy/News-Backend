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
          expect(msg).toBe('Page not found');
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
          expect(body.msg).toBe('Page not found');
      });
    });
  });


  describe("5. PATCH /api/articles/:article_id", () => {
    it("check the vote by passed positive newVote", () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body:{ article }}) => {
          // console.log(article, "this is article");
          article.inc_votes = 1;
          article.votes = article.votes + article.inc_votes;
          expect(article.votes).toEqual(101);
        });
    });
    it("check the vote by passed negative newVote", () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body:{ article }}) => {
        article.inc_votes = -1;
        article.votes = article.votes + article.inc_votes;
        expect(article.votes).toEqual(99);
        });
    });
    // it("404: bad request response for the vaild ID but the article does not exist in the database", () => {
    //   let article_id = 1
    //   // articles[article_id].inc_votes = -999999;
    //   // articles[article_id].votes = articles[article_id].votes + articles[article_id].inc_votes;
    //   return request(app)
    //   .get(`/api/articles/${article_id}`)
    //   .expect(200)
    //   .then(({body:{ article }}) => {
    //     article.inc_votes = -1;
    //     article.votes = article.votes + article.inc_votes;
    //     expect(article.votes).toEqual(99);
    //     })
    //   // .expect(400)
    //   .then(({ body }) => {
    //     expect(body.msg).toBe('Invalid input');
    //   });
    // });
  });
});