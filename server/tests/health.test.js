import request from "supertest";

import app from "../app.js";

describe("GET /api/v1/health", () => {
  it("responds 200", async () => {
    await request(app).get("/api/v1/health").expect(200);
  });
});
