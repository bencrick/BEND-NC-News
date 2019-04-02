process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.use(require('chai-sorted'));
const expect = chai.expect;
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
    // TOPICS
    describe('/articles', () => {
      describe('DEFAULT BEHAVIOUR', () => {
        describe('GET', () => {
          it('produces status: 200', () => {
            return request.get('/api/articles').expect(200);
          });
          it('returns an object containing an array', () => {
            return request
              .get('/api/articles')
              .then(({ body: { articles } }) => {
                expect(articles).to.be.an('array');
              });
          });
          it('has an object for each article within the array', () => {
            return request
              .get('/api/articles')
              .then(({ body: { articles } }) => {
                expect(articles).to.have.lengthOf(36);
              });
          });
          it('provides each article object with keys: author, title, article_id, body, topic, created_at, votes, comment_count', () => {
            return request
              .get('/api/articles')
              .then(({ body: { articles } }) => {
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
          it('sorts output articles by descending created_at', () => {
            return request
              .get('/api/articles')
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('created_at');
              });
          });
        });
      });
      describe('QUERY BEHAVIOUR', () => {
        describe('GET', () => {
          it('can use an ?author= query to filter results by author', () => {
            return request
              .get('/api/articles?author=mitch')
              .then(({ body: { articles } }) => {
                expect(articles.every(article => article.author === 'mitch')).to
                  .be.true;
              });
          });
          it('can use a ?topic= query to filter results by topic', () => {
            return request
              .get('/api/articles?topic=mitch')
              .then(({ body: { articles } }) => {
                expect(articles.every(article => article.topic === 'mitch')).to
                  .be.true;
              });
          });
          it('can use a ?sort_by= query to order results by the specified field', () => {
            return request
              .get('/api/articles?sort_by=title')
              .then(({ body: { articles } }) => {
                expect(articles).to.be.descendingBy('title');
              });
          });
          it('can use an ?order= query to sort results in the specified (asc/desc) order', () => {
            return request
              .get('/api/articles?order=asc')
              .then(({ body: { articles } }) => {
                expect(articles).to.be.ascendingBy('created_at');
              })
              .then(
                request
                  .get('/api/articles?order=desc')
                  .then(({ body: { articles } }) => {
                    expect(articles).to.be.descendingBy('created_at');
                  })
              );
          });
        });
      });
      //describe('PARAMETRIC BEHAVIOUR', () => { })
    });
    // COMMENTS
  });
});
