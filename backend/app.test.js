
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "./app.js";

test("GET /api/health should return API status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(
    response.body.message,
    "Student Result Checker API is running"
  );
});

test("GET /api/results/101 should return student result", async () => {
  const response = await request(app).get("/api/results/101");

  assert.equal(response.status, 200);
  assert.equal(response.body.rollNumber, "101");
  assert.equal(response.body.name, "Wrong Name");
  assert.equal(response.body.result, "PASS");
  assert.equal(response.body.totalMarks, 417);
  assert.equal(response.body.maximumMarks, 500);
  assert.equal(response.body.percentage, 83.4);
});

test("GET /api/results/103 should return FAIL", async () => {
  const response = await request(app).get("/api/results/103");

  assert.equal(response.status, 200);
  assert.equal(response.body.result, "FAIL");
});

test("GET /api/results/999 should return 404", async () => {
  const response = await request(app).get("/api/results/999");

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Student result not found");
});
