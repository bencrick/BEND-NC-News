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

### Testing scripts

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
