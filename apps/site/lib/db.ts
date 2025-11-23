import { Pool, type QueryResult } from "pg";

export type UserRecord = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
};

export type PublicUserRecord = {
  id: string;
  email: string;
  name: string | null;
};

export type GameRecord = {
  id: number;
  name: string;
  description: string | null;
  start_date: Date;
  end_date: Date;
  status: string;
};

const MOCK_USER: UserRecord = {
  id: "mock-user-1",
  email: "demo@adaptive.game",
  name: "Usuario Demo",
  password_hash: "$2a$10$tB49DDbuQisZHu4M7jCArOpP3dyVN88SccZRJTpAdtfRrwm5oEkdW",
};

const MOCK_AUTH_ENABLED =
  process.env.MOCK_AUTH === "true" || !process.env.DATABASE_URL;

// Creates a singleton connection pool for the app router workers.
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not configured");
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

async function query<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  const client = await getPool().connect();

  try {
    return await client.query<T>(sql, params);
  } finally {
    client.release();
  }
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | null> {
  if (MOCK_AUTH_ENABLED) {
    return email.trim().toLowerCase() === MOCK_USER.email ? MOCK_USER : null;
  }

  const result = await query<UserRecord>(
    "SELECT id, email, name, password_hash FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  return result.rows[0] ?? null;
}

export async function findUserById(
  id: string
): Promise<PublicUserRecord | null> {
  if (MOCK_AUTH_ENABLED) {
    if (id === MOCK_USER.id) {
      const { password_hash: _hash, ...user } = MOCK_USER;
      return user;
    }

    return null;
  }

  const result = await query<UserRecord>(
    "SELECT id, email, name, password_hash FROM users WHERE id = $1 LIMIT 1",
    [id]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
  };
}

export async function listGames(): Promise<GameRecord[]> {
  if (MOCK_AUTH_ENABLED) {
    const currentYear = new Date().getFullYear();

    return [
      {
        id: 1,
        name: "Demo Quest Alpha",
        description: "Campaña de introducción para nuevos jugadores.",
        start_date: new Date(currentYear, 0, 15),
        end_date: new Date(currentYear, 2, 30),
        status: "active",
      },
      {
        id: 2,
        name: "Nightfall Trials",
        description: "Serie de desafíos avanzados con recompensas temporales.",
        start_date: new Date(currentYear, 3, 5),
        end_date: new Date(currentYear, 5, 20),
        status: "paused",
      },
      {
        id: 3,
        name: "Legends Cup Finals",
        description: "Torneo competitivo con clasificatoria global.",
        start_date: new Date(currentYear, 6, 10),
        end_date: new Date(currentYear, 7, 25),
        status: "archived",
      },
    ];
  }

  const result = await query<GameRecord>(
    `SELECT id, name, description, start_date, end_date, status
     FROM game
     ORDER BY start_date DESC`
  );

  return result.rows;
}
