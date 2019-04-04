# nc_news

The API for the Northcoders News Sprint in the Front End block of the course.

## Setup

- Download the source code into a working directory
- Install the dependencies:

```bash
npm install
```

- Create development and test databases locally:

```bash
npm run setup-dbs
```

- Run all migrations:

```bash
npm run migrate:latest:prod
```

- Seed data into the database:

```bash
npm run seed:prod
```

- Run the server with `node`:

```bash
npm run start
```

## Testing Setup

- Create development and test databases locally:

```bash
npm run setup-dbs
```

- Run all migrations:

```bash
npm run migrate-latest
```

- Seed data into the database:

```bash
npm run seed
```

### Testing Scripts

- Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

- Run the server with `node`:

```bash
npm start
```

- Create a new migration file:

```bash
npm run migrate-make <filename>
```

- Rollback all migrations:

```bash
npm run migrate-rollback
```

- Run server tests:

```bash
npm run test-app
```

- Run util tests:

```bash
npm run test-utils
```

- Run app and util tests sequentially:

```bash
npm test
```

## Available Endpoints

### API

```
/api
```

#### GET

```
GET /api
```

Responds with JSON describing all the available endpoints

```
/api/topics
```

```
GET /api/topics
```

Responds with JSON describing all topics

### Articles

```
/api/articles
```

#### GET

```
GET /api/articles
```

Responds with JSON describing all articles. Can be queried by article properties and sorted by querying sort_by and/or order.

### Article by Article ID

```
/api/articles/:article_id
```

```
GET /api/articles/:article_id
```

Responds with JSON describing a specific article.

#### PATCH

```
PATCH /api/articles/:article_id
```

Can modify the specified article by sending a redefinition of a property, e.g.:

```json
{ "title": "new title" }
```

Can also increase or decrease the article's votes by sending e.g.:

```json
{ "inc_votes": 5 }
```

```json
{ "inc_votes": -10 }
```

#### DELETE

### Article Comments by Article ID

```
/api/articles/:article_id/comments
```

### Comment by Comment ID

```
/api/comments/:comment_id
```

### User by Username

```
/api/users/:username
```
