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
        expect(topics).toHaveLength(3);
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
          expect(msg).toBe('Page not found');
        });
    });
  });

  describe("4. GET /api/articles/:article_id", () => {
    it("check the properties of an article object", () => {
      let ARTICLE_ID = 1;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(200)
        .then(({body:{ article }}) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_id");
          expect(article.article_id).toEqual(1);
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






});