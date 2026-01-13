import { Request, Response } from "express";
import { storeAggregate } from "./service";

export async function rpcHandler(req: Request, res: Response) {
  const body: any = req.body;

  if (!body || body.jsonrpc !== "2.0" || !body.method) {
    return res.json({ jsonrpc: "2.0", id: body?.id ?? null, error: { code: -32600, message: "Invalid Request" } });
  }

  try {
    if (body.method === "storeAggregate") {
      const result = await storeAggregate(body.params);
      return res.json({ jsonrpc: "2.0", id: body.id ?? null, result });
    }

    return res.json({ jsonrpc: "2.0", id: body.id ?? null, error: { code: -32601, message: "Method not found" } });
  } catch (e: any) {
    return res.json({ jsonrpc: "2.0", id: body.id ?? null, error: { code: -32000, message: e.message } });
  }
}
