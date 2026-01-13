import { collect } from "./model";
import { sendToWriter } from "./rpcClient";

export async function collectAndForward(mode: string, from: string, to: string) {
  const result = await collect(mode, from, to);
  const rpc = await sendToWriter({ mode, params: { from, to }, result });
  return { mode, from, to, rows: (result as any[]).length, rpc, result };
}
