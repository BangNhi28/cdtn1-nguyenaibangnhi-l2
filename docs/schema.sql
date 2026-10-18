-- Smart CRM – Mekong Mobile | Luồng L2
-- Hệ quản trị: MySQL 8 trên Aiven for MySQL (gói miễn phí)
-- https://aiven.io/free-mysql-database
-- Engine InnoDB, charset utf8mb4. Kết nối Aiven bắt buộc SSL.
--
-- Không dùng MongoDB.
-- Lịch sử trạng thái nằm ở bảng ticket_status_log, không nhúng trong ticket.
-- Tên bảng khớp ERD: customer, device, issue_category, ticket, ticket_status_log.

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS ticket_status_log;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS device;
DROP TABLE IF EXISTS issue_category;
DROP TABLE IF EXISTS customer;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customer (
  customer_id BIGINT NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(120) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  address     VARCHAR(255) NULL,
  segment     VARCHAR(50)  NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uk_customer_phone (phone),
  CONSTRAINT chk_customer_phone CHECK (phone REGEXP '^0[0-9]{9}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE issue_category (
  category_id      INT NOT NULL AUTO_INCREMENT,
  category_name    VARCHAR(60) NOT NULL,
  default_priority VARCHAR(10) NOT NULL,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  PRIMARY KEY (category_id),
  UNIQUE KEY uk_issue_category_name (category_name),
  CONSTRAINT chk_issue_category_priority CHECK (default_priority IN ('CAO', 'TRUNG_BINH', 'THAP'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE device (
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
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_device_warranty_months CHECK (warranty_months > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket (
  ticket_id         BIGINT NOT NULL AUTO_INCREMENT,
  ticket_code       VARCHAR(20) NOT NULL,
  customer_id       BIGINT      NOT NULL,
  device_id         BIGINT      NOT NULL,
  category_id       INT         NULL,
  issue_desc        TEXT        NOT NULL,
  priority          VARCHAR(10) NULL,
  status            VARCHAR(30) NOT NULL,
  received_at       DATETIME    NOT NULL,
  due_date          DATETIME    NULL,
  closed_at         DATETIME    NULL,
  is_warranty       BOOLEAN     NOT NULL,
  PRIMARY KEY (ticket_id),
  UNIQUE KEY uk_ticket_code (ticket_code),
  KEY idx_ticket_customer_id (customer_id),
  KEY idx_ticket_device_id (device_id),
  KEY idx_ticket_category_id (category_id),
  KEY idx_ticket_status (status),
  KEY idx_ticket_due_date (due_date),
  CONSTRAINT fk_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ticket_device
    FOREIGN KEY (device_id) REFERENCES device (device_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ticket_category
    FOREIGN KEY (category_id) REFERENCES issue_category (category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_ticket_priority CHECK (priority IS NULL OR priority IN ('CAO', 'TRUNG_BINH', 'THAP')),
  CONSTRAINT chk_ticket_status CHECK (status IN ('MOI_TIEP_NHAN', 'DA_PHAN_LOAI', 'DA_XAC_DINH_UU_TIEN')),
  CONSTRAINT chk_ticket_issue_desc CHECK (CHAR_LENGTH(issue_desc) BETWEEN 10 AND 500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket_status_log (
  log_id      BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id   BIGINT      NOT NULL,
  from_status VARCHAR(30) NULL,
  to_status   VARCHAR(30) NOT NULL,
  changed_at  DATETIME    NOT NULL,
  changed_by  BIGINT      NOT NULL,
  note        VARCHAR(255) NULL,
  PRIMARY KEY (log_id),
  KEY idx_status_log_ticket_id (ticket_id),
  CONSTRAINT fk_status_log_ticket
    FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
