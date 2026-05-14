## CSV Parsing App

Imports a customer CSV file into a SQLite database.

# Technologies
- Next.js
- TypeScript
- Prisma ORM
- SQLite (via Better SQLite3)

## Getting Started

1. Install dependencies: `npm install`
2. Apply database migrations: `npx prisma migrate dev`
3. Seed the database: `npx prisma db seed` (note: if the DB has already been populated, this will replace any existing useres)
4. Start the development server: `npm run dev`

The app will be available at [http://localhost:3000](http://localhost:3000).

## CSV Format

The seed script reads `data/customers.csv` from the root of the repository (one level above this directory). The file must have a header row with the following columns:

| Column       | Type    | Constraints       |
|--------------|---------|-------------------|
| `id`         | integer | required, unique  |
| `first_name` | string  | required          |
| `last_name`  | string  | required          |
| `email`      | string  | required, unique  |
| `gender`     | string  | required          |
| `ip_address` | string  | required          |
| `company`    | string  | required          |
| `city`       | string  | required          |
| `title`      | string  | required          |
| `website`    | string  | required          |

A non-numeric `id` will throw before any database writes. Missing columns will cause Prisma to fail at insert time.

## API

### `GET /api/customers`

Returns a paginated list of customers.

| Parameter | Type    | Default | Description                        |
|-----------|---------|---------|------------------------------------|
| `page`    | integer | `1`     | Page number. Invalid values default to `1`. |

**Response**

```json
{
  "customers": [...],
  "page": 1,
  "pageSize": 25,
  "total": 1000,
  "totalPages": 40
}
```

## Running Tests

```bash
npm test
```
