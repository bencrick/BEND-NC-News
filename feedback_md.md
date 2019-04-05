## Code

### Migrations

- Could use `notNullable` within your schemas for columns that must be used when posting. For example, can I post a comment without a body?

### Seed

- Be careful with variable naming. `insertArticles` is a confusing name for your article data as it sounds like a function which inserts articles.
- Similarly, `articleTitleToId` sounds like a function which turns titles into IDs where in fact it is a reference object.

### Utils

- your function names could be improved. Functions should be named with verbs which explain what they actually do
- Confusing that you have a function called objArrMap which doesn't actually map! not sure why you are parse and then stringifying?
- Like the idea of making `objArrMap` reusable but its meant you've had to make a lot more functions
- Think you have overcomplicated these a bit, and some of them are mutating data with `forEach`
- To map over the articleData and convert to timestamps, we can simply do this...

```js
return articleData.map(({ created_at, ...articleDatum }) => {
  return {
    created_at: new Date(created_at),
    ...articleDatum
  };
});
```

- using the `new Date` constructor converts the time into the correct format for us, making your `makeTimestamp` function much simpler!
- in `createRefObj` you are essentially doing a reduce so maybe refactor to actually use it
- Similarly for reformatting the comments, you are using your function `objArrMap` (which uses a forEach), then mapping over it. Within the map you are then calling another function and then doing the same thing within the map, when all of this can be done in just one map function.

```js
return commentData.map(
  ({ created_at, created_by, belongs_to, ...commentDatum }) => {
    return {
      created_at: new Date(created_at),
      author: created_by,
      article_id: ref[belongs_to],
      ...commentDatum
    };
  }
);
```

### Routers

- in usersRouter, I would change the name of the `getUsers` controller - in case you add an all users endpoint. Since this is just returning a single user, perhaps rename to `getUser`.

### Controllers

- You are passing in the whole request to your models. Should be handling this properly in the controller before passing to the models. The models are just there to interact with the database, not to handle your requests.
- In `postArticleComment`, you can destructure from the array so don't have to access [0]
- Controllers are missing some error handling, this should be moved out of your models
- See comment below about not `throw` ing errors
- Change 202's to 200

### Models

- Should not be expecting the whole request in your models, they should expect specific parameters such as `article_id`
- Why are using `async` before your functions? this returns an async function object which uses implicit Promises. but since we are returning our knex query and this returns a promise, you don't need to do this.
- Not sure if `Object.assign` is necessary either, especially if you bring in the specific parameters
  e.g. `fetchArticles = ({ author, topic, sort_by, order = "desc" }) =>`
- Might be easier to use `includes` to check if your sort_by is valid. Use your articleFields array.
- We can pass a function into `where` and handle our conditional logic within the function
- In `modifyArticle` and `removeArticle`, you should not be handling the 404 error, but letting this pass through to the controller and handling it there
- There is so much going on in the models it is quite difficult to follow
- In `modifyArticle`, why are you selecting the article first?
- Should not be `throw`ing errors in models
- why using the `objRenameKey` function??
- in `users` not sure what the benefit of using `whereObj` and `userFields`

### Error handling

- You are using `throw` to throw errors. You should be using `next` or `Promise.reject`
- You should be sending the errors to next from the controllers, not the models
- You have written error handling functions in your errors index, so you should use them to handle the errors and the conditional logic be contained in these middleware functions. If it doesnt meet the condition, the error can still be passed to the next error handling block with next - just like in app

### Testing

- Tests are split up and laid out logically and there seems to be sufficient tests
- Some typos. e.g. saying 'articles' in the `it` when you are testing comments
- Be careful when testing lengths as when you add in additional behaviour, e.g. pagination or limits - theses tests will fail

### Other

- README with clear instructions and scripts for seeding the db
- Heroku hosting
- make sure all dependencies listed

### OUR TESTS

33 passing (8s)
16 failing

1. `/articles`
   GET status:200 responds with an empty array for articles queried with non-existent topic:
   Error: expected 200 "OK", got 404 "Not Found"

   - If queried topic is empty, should just not return any articles in the array rather than throw an error.
   - CHANGED - KEEP AS IS - 404 will make error handling on front-end easier

2. `/articles`
   GET status:200 will ignore an invalid sort_by query:
   Error: expected 200 "OK", got 500 "Internal Server Error"

   - If sort query is invalid, should just ignore it and use the default

3. `/articles/:article_id`
   GET status:200 responds with a single article object:
   TypeError: Cannot convert undefined or null to object

   - When sending a single article, should send it on the key 'article'

4. `/articles/:article_id`
   PATCH status:200 and an updated article when given a body including a valid "inc_votes" (VOTE UP):
   Error: expected 200 "OK", got 202 "Accepted"

   - Respond with 200 - 202 means that request has been accepted but processing not completed.

5. `/articles/:article_id`
   PATCH status:200 responds with an updated article when given a body including a valid "inc_votes" (VOTE DOWN):
   Error: expected 200 "OK", got 202 "Accepted"

   - Respond with 200 - 202 means that request has been accepted but processing not completed.

6. `/articles/:article_id`
   PATCH status:200s no body responds with an unmodified article:
   Error: expected 200 "OK", got 500 "Internal Server Error"

   - If patching with no body sent on the request, should return the unmodified article

7. `/api/articles/:article_id/comments`
   GET status:200 can be sorted by author (DEFAULT order=desc):
   Error: expected 200 "OK", got 400 "Bad Request"

   - Should be able to sort comments

8. `/api/articles/:article_id/comments`
   GET status:200 can be sorted by votes (DEFAULT order=desc):
   Error: expected 200 "OK", got 400 "Bad Request"

   - Should be able to sort comments

9. `/api/articles/:article_id/comments`
   GET status:200 can change the sort order (DEFAULT sort_by=created_at):
   Error: expected 200 "OK", got 400 "Bad Request"

   - Should be able to sort comments by ascending date

10. `/api/articles/:article_id/comments`
    POST responds with a 400 when given an invalid article id:
    Error: expected 400 "Bad Request", got 500 "Internal Server Error"

    - if article_id is invalid, should throw a 400

11. `/api/articles/:article_id/comments`
    POST responds with a 400 when given an invalid body referencing a non-existent column:
    Error: expected 400 "Bad Request", got 500 "Internal Server Error"

    - when Posting a comment with an invalid key it should give a 400 error

12. `/api/articles/:article_id/comments`
    POST responds with a 422 when given a non-existent username:
    Error: expected 422 "Unprocessable Entity", got 404 "Not Found"

    - When posting a comment with a username that doesn't exist, should throw a 422 unprocessable entity or a 400 bad request - not a 404

13. `/api/comments/:comment_id`
    PATCH status:200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN):
    Error: expected 200 "OK", got 202 "Accepted"

    - change to 200 (see above)

14. `/api/comments/:comment_id`
    PATCH status:200 with no body responds with an unmodified comment:
    Error: expected 200 "OK", got 500 "Internal Server Error"

    - when patching with no body, should return the unmodified comment and status 200

15. `/api/comments/:comment_id`
    PATCH status:404 non-existent comment_id is used:
    Error: expected 404 "Not Found", got 500 "Internal Server Error"

    - needs handling - if patching a comment_id that does not exist, should 404 as the endpoint cannot be found

16. `/api/comments/:comment_id`
    PATCH status:400 if invalid comment_id is used:
    Error: expected 400 "Bad Request", got 500 "Internal Server Error"
    - error needs handling - if patching a comment with an invalid comment_id, it should throw a 400 bad request,
