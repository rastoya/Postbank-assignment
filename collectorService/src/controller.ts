import { Request, Response } from "express";
import { collectAndForward } from "./service";

const allowed = new Set(["user", "project", "day"]);

export async function handleCollect(req: Request, res: Response) {
  try {
    const mode = String(req.query.mode || "project");
    const from = String(req.query.from || "2000-01-01");
    const to = String(req.query.to || "2099-12-31");

    if (!allowed.has(mode.toLowerCase())) {
      return res.status(400).json({ error: "Invalid mode. Use: user | project | day" });
    }

    const out = await collectAndForward(mode, from, to);
    return res.json(out);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
