# nc_news

The API for the Northcoders News Sprint in the Front End block of the course.

## Getting Started

- Download the source code into a working directory
- Install the dependencies:

```javascript
npm install
```

- Set up databases

```javascript
npm run setup-dbs
```

- Perform table migrations:

```javascript
npm run migrate:latest:prod
```

- Run the seed to insert data:

```javascript
npm run seed:prod
```

- Begin listening:

```javascript
npm run start
```

## Available Scripts

Create development and test databases locally:

```bash
npm run setup-dbs
```

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Run tests:

```bash
npm test
```

Rollback, migrate -> latest, then start inserting data into the database:

```bash
npm run seed
```

Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

Run the server with `node`:

```bash
npm start
```
