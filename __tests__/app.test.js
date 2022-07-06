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
    test("400: bad request response for invalid path", () => {
      const incrementVotes = { inc_votes: 99999999 };

      return request(app)
      .patch('/api/articles/NotID')
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
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


  test("404: route that does not exist", () => {
    const incrementVotes = {inc_votes: -100};

    return request(app)
    .patch('/api/articless/1')
    .send(incrementVotes)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Page not found');
    });
  });

});
});