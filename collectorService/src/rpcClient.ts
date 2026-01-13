import axios from "axios";
import { getRpcConfig } from "./config";

export async function sendToWriter(payload: {
  mode: string;
  params: { from: string; to: string };
  result: unknown;
}) {
  const req = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "storeAggregate",
    params: payload
  };

  const { rpcUrl } = getRpcConfig();
  const res = await axios.post(rpcUrl, req, {
    headers: { "Content-Type": "application/json" }
  });

  if (res.data?.error) throw new Error(res.data.error.message);
  return res.data.result;
}
