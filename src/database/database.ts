import { MongoClient } from "mongodb";
const MONGODB_URI: any = process.env.MONGO_DB;

let cachedDb:any = null;

export function getDatabase(): Promise<MongoClient> {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }
  return MongoClient.connect(MONGODB_URI).then((db) => {
    cachedDb = db;
    return cachedDb;
  });
}