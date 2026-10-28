const fs = require("fs");
const path = require("path");
const { AsyncLocalStorage } = require("node:async_hooks");
const { DatabaseSync } = require("node:sqlite");

function usesMysql() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_PASSWORD);
}

function coerceValue(value) {
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace("T", " ");
  }
  if (Buffer.isBuffer(value)) {
    return value.length === 1 ? value[0] : value.toString("utf8");
  }
  return value;
}

function coerceRow(row) {
  if (!row || typeof row !== "object") {
    return row;
  }
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = coerceValue(value);
  }
  return out;
}

function bindArgs(sql, args) {
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !Array.isArray(args[0])) {
    const names = [];
    const converted = sql.replace(/@([a-zA-Z_][\w]*)/g, (_, name) => {
      names.push(name);
      return "?";
    });
    return {
      sql: converted,
      params: names.map((name) => (args[0][name] === undefined ? null : args[0][name]))
    };
  }
  return {
    sql,
    params: args.map((value) => (value === undefined ? null : value))
  };
}

function createMutex() {
  let tail = Promise.resolve();
  return function withLock(fn) {
    const run = tail.then(fn, fn);
    tail = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  };
}

function wrapSqlite(raw) {
  const als = new AsyncLocalStorage();
  const withLock = createMutex();

  async function locked(fn) {
    if (als.getStore()) {
      return fn();
    }
    return withLock(() => als.run(true, fn));
  }

  return {
    dialect: "sqlite",
    insertIgnore: "INSERT OR IGNORE",
    prepare(sql) {
      const stmt = raw.prepare(sql);
      return {
        get(...args) {
          return locked(() => coerceRow(stmt.get(...args) || null));
        },
        all(...args) {
          return locked(() => stmt.all(...args).map(coerceRow));
        },
        run(...args) {
          return locked(() => stmt.run(...args));
        }
      };
    },
    exec(sql) {
      return locked(() => {
        raw.exec(sql);
      });
    },
    transaction(fn) {
      return locked(async () => {
        raw.exec("BEGIN");
        try {
          const result = await fn();
          raw.exec("COMMIT");
          return result;
        } catch (err) {
          raw.exec("ROLLBACK");
          throw err;
        }
      });
    },
    close() {
      return locked(() => {
        raw.close();
      });
    }
  };
}

function wrapMysql(pool) {
  const als = new AsyncLocalStorage();

  function client() {
    return als.getStore() || pool;
  }

  return {
    dialect: "mysql",
    insertIgnore: "INSERT IGNORE",
    prepare(sql) {
      return {
        async get(...args) {
          const bound = bindArgs(sql, args);
          const [rows] = await client().execute(bound.sql, bound.params);
          return Array.isArray(rows) ? coerceRow(rows[0] || null) : null;
        },
        async all(...args) {
          const bound = bindArgs(sql, args);
          const [rows] = await client().execute(bound.sql, bound.params);
          return rows.map(coerceRow);
        },
        async run(...args) {
          const bound = bindArgs(sql, args);
          const [result] = await client().execute(bound.sql, bound.params);
          return {
            lastInsertRowid: coerceValue(result.insertId),
            changes: result.affectedRows
          };
        }
      };
    },
    async exec(sql) {
      await client().query(sql);
    },
    async transaction(fn) {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const result = await als.run(conn, fn);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    },
    async close() {
      await pool.end();
    }
  };
}

async function openDatabase(filePath) {
  if (filePath === ":memory:" || !usesMysql()) {
    const isMemory = filePath === ":memory:";
    const sqlitePath = isMemory ? ":memory:" : filePath || defaultDbPath();
    if (!isMemory) {
      fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
    }
    const raw = new DatabaseSync(sqlitePath);
    raw.exec("PRAGMA foreign_keys = ON");
    return wrapSqlite(raw);
  }

  const mysql = require("mysql2/promise");
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || "defaultdb",
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 5,
    multipleStatements: true,
    dateStrings: true
  });
  return wrapMysql(pool);
}

async function migrate(db) {
  const file = db.dialect === "mysql" ? "001_schema.mysql.sql" : "001_schema.sql";
  const sqlPath = path.join(__dirname, "..", "sql", file);
  await db.exec(fs.readFileSync(sqlPath, "utf8"));
}

function defaultDbPath() {
  return process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "smartcrm.sqlite");
}

module.exports = { openDatabase, migrate, defaultDbPath, usesMysql };
