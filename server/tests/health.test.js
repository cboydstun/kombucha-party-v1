import request from "supertest";

import app from "../app.js";

// GET - api/v1/health - health check endpoint - PUBLIC
describe("GET /api/v1/health", () => {
  it("responds 200", async () => {
    await request(app).get("/api/v1/health").expect(200);
  });
});

// GET - /api/v1/howdy?name=string - howdy endpoint - PUBLIC
describe("GET /api/v1/howdy", () => {
  it("responds 200 with a greeting message", async () => {
    await request(app).get("/api/v1/howdy?name=Chris").expect(200);
  });

  it("responds 400 if name query parameter is missing", async () => {
    await request(app).get("/api/v1/howdy").expect(400);
  });

  it("responds 400 if name query parameter is empty", async () => {
    await request(app).get("/api/v1/howdy?name=").expect(400);
  });

  it("responds 400 if name query parameter is only whitespace", async () => {
    await request(app).get("/api/v1/howdy?name=   ").expect(400);
  });

  it("responds 200 if name query parameter has leading and trailing whitespace", async () => {
    await request(app).get("/api/v1/howdy?name=  Chris  ").expect(200);
  });

  it("responds 200 if name query parameter has mixed whitespace and characters", async () => {
    await request(app).get("/api/v1/howdy?name=  Chris  ").expect(200);
  });

  it("responds 200 if name query parameter has special characters", async () => {
    await request(app).get("/api/v1/howdy?name=Chris!@#").expect(200);
  });

  // test return  res.send(`Howdy, ${name}!`);
  it("returns the correct greeting message", async () => {
    const response = await request(app).get("/api/v1/howdy?name=Toronto");
    expect(response.text).toBe("Howdy, Toronto!");
  });
});
