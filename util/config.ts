import { env } from 'process';

require('dotenv').config();

if (!env.DATABASE_URL || !env.SECRET) {
  throw new Error(
    'env variables not set, required variables:\nSECRET\nDATABASE_URL'
  );
}

export const DATABASE_URL = env.DATABASE_URL;
export const SECRET = env.SECRET;
export const PORT = env.PORT || 3001;
