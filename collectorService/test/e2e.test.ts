import request from "supertest";
import { app } from "../src/app";
import { collect } from "../src/model";


// mock rpc client
jest.mock("../src/rpcClient", () => ({
  sendToWriter: jest.fn(async () => ({ stored: true, historyId: 123 })),
}));

// mock model collector
jest.mock("../src/model", () => ({
  collect: jest.fn(async () => ([
    { projectId: 1, projectName: "Work", totalHours: "10.00" }
  ])),
}));

describe("collectorService /api/collect", () => {
  it("returns aggregated data and rpc result", async () => {
    const res = await request(app)
      .get("/api/collect")
      .query({ mode: "project", from: "2000-01-01", to: "2099-12-31" })
      .expect(200);

    expect(res.body.mode).toBe("project");
    expect(res.body.rows).toBe(1);
    expect(res.body.rpc).toEqual({ stored: true, historyId: 123 });
    expect(Array.isArray(res.body.result)).toBe(true);
  });

  it("fails on invalid mode", async () => {
    const res = await request(app)
      .get("/api/collect")
      .query({ mode: "nope", from: "2000-01-01", to: "2099-12-31" });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("returns 400 when collection fails", async () => {
    const collectMock = collect as jest.Mock;
    collectMock.mockRejectedValueOnce(new Error("boom"));

    const res = await request(app)
      .get("/api/collect")
      .query({ mode: "project", from: "2000-01-01", to: "2099-12-31" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("boom");
  });
});
