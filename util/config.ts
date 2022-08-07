require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env variable not set');
}

export const DATABASE_URL = process.env.DATABASE_URL;

export const PORT = process.env.PORT || 3001;
