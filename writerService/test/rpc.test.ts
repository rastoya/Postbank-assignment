import request from "supertest";
import { app } from "../src/app";

// mock DB layer
jest.mock("../src/collectedBatchModel", () => ({
  insertHistory: jest.fn(async () => 101),
}));

describe("writerService JSON-RPC", () => {
  it("storeAggregate returns stored=true and historyId", async () => {
    const body = {
      jsonrpc: "2.0",
      method: "storeAggregate",
      params: {
        mode: "project",
        params: { from: "2000-01-01", to: "2099-12-31" },
        result: [{ projectId: 1, totalHours: "10.00" }],
      },
      id: 1,
    };

    const res = await request(app)
      .post("/rpc")
      .send(body)
      .expect(200);

    expect(res.body.jsonrpc).toBe("2.0");
    expect(res.body.result.stored).toBe(true);
    expect(res.body.result.historyId).toBe(101);
  });

  it("invalid request returns -32600", async () => {
    const res = await request(app)
      .post("/rpc")
      .send({ hello: "world" })
      .expect(200);

    expect(res.body.error.code).toBe(-32600);
  });

  it("method not found returns -32601", async () => {
    const res = await request(app)
      .post("/rpc")
      .send({ jsonrpc: "2.0", method: "nope", id: 2 })
      .expect(200);

    expect(res.body.error.code).toBe(-32601);
  });

  it("storeAggregate errors return -32000", async () => {
    const res = await request(app)
      .post("/rpc")
      .send({ jsonrpc: "2.0", method: "storeAggregate", params: {}, id: 3 })
      .expect(200);

    expect(res.body.error.code).toBe(-32000);
    expect(res.body.error.message).toBe("Missing mode/params/result");
  });
});
