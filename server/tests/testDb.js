import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Call once at the top of a describe block (or file) in any suite that needs a
// database. Suites that don't — like health.test.js — skip the mongod startup
// cost entirely.
export function useTestDb() {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
}
