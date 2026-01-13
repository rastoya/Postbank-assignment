import { pool } from "./db";

export async function collect(mode: string, from: string, to: string) {
  const params = [from, to];
  const m = (mode || "").toLowerCase();

  if (m === "user") {
    const [rows] = await pool.query(
      `
      SELECT
        u.Id AS userId,
        u.FirstName,
        u.MiddleName,
        u.LastName,
        u.Email,
        SUM(t.Hours) AS totalHours
      FROM \`TimeLog\` t
      JOIN \`User\` u ON u.Id = t.UserId
      WHERE t.WorkDate BETWEEN ? AND ?
      GROUP BY u.Id, u.FirstName, u.MiddleName, u.LastName, u.Email
      ORDER BY totalHours DESC
      `,
      params
    );
    return rows;
  }

  if (m === "project") {
    const [rows] = await pool.query(
      `
      SELECT
        p.Id AS projectId,
        p.Name AS projectName,
        SUM(t.Hours) AS totalHours
      FROM \`TimeLog\` t
      JOIN \`Project\` p ON p.Id = t.ProjectId
      WHERE t.WorkDate BETWEEN ? AND ?
      GROUP BY p.Id, p.Name
      ORDER BY totalHours DESC
      `,
      params
    );
    return rows;
  }

  if (m === "day") {
    const [rows] = await pool.query(
      `
      SELECT
        t.WorkDate AS workDate,
        SUM(t.Hours) AS totalHours
      FROM \`TimeLog\` t
      WHERE t.WorkDate BETWEEN ? AND ?
      GROUP BY t.WorkDate
      ORDER BY t.WorkDate ASC
      `,
      params
    );
    return rows;
  }

  throw new Error("Invalid mode. Use: user | project | day");
}
