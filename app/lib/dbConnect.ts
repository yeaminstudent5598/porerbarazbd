// lib/dbConnect.ts
import mongoose from 'mongoose';
import config from './config';

if (!config.mongo_uri) {
  throw new Error('Please define the MONGO_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new database connection...');
    cached.promise = mongoose.connect(config.mongo_uri, {
      bufferCommands: false, // Recommended
    }).then((mongoose) => {
      console.log('Database connection successful!');
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection failed:', e);
    throw e;
  }
  return cached.conn;
}

export default dbConnect;