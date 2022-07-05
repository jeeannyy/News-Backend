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

});