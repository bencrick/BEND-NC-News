process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

const { objHasKeys } = require('../utils');

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
      describe('- GET', () => {
        it('produces status: 200', () => {
          return request.get('/api/articles').expect(200);
        });
        it('returns an object containing an array', () => {
          return request.get('/api/articles').then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
          });
        });
        it('has an object for each article within the array', () => {
          return request.get('/api/articles').then(({ body: { articles } }) => {
            expect(articles).to.have.lengthOf(36);
          });
        });
        it('provides each article object with keys: author, title, article_id, body, topic, created_at, votes, comment_count', () => {
          return request.get('/api/articles').then(({ body: { articles } }) => {
            const keysRequired = [
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            ];
            expect(
              articles.every(article => {
                return objHasKeys(article, keysRequired);
              })
            ).to.be.true;
          });
        });
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
