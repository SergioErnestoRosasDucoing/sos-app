import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// node-pg returns NUMERIC columns (e.g. rating, price_per_hour) as strings
// by default to avoid float precision loss. We parse them to JS numbers
// here so API responses carry correct JSON types.
types.setTypeParser(types.builtins.NUMERIC, (value: string) => parseFloat(value));

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});
