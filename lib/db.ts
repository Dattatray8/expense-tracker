import { connect } from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MongoDB URL is not found.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("DB connected successfully form cache.");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = connect(MONGO_URL).then((c) => c.connection);
    console.log("DB connected successfully.");
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    throw error;
  }
  return cached.conn;
};

export default connectDB;