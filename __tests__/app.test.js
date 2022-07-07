const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db");
const request = require("supertest");
const app = require("../app");
const users = require('../db/data/test-data/users');

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


  test("404: page not found for invalid id", () => {
    const incrementVotes = {inc_votes: 1};

    return request(app)
    .patch('/api/articles/9999')
    .send(incrementVotes)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid Path');
    });
  });

});

describe('6. GET /api/users', () => {

  test('200: return all users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body: { users } }) => {
      expect(users).toHaveLength(3);
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
        expect(msg).toBe('Page not found');
        });
      });
    });

});