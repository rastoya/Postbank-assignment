import { pool } from "./db";

export async function insertHistory(mode: string, paramsObj: unknown, resultObj: unknown) {
  const payload = {
    mode,
    params: paramsObj,
    result: resultObj,
  };

  const [res] = await pool.query(
    `INSERT INTO \`CollectedBatch\` (Payload)
     VALUES (CAST(? AS JSON))`,
    [JSON.stringify(payload)]
  );

  // @ts-ignore
  return res.insertId as number;
}
