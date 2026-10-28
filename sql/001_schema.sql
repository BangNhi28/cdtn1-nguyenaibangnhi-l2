PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customer (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL UNIQUE,
  address     TEXT,
  segment     TEXT,
  created_at  TEXT NOT NULL,
  is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS issue_category (
  category_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name    TEXT NOT NULL UNIQUE,
  default_priority TEXT NOT NULL,
  is_active        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS device (
  device_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id     INTEGER NOT NULL,
  product_name    TEXT NOT NULL,
  serial_no       TEXT NOT NULL UNIQUE,
  purchase_date   TEXT,
  warranty_months INTEGER NOT NULL DEFAULT 12,
  created_at      TEXT NOT NULL,
  note            TEXT,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);

CREATE TABLE IF NOT EXISTS ticket (
  ticket_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_code  TEXT NOT NULL UNIQUE,
  customer_id  INTEGER NOT NULL,
  device_id    INTEGER NOT NULL,
  category_id  INTEGER,
  issue_desc   TEXT NOT NULL,
  priority     TEXT,
  status       TEXT NOT NULL,
  received_at  TEXT NOT NULL,
  due_date     TEXT,
  closed_at    TEXT,
  is_warranty  INTEGER NOT NULL,
  is_active    INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id),
  FOREIGN KEY (device_id) REFERENCES device (device_id),
  FOREIGN KEY (category_id) REFERENCES issue_category (category_id)
);

CREATE TABLE IF NOT EXISTS ticket_status_log (
  log_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id   INTEGER NOT NULL,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  changed_at  TEXT NOT NULL,
  changed_by  INTEGER NOT NULL,
  note        TEXT,
  FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id)
);

CREATE TABLE IF NOT EXISTS app_user (
  user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL
);
