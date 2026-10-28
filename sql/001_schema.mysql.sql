SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS customer (
  customer_id BIGINT NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(120) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  address     VARCHAR(255) NULL,
  segment     VARCHAR(50)  NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uk_customer_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS issue_category (
  category_id      INT NOT NULL AUTO_INCREMENT,
  category_name    VARCHAR(60) NOT NULL,
  default_priority VARCHAR(10) NOT NULL,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  PRIMARY KEY (category_id),
  UNIQUE KEY uk_issue_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS device (
  device_id       BIGINT NOT NULL AUTO_INCREMENT,
  customer_id     BIGINT       NOT NULL,
  product_name    VARCHAR(120) NOT NULL,
  serial_no       VARCHAR(50)  NOT NULL,
  purchase_date   DATE         NULL,
  warranty_months SMALLINT     NOT NULL DEFAULT 12,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note            VARCHAR(255) NULL,
  PRIMARY KEY (device_id),
  UNIQUE KEY uk_device_serial_no (serial_no),
  KEY idx_device_customer_id (customer_id),
  CONSTRAINT fk_device_customer
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket (
  ticket_id    BIGINT NOT NULL AUTO_INCREMENT,
  ticket_code  VARCHAR(20) NOT NULL,
  customer_id  BIGINT      NOT NULL,
  device_id    BIGINT      NOT NULL,
  category_id  INT         NULL,
  issue_desc   TEXT        NOT NULL,
  priority     VARCHAR(10) NULL,
  status       VARCHAR(30) NOT NULL,
  received_at  DATETIME    NOT NULL,
  due_date     DATETIME    NULL,
  closed_at    DATETIME    NULL,
  is_warranty  BOOLEAN     NOT NULL,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  PRIMARY KEY (ticket_id),
  UNIQUE KEY uk_ticket_code (ticket_code),
  KEY idx_ticket_customer_id (customer_id),
  KEY idx_ticket_device_id (device_id),
  KEY idx_ticket_category_id (category_id),
  CONSTRAINT fk_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ticket_device
    FOREIGN KEY (device_id) REFERENCES device (device_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ticket_category
    FOREIGN KEY (category_id) REFERENCES issue_category (category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket_status_log (
  log_id      BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id   BIGINT       NOT NULL,
  from_status VARCHAR(30)  NULL,
  to_status   VARCHAR(30)  NOT NULL,
  changed_at  DATETIME     NOT NULL,
  changed_by  BIGINT       NOT NULL,
  note        VARCHAR(255) NULL,
  PRIMARY KEY (log_id),
  KEY idx_status_log_ticket_id (ticket_id),
  CONSTRAINT fk_status_log_ticket
    FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS app_user (
  user_id       BIGINT NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL,
  password_hash VARCHAR(64)  NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  role          VARCHAR(20)  NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_app_user_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
