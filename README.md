# Employee Management API

A small REST API for managing employee records. The project is built with NestJS and MongoDB and covers the CRUD behaviour that is usually needed in an internal employee directory.

## Features

- create, read and update employee records
- soft delete and restore
- request validation with rejected unknown fields
- pagination, search, filtering and sorting
- duplicate email handling
- Swagger/OpenAPI documentation
- health endpoint with database connectivity check
- unit and HTTP validation tests
- local Docker Compose setup

## Stack

- Node.js and TypeScript
- NestJS
- MongoDB and Mongoose
- class-validator and class-transformer
- Swagger/OpenAPI
- Jest and Supertest
- Docker and GitHub Actions

## Running locally

Requirements:

- Node.js 20 or newer
- MongoDB

Install dependencies and create the local environment file:

```bash
npm install
cp .env.example .env
```

Update `MONGODB_URI` in `.env` if MongoDB is not running on the default local address, then start the API:

```bash
npm run start:dev
```

The API is available at `http://localhost:3000/api/v1` and Swagger documentation at `http://localhost:3000/docs`.

The full application can also be started with Docker:

```bash
docker compose up --build
```

## Endpoints

| Method   | Path                            | Description                         |
| -------- | ------------------------------- | ----------------------------------- |
| `POST`   | `/api/v1/employees`             | Create an employee                  |
| `GET`    | `/api/v1/employees`             | List employees                      |
| `GET`    | `/api/v1/employees/:id`         | Get one employee                    |
| `PATCH`  | `/api/v1/employees/:id`         | Update an employee                  |
| `DELETE` | `/api/v1/employees/:id`         | Mark an employee as inactive        |
| `POST`   | `/api/v1/employees/:id/restore` | Restore an inactive employee        |
| `GET`    | `/api/v1/health`                | Check API and database availability |

The list endpoint supports these query parameters:

- `page` and `limit`
- `status=active|inactive|all`
- `search` for first name, last name or email
- `department`
- `sortBy=createdAt|lastName|dateOfEmployment`
- `sortOrder=asc|desc`

Example:

```text
GET /api/v1/employees?page=1&limit=20&status=active&department=Engineering&sortBy=lastName&sortOrder=asc
```

## Checks

```bash
npm run format:check
npm run lint
npm test
npm run test:e2e
npm run build
```

The CI workflow runs the same checks for pushes and pull requests.
