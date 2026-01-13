import { insertHistory } from "./collectedBatchModel";

export async function storeAggregate(input: any) {
  const { mode, params, result } = input || {};
  if (!mode || !params || result === undefined) throw new Error("Missing mode/params/result");

  const id = await insertHistory(mode, params, result);
  return { stored: true, historyId: id };
}
