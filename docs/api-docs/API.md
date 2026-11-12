# REST API Reference — Smart CRM L2

**Version:** 1.0 (prototype) · **Base URL:** `http://localhost:3001`  
**Format:** JSON · **Auth:** `Authorization: Bearer <token>` on protected routes (in-memory session token in this prototype; use JWT in production behind HTTPS)

Errors use shape `{ "error": "<CODE>", "message": "...", "fields": ["..."] }` unless noted.

---

## Authentication

### `POST /api/login`

**Body:** `{ "username": "nv1", "password": "123456" }`

| Status | Body |
|--------|------|
| 200 | `{ "token": "...", "role": "NHAN_VIEN", "full_name": "..." }` |
| 401 | Invalid credentials |

No auth header required.

---

## Health

### `GET /api/health`

| Status | Body |
|--------|------|
| 200 | `{ "ok": true, "db": "sqlite" \| "mysql" }` |

Public endpoint for deployment probes.

---

## Customers

### `GET /api/customers?phone={phone}`

Requires auth. Phone normalized to `0xxxxxxxxx` (QT-02).

| Status | Description |
|--------|-------------|
| 200 | Customer profile + `devices[]`; phone masked for non-manager roles |
| 404 | Unknown customer |

---

## Tickets

### `POST /api/tickets`

Create warranty ticket. Status `MOI_TIEP_NHAN`. Requires auth (reception role).

**Required fields (minimum):** `phone`, `full_name`, `product_name`, `serial_no`, `issue_desc` (≥10 chars), warranty fields as applicable.

| Status | Description |
|--------|-------------|
| 201 | Ticket created; `ticket_code` like `BH-000001/2026`, `is_warranty` boolean |
| 400 | `DU_LIEU_KHONG_HOP_LE` + `fields` |
| 409 | `THIET_BI_THUOC_KHACH_KHAC` — serial owned by another customer (QT-03) |

### `GET /api/tickets`

List tickets. Optional query `qua_han=true` (overdue only). Phone masked per role.

### `GET /api/tickets/{id}`

Ticket detail + customer/device fields. QT-15 masking on `phone`.

### `PUT /api/tickets/{id}/phan-loai`

**Body:** `{ "category_id": <number> }` → status `DA_PHAN_LOAI` (QT-06).

### `PUT /api/tickets/{id}/uu-tien`

**Body:** `{ "priority": "CAO" | "TRUNG_BINH" | "THAP" }` → sets `due_date` per QT-04 (working hours Mon–Sat).

### `GET /api/tickets/{id}/status-log`

History from `ticket_status_log`.

### `GET /api/tickets/check-serial?phone=...&serial_no=...`

Pre-check serial before create (UI wizard).

---

## Issue categories

### `GET /api/categories`

Returns `{ "data": [ { "category_id", "category_name", ... } ] }`.

---

## Business rules (traceability)

| Rule | API impact |
|------|------------|
| QT-02 | Phone normalization and validation |
| QT-03 | Unique serial; 409 if wrong owner |
| QT-04 | `due_date` from priority + working hours |
| QT-05 | `is_warranty` from purchase date + months |
| QT-06 | Status transitions + status log |
| QT-15 | Phone masking by role |

Full contract (Vietnamese): `docs/api-contract.md`.
