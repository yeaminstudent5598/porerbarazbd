// src/lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  );
}

// Maintain a cached connection object across invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Optional: Disable buffering if connection fails
    };

    console.log('Creating new database connection');
    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongooseInstance) => {
      console.log('Database connection successful');
      return mongooseInstance;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise on error
    console.error('Database connection error:', e);
    throw e; // Re-throw error
  }

  return cached.conn;
}

export default dbConnect;

// Augment the NodeJS global type to add the mongoose property
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}