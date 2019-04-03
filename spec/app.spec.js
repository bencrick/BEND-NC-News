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
                expect(articles).to.have.lengthOf(12);
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
      describe('PARAMETRIC BEHAVIOUR', () => {
        describe('/:article_id', () => {
          describe('GET', () => {
            it('can use an /:article_id parameter to filter results by article_id', () => {
              return request
                .get('/api/articles/3')
                .then(({ body: { articles } }) => {
                  expect(articles).to.have.lengthOf(1);
                  expect(articles[0].article_id).to.equal(3);
                });
            });
          });
          describe('PATCH', () => {
            it('produces status: 202', () => {
              return request
                .patch('/api/articles/3')
                .send({ title: 'patched title' })
                .expect(202);
            });
            it('can modify a property of the specified article', () => {
              return request
                .patch('/api/articles/3')
                .send({ title: 'patched title' })
                .then(({ body: { articles } }) => {
                  expect(articles).to.have.lengthOf(1);
                  expect(articles[0].article_id).to.equal(3);
                  expect(articles[0].title).to.equal('patched title');
                });
            });
            it('can increment a numeric property of the specified article', () => {
              return request
                .patch('/api/articles/3')
                .send({ inc_votes: 5 })
                .then(({ body: { articles } }) => {
                  expect(articles).to.have.lengthOf(1);
                  expect(articles[0].article_id).to.equal(3);
                  expect(articles[0].votes).to.equal(5);
                });
            });
          });
          describe('DELETE', () => {
            it('produces status: 204', () => {
              return request.delete('/api/articles/3').expect(204);
            });
            it('responds with no content', () => {
              return request.delete('/api/articles/3').then(({ body }) => {
                expect(body).to.eql({});
              });
            });
          });
          describe('/comments', () => {
            describe('GET', () => {
              it('produces status: 200', () => {
                return request.get('/api/articles/2/comments').expect(200);
              });
              it('returns an object containing an array', () => {
                return request
                  .get('/api/articles/2/comments')
                  .then(({ body: { comments } }) => {
                    expect(comments).to.be.an('array');
                  });
              });
              it('has an object for each comment within the array', () => {
                return request
                  .get('/api/articles/1/comments')
                  .then(({ body: { comments } }) => {
                    expect(comments).to.have.lengthOf(13);
                  });
              });
              it('provides each article object with keys: comment_id, votes, created_at, author, body', () => {
                return request
                  .get('/api/articles/2/comments')
                  .then(({ body: { comments } }) => {
                    const keysRequired = [
                      'comment_id',
                      'votes',
                      'created_at',
                      'author',
                      'body'
                    ];
                    expect(
                      comments.every(comment => {
                        return objHasKeys(comment, keysRequired);
                      })
                    ).to.be.true;
                  });
              });
              it('sorts output articles by descending created_at', () => {
                return request
                  .get('/api/articles/2/comments')
                  .then(({ body: { comments } }) => {
                    expect(comments).to.be.descendingBy('created_at');
                  });
              });
            });
            describe('POST', () => {
              it('produces status: 201', () => {
                return request
                  .post('/api/articles/2/comments')
                  .send({
                    username: 'icellusedkars',
                    body: 'test comment'
                  })
                  .expect(201);
              });
              it('returns posted comment containing sent information', () => {
                return request
                  .post('/api/articles/2/comments')
                  .send({
                    username: 'icellusedkars',
                    body: 'test comment'
                  })
                  .then(res => {
                    const comment = res.body.comment;
                    expect(comment.author).to.equal('icellusedkars');
                    expect(comment.body).to.equal('test comment');
                  });
              });
              it('returns comment containing keys: comment_id, author, article_id, votes, created_at, body', () => {
                return request
                  .post('/api/articles/2/comments')
                  .send({
                    username: 'icellusedkars',
                    body: 'test comment'
                  })
                  .then(res => {
                    const comment = res.body.comment;
                    const keysRequired = [
                      'comment_id',
                      'author',
                      'article_id',
                      'votes',
                      'created_at',
                      'body'
                    ];
                    expect(objHasKeys(comment, keysRequired)).to.be.true;
                    expect(comment.author).to.equal('icellusedkars');
                    expect(comment.body).to.equal('test comment');
                  });
              });
            });
          });
        });
      });
    });
    // COMMENTS
  });
});
