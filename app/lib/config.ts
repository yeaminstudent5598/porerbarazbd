// lib/config.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGO_URI) {
  throw new Error('FATAL ERROR: MONGO_URI is not defined in .env.local');
}
if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('FATAL ERROR: JWT_ACCESS_SECRET is not defined in .env.local');
}

const config = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: process.env.PORT || 3000,
  mongo_uri: process.env.MONGO_URI,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET!,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  },
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
};

export default config;
