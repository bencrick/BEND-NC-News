process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    // describe('/topics', () => {
    //   it('GET status:200', () => {
    //     return request
    //       .get('/api/topics')
    //       .expect(200)
    //       .then(({ body }) => {
    //         expect(body.ok).to.equal(true);
    //       });
    //   });
    // });
    describe('/articles', () => {
      it('GET status:200', () => {
        return request
          .get('/api/articles')
          .expect(200)
          //.then(({ body }) => {
          //  expect(body.ok).to.equal(true);
          //});
      });
    });
    // describe('/comments', () => {
    //   it('GET status:200', () => {
    //     return request
    //       .get('/api/comments')
    //       .expect(200)
    //       .then(({ body }) => {
    //         expect(body.ok).to.equal(true);
    //       });
    //   });
    // });
  });
});
