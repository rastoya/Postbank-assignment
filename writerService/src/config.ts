type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

type ServerConfig = {
  port: number;
};

function requiredString(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number for env ${name}: "${raw}"`);
  }
  return value;
}

export function getServerConfig(): ServerConfig {
  return {
    port: numberFromEnv("PORT", 4000),
  };
}

export function getDbConfig(): DbConfig {
  return {
    host: requiredString("DB_HOST"),
    port: numberFromEnv("DB_PORT", 3306),
    user: requiredString("DB_USER"),
    password: process.env.DB_PASS ?? "",
    database: requiredString("DB_NAME"),
  };
}
