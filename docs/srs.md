
# BÁO CÁO BÀI TẬP 1
## MÔN: CHUYÊN NGÀNH TỐT NGHIỆP 1

**Trường:** Trường Đại học Văn Lang  
**Khoa:** Công nghệ Thông tin

**Đề tài:** Hệ thống Smart CRM – Mekong Mobile  
**Phân hệ:** L2 — Tiếp nhận và xử lý yêu cầu bảo hành

- **Track:** Công nghệ phần mềm (SE)
- **Lớp:** 261_71ITGR40203_06
- **Link GitHub repo:** [Dán link repository tại đây]
- **Sinh viên thực hiện:** Nguyễn Ái Băng Nhi – 2374802010368
- **Giảng viên hướng dẫn:** TS. Nguyễn Trí Hải

---

## LỊCH SỬ THAY ĐỔI (VERSION HISTORY)

| Phiên bản | Ngày | Nội dung thay đổi | Người thực hiện |
|---|---|---|---|
| 1.0 | 08/10/2026 | Cập nhật tài liệu SRS; xác định phạm vi hệ thống, yêu cầu nghiệp vụ, yêu cầu chức năng và phi chức năng; xây dựng bảng truy vết, mô hình kiến trúc, ERD và wireframe giao diện. | Nguyễn Ái Băng Nhi |
| 1.1 | 18/10/2026 | Bỏ schema MongoDB. Mục 4 đổi sang SQL DDL MySQL 8 (Aiven); lịch sử trạng thái nằm ở bảng `ticket_status_log`. ERD vẽ lại cho khớp DDL. Wireframe và API dùng đúng tên cột. | Nguyễn Ái Băng Nhi |
| 1.2 | 18/10/2026 | Chỉnh DDL theo ERD mới: bỏ `customer.email` và `ticket.warranty_verified`; thêm `device.note`. Lịch sử trạng thái giữ ở bảng `ticket_status_log`. | Nguyễn Ái Băng Nhi |

---

# MỤC 1 — BẢN SRS RÚT GỌN

## 1.1. Giới thiệu và phạm vi

### Bối cảnh

Mekong Mobile là chuỗi 24 cửa hàng và 6 trung tâm bảo hành tại TP.HCM, Cần Thơ và Hà Nội, với khoảng 260 yêu cầu bảo hành mỗi tháng. Hiện tại, yêu cầu bảo hành được ghi tay nên khó theo dõi yêu cầu đang ở bước nào, ai đang xử lý và đã quá hạn cam kết hay chưa.

### Luồng nghiệp vụ được chọn

L2 — Tiếp nhận và xử lý yêu cầu bảo hành (Service Desk).

### Phạm vi

Nhân viên tiếp nhận ghi nhận, phân loại và xác định mức ưu tiên cho yêu cầu bảo hành; quản lý trung tâm theo dõi trạng thái, hạn cam kết và lịch sử xử lý.

### Chủ ý KHÔNG làm (WON'T)

- Quản lý tồn kho linh kiện thay thế.
- Bán hàng, khuyến mãi.
- Báo cáo doanh thu theo cửa hàng.
- Gửi thông báo tự động qua SMS/Zalo cho khách hàng (ngoài phạm vi prototype).

### Bảng thuật ngữ

| Thuật ngữ | Giải nghĩa |
|---|---|
| Yêu cầu bảo hành | Một phiếu ghi nhận lỗi/sự cố của khách hàng cần xử lý, có mã, trạng thái và hạn cam kết. |
| Trạng thái | Mới tiếp nhận → Đã phân loại → Đã xác định ưu tiên. |
| Hạn cam kết (SLA) | Thời điểm trễ nhất phải hoàn tất yêu cầu, tính từ lúc tiếp nhận, phụ thuộc mức ưu tiên. |
| Nhóm sự cố | Phân loại loại lỗi: Phần cứng / Phần mềm / Khác. |

## 1.2. Các bên liên quan và vai trò người dùng

| Vai trò | Được làm | Không được làm |
|---|---|---|
| Nhân viên tiếp nhận | Ghi nhận yêu cầu mới, phân loại và xác định ưu tiên, tra cứu yêu cầu. | Gán kỹ thuật viên, cập nhật trạng thái xử lý kỹ thuật. |
| Quản lý trung tâm | Xem danh sách yêu cầu bảo hành, xem danh sách quá hạn, xem lịch sử thay đổi trạng thái. | Trực tiếp chỉnh sửa nội dung kỹ thuật của yêu cầu. |

## 1.3. Yêu cầu chức năng (FR) và User Story

### Danh sách yêu cầu chức năng

| Mã | Yêu cầu chức năng | User Story | MoSCoW |
|---|---|---|---|
| FR1 | Tra cứu khách hàng theo số điện thoại | US1 | SHOULD |
| FR2 | Ghi nhận yêu cầu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) | US2 | MUST |
| FR3 | Phân loại yêu cầu theo nhóm sự cố | US3 | MUST |
| FR4 | Xác định mức độ ưu tiên của yêu cầu | US4 | MUST |
| FR5 | Xem hạn cam kết của yêu cầu bảo hành | US5 | SHOULD |
| FR6 | Xem danh sách yêu cầu bảo hành và trạng thái xử lý | US6 | SHOULD |
| FR7 | Xem danh sách yêu cầu sắp/đã quá hạn cam kết | US7 | COULD |
| FR8 | Xem lịch sử thay đổi trạng thái của yêu cầu | US8 | COULD |

### US1 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng theo số điện thoại để nhanh chóng xác định thông tin khách hàng khi tiếp nhận yêu cầu bảo hành.

### US2 [MUST]

Là nhân viên tiếp nhận, tôi muốn ghi nhận yêu cầu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) để bắt đầu quy trình xử lý.

- **AC1:** Given đã đăng nhập, When nhập đủ thông tin và nhấn Lưu, Then hệ thống tạo yêu cầu mới, trạng thái "Mới tiếp nhận".
- **AC2 (ngoại lệ):** Given bỏ trống trường bắt buộc, When nhấn Lưu, Then hệ thống báo lỗi, không tạo yêu cầu.

### US3 [MUST]

Là nhân viên tiếp nhận, tôi muốn phân loại yêu cầu theo nhóm sự cố để xác định loại vấn đề cần xử lý.

- **AC1:** Given yêu cầu ở trạng thái "Mới tiếp nhận", When chọn nhóm sự cố, Then trạng thái chuyển "Đã phân loại".
- **AC2 (ngoại lệ):** Given yêu cầu chưa được ghi nhận, When cố phân loại, Then hệ thống từ chối thao tác.

### US4 [MUST]

Là nhân viên tiếp nhận, tôi muốn xác định mức độ ưu tiên của yêu cầu để đảm bảo xử lý theo mức độ cần thiết.

- **AC1:** Given yêu cầu đã phân loại, When chọn mức ưu tiên (Thấp/Trung bình/Cao), Then hệ thống lưu và tính hạn cam kết tương ứng.
- **AC2 (ngoại lệ):** Given mức ưu tiên để trống hoặc không hợp lệ, When lưu, Then hệ thống báo lỗi yêu cầu chọn lại.

### US5 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn xem hạn cam kết của yêu cầu bảo hành sau khi tiếp nhận để biết thời hạn xử lý và cung cấp thông tin cho khách hàng.

### US6 [SHOULD]

Là quản lý trung tâm, tôi muốn xem danh sách các yêu cầu bảo hành và trạng thái xử lý để theo dõi tình hình xử lý tại trung tâm.

### US7 [COULD]

Là quản lý trung tâm, tôi muốn xem danh sách các yêu cầu sắp hoặc đã quá hạn cam kết để can thiệp kịp thời.

### US8 [COULD]

Là quản lý trung tâm, tôi muốn xem lịch sử thay đổi trạng thái của yêu cầu bảo hành để theo dõi quá trình xử lý và kiểm tra tiến độ.

## 1.4. Yêu cầu phi chức năng (NFR)

| Mã | Mô tả | Ngưỡng |
|---|---|---|
| NFR1 | Thời gian phản hồi API tra cứu/tạo yêu cầu | ≤ 3 giây |
| NFR2 | Thời gian lưu trữ dữ liệu yêu cầu | Tối thiểu 2 năm |
| NFR3 | Tỉ lệ sẵn sàng hệ thống | ≥ 98% |

## 1.5. Ràng buộc và quy tắc nghiệp vụ

- **R1:** Yêu cầu bảo hành sau khi được tạo phải được phân loại theo nhóm sự cố trước khi xác định mức ưu tiên.
- **R2:** Chỉ yêu cầu đã được phân loại mới được xác định mức ưu tiên (Thấp / Trung bình / Cao) và tính hạn cam kết tương ứng.
- **R3:** Hạn cam kết (SLA) được tính dựa trên mức ưu tiên: Cao: 24 giờ, Trung bình: 48 giờ, Thấp: 72 giờ, tính từ thời điểm tiếp nhận yêu cầu.
- **R4:** Yêu cầu ở trạng thái “Đã xác định ưu tiên” hoặc các trạng thái sau đó không được quay ngược về trạng thái trước nếu không có thao tác hợp lệ theo quy trình nghiệp vụ.
- **R5:** Mỗi lần thay đổi trạng thái của yêu cầu phải được ghi nhận vào lịch sử, bao gồm trạng thái cũ, trạng thái mới, thời gian thay đổi và người thực hiện, phục vụ việc truy vết và kiểm tra tiến độ.

## 1.6. Bảng truy vết yêu cầu

| FR | User Story | Use Case | MoSCoW |
|---|---|---|---|
| FR1 | US1 | UC1 | SHOULD |
| FR2 | US2 | UC2 | MUST |
| FR3 | US3 | UC3 | MUST |
| FR4 | US4 | UC4 | MUST |
| FR5 | US5 | UC5 | SHOULD |
| FR6 | US6 | UC6 | SHOULD |
| FR7 | US7 | UC7 | COULD |
| FR8 | US8 | UC8 | COULD |

---

# MỤC 2 — USE CASE

## 2.1. Use Case Diagram

**Actor (2):**
- Nhân viên tiếp nhận.
- Quản lý trung tâm.

**Use Case (8):**
- UC1: Tra cứu khách hàng.
- UC2: Ghi nhận yêu cầu mới.
- UC3: Phân loại yêu cầu.
- UC4: Xác định mức ưu tiên.
- UC5: Xem hạn cam kết.
- UC6: Xem danh sách và trạng thái.
- UC7: Xem danh sách quá hạn.
- UC8: Xem lịch sử thay đổi trạng thái.

## 2.2. Đặc tả Use Case chính

**Điều kiện trước:** Nhân viên tiếp nhận đã đăng nhập.

**Điều kiện sau:** Yêu cầu mới được tạo với mã tự động, sẵn sàng để phân loại (UC3).

### Luồng chính

1. Nhân viên tiếp nhận chọn "Tạo yêu cầu mới".
2. Hệ thống hiển thị form nhập thông tin.
3. Nhân viên nhập số điện thoại khách hàng — hệ thống tự động điền thông tin nếu khách đã tồn tại (liên quan UC1).
4. Nhân viên nhập sản phẩm và mô tả lỗi.
5. Nhân viên nhấn Lưu.
6. Hệ thống kiểm tra hợp lệ, tạo mã yêu cầu, lưu trạng thái "Mới tiếp nhận".
7. Hệ thống hiển thị xác nhận thành công.

### Luồng ngoại lệ

- **5a.** Thiếu trường bắt buộc → hệ thống báo lỗi, giữ nguyên form, quay lại bước 4.
- **6a.** Số điện thoại không đúng định dạng → hệ thống báo lỗi định dạng, quay lại bước 3.

---

# MỤC 3 — THIẾT KẾ KIẾN TRÚC

## 3.1. Sơ đồ kiến trúc phân lớp (Layered Architecture) cho luồng L2

**Chú thích:** Mũi tên là hướng phụ thuộc một chiều. Presentation gọi Business qua HTTP/JSON; Business gọi Repository qua interface; Repository dùng MySQL để đọc/ghi CSDL trên Aiven for MySQL. Lớp dưới không gọi ngược lớp trên.

<!-- Nếu muốn hiển thị sơ đồ, hãy xuất ảnh kiến trúc vào thư mục ảnh của repository rồi thêm:
![Sơ đồ kiến trúc phân lớp](images/architecture.png)
-->

## 3.2. Ba câu lập luận

1. Vì NFR1 yêu cầu thời gian phản hồi API tra cứu/tạo yêu cầu ≤ 3 giây, tôi chọn kiến trúc phân lớp và tách truy cập dữ liệu vào Repository để các truy vấn được tập trung, có thể tối ưu/index mà không sửa lớp giao diện; đánh đổi là phải đi qua thêm một lớp trung gian nên mã nguồn có nhiều thành phần hơn.

2. Vì NFR2 yêu cầu lưu trữ dữ liệu yêu cầu tối thiểu 2 năm, tôi chọn MySQL 8 (Aiven) và tách lịch sử trạng thái thành bảng `ticket_status_log` thay vì nhúng mảng vào phiếu; đánh đổi là phát sinh thêm bản ghi và cần JOIN khi xem lịch sử, nhưng đổi lại dữ liệu truy vết rõ ràng và khóa ngoại được CSDL kiểm tra.

3. Vì NFR3 yêu cầu tỉ lệ sẵn sàng hệ thống ≥ 98%, tôi tách Presentation, Business và Data Access để giới hạn phạm vi ảnh hưởng khi thay đổi/sửa lỗi một thành phần và giữ lớp nghiệp vụ độc lập với công nghệ lưu trữ; đánh đổi là tăng chi phí thiết kế và kiểm thử giữa các lớp.

---

# MỤC 4 — MÔ HÌNH DỮ LIỆU (TRACK SE)

Hệ quản trị là **MySQL 8** trên [Aiven for MySQL](https://aiven.io/free-mysql-database) (gói miễn phí: 1 CPU, 1 GB RAM, 1 GB đĩa, một node). Kết nối bắt buộc SSL. Không dùng MongoDB.

ERD (`docs/erd.drawio`, bản cùng nội dung ở `erd.drawio`) gồm 5 bảng quan hệ. Mỗi bảng có khóa chính. Có 5 khóa ngoại. Không có bảng cô lập. Lịch sử trạng thái là bảng `ticket_status_log`, không nhúng trong `ticket`.

DDL chạy được nằm ở `docs/schema.sql` (InnoDB, `utf8mb4`). Nội dung CREATE TABLE dưới đây trùng file đó.

## 4.1. SQL DDL

```sql
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
```

## 4.2. Quan hệ khóa ngoại

| Khóa ngoại | Bảng con | Cột | Bảng cha | Ý nghĩa |
|---|---|---|---|---|
| `fk_device_customer` | `device` | `customer_id` | `customer` | Một khách sở hữu nhiều thiết bị |
| `fk_ticket_customer` | `ticket` | `customer_id` | `customer` | Một khách gửi nhiều phiếu |
| `fk_ticket_device` | `ticket` | `device_id` | `device` | Một thiết bị có nhiều phiếu |
| `fk_ticket_category` | `ticket` | `category_id` | `issue_category` | Một nhóm sự cố gắn với nhiều phiếu |
| `fk_status_log_ticket` | `ticket_status_log` | `ticket_id` | `ticket` | Một phiếu có nhiều dòng lịch sử trạng thái |

`ON DELETE RESTRICT` để không xóa vật lý phiếu khi còn lịch sử. `changed_by` lưu mã người thực hiện, chưa có khóa ngoại vì bảng nhân viên nằm ngoài phạm vi L2.

## 4.3. Cột cho phép NULL và mã lưu trữ

- `device.product_name` thay cho `product_id`: luồng L2 không có bảng `product`, tránh khóa ngoại trỏ tới bảng không tồn tại.
- `customer` không có cột `email`. `address` và `segment` được NULL.
- `device.note` là ghi chú thiết bị, được NULL. `purchase_date` được NULL khi khách không nhớ ngày mua.
- `ticket.category_id`, `ticket.priority`, `ticket.due_date` để NULL lúc mới ghi nhận. Phân loại mới gán `category_id`. Xác định ưu tiên mới gán `priority` và tính `due_date`.
- Hạn cam kết là cột `due_date`. Mã hiển thị cho khách là `ticket_code`. Khóa chính là `ticket_id`. Không có cột `warranty_verified` và không có `center_id`.

| Cột `status` | Nhãn trên giao diện |
|---|---|
| `MOI_TIEP_NHAN` | Mới tiếp nhận |
| `DA_PHAN_LOAI` | Đã phân loại |
| `DA_XAC_DINH_UU_TIEN` | Đã xác định ưu tiên |

| Cột `priority` | Nhãn trên giao diện |
|---|---|
| `CAO` | Cao |
| `TRUNG_BINH` | Trung bình |
| `THAP` | Thấp |

## 4.4. API Contract

`{id}` trong đường dẫn là `ticket.ticket_id` (BIGINT), không phải chuỗi ObjectId.

| # | Endpoint | Mô tả | Quy tắc áp dụng |
|---|---|---|---|
| 1 | `GET /api/customers?phone={sdt}` | Tra cứu khách hàng theo SĐT đã chuẩn hóa | QT-01, QT-02, QT-15 |
| 2 | `POST /api/tickets` | Ghi nhận phiếu bảo hành mới (`customer`, `device`, `issue_desc`) | QT-02, QT-03, QT-05 |
| 3 | `PUT /api/tickets/{id}/phan-loai` | Gán `category_id` và `priority`, tự tính `due_date` | QT-04 |
| 4 | `PUT /api/tickets/{id}/xac-minh-bao-hanh` | Quản lý phê duyệt khi không xác minh được ngày mua | QT-05 |
| 5 | `GET /api/tickets/{id}` | Xem chi tiết phiếu | QT-15 |
| 6 | `GET /api/tickets?status=qua_han` | Danh sách phiếu sắp hoặc đã quá `due_date` | QT-06 |
| 7 | `GET /api/tickets/{id}/status-log` | Đọc bảng `ticket_status_log` của phiếu | QT-06 |

### Response mẫu — POST /api/tickets

```json
{
  "ticket_id": 987,
  "ticket_code": "BH000987/2026",
  "status": "MOI_TIEP_NHAN",
  "received_at": "2026-10-18T09:00:00",
  "is_warranty": true
}
```

## 4.5. Bảng quy tắc Validation

| Trường | Bắt buộc | Kiểu MySQL | Ràng buộc |
|---|---|---|---|
| `customer.phone` | Có | `VARCHAR(20)` | 10 số, dạng `0xxxxxxxxx`, UNIQUE (QT-01, QT-02) |
| `ticket.issue_desc` | Có | `TEXT` | 10–500 ký tự |
| `ticket.category_id` | Có khi phân loại | `INT` | Khóa ngoại tới `issue_category.category_id`, NULL trước khi phân loại |
| `ticket.priority` | Có khi xác định ưu tiên | `VARCHAR(10)` | `CAO` / `TRUNG_BINH` / `THAP`, NULL trước bước này |
| `device.serial_no` | Có nếu thiết bị mới | `VARCHAR(50)` | UNIQUE trong bảng `device` (QT-03) |

---

# MỤC 5 — WIREFRAME 3 MÀN HÌNH

Có 3 màn hình:

1. Danh sách yêu cầu bảo hành — UC5, UC6.
2. Tạo yêu cầu mới — UC1, UC2.
3. Chi tiết yêu cầu — UC3, UC4.

Mọi trường hiển thị đều tồn tại trong mô hình dữ liệu ở Mục 4; nhãn dùng đúng bảng thuật ngữ ở Mục 1.

<!-- Có thể chèn ảnh wireframe tại đây sau khi xuất ảnh từ công cụ thiết kế.
Ví dụ:
![Wireframe danh sách yêu cầu bảo hành](images/wireframe-list.png)
-->

## 5.1. Màn hình 1 — Danh sách yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Use Case liên quan |
|---|---|---|---|
| 1 | Ô tìm kiếm | Tra cứu yêu cầu bảo hành theo thông tin phù hợp | UC6 |
| 2 | Mã yêu cầu | Mã định danh của phiếu bảo hành | UC6 |
| 3 | Khách hàng | Hiển thị thông tin khách hàng của yêu cầu | UC6 |
| 4 | Thiết bị | Hiển thị thiết bị liên quan đến yêu cầu | UC6 |
| 5 | Nhóm sự cố | Hiển thị nhóm sự cố đã phân loại | UC6 |
| 6 | Mức ưu tiên | Hiển thị mức ưu tiên: Cao / Trung bình / Thấp | UC6 |
| 7 | Trạng thái | Hiển thị trạng thái hiện tại của yêu cầu | UC6 |
| 8 | Hạn cam kết | Hiển thị thời hạn SLA của yêu cầu | UC5 |
| 9 | Danh sách quá hạn | Cho phép nhận biết các yêu cầu đã hoặc sắp quá hạn | UC7 |

## 5.2. Màn hình 2 — Tạo yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Dữ liệu liên quan |
|---|---|---|---|
| 1 | Số điện thoại khách hàng | Nhập số điện thoại để tra cứu khách hàng | `customer.phone` |
| 2 | Họ tên khách hàng | Hiển thị thông tin khách hàng sau khi tra cứu | `customer.full_name` |
| 3 | Thông tin thiết bị | Chọn/nhập thiết bị của khách hàng | `device.product_name`, `device.serial_no` |
| 4 | Mô tả sự cố | Nhập nội dung lỗi hoặc vấn đề của thiết bị | `ticket.issue_desc` |
| 5 | Nhóm sự cố | Phân loại yêu cầu theo nhóm sự cố | `ticket.category_id` |
| 6 | Mức ưu tiên | Chọn mức ưu tiên cho yêu cầu | `ticket.priority` |
| 7 | Nút Lưu/Tạo yêu cầu | Tạo phiếu bảo hành mới | `ticket` |
| 8 | Thông báo lỗi | Thông báo khi thiếu dữ liệu hoặc dữ liệu không hợp lệ | UC2 / UC3 / UC4 |

## 5.3. Màn hình 3 — Chi tiết yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Dữ liệu liên quan |
|---|---|---|---|
| 1 | Mã yêu cầu | Mã hiển thị của phiếu bảo hành | `ticket.ticket_code` |
| 2 | Thông tin khách hàng | Hiển thị khách hàng của yêu cầu | `customer` |
| 3 | Thông tin thiết bị | Hiển thị thiết bị liên quan | `device` |
| 4 | Mô tả sự cố | Hiển thị nội dung lỗi đã ghi nhận | `ticket.issue_desc` |
| 5 | Nhóm sự cố | Hiển thị nhóm sự cố của yêu cầu | `ticket.category_id` |
| 6 | Mức ưu tiên | Hiển thị mức ưu tiên hiện tại | `ticket.priority` |
| 7 | Hạn cam kết (SLA) | Hiển thị thời hạn phải hoàn tất yêu cầu | `ticket.due_date` |
| 8 | Trạng thái hiện tại | Cho biết yêu cầu đang ở trạng thái nào | `ticket.status` |
| 9 | Lịch sử trạng thái | Hiển thị các lần thay đổi trạng thái | `ticket_status_log` |
| 10 | Thời gian cập nhật | Hiển thị thời điểm thay đổi trạng thái | `ticket_status_log.changed_at` |

---

# PHỤ LỤC — BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
|---|---|---|---|
| Claude (Anthropic) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API Contract. | Mục 1–6 SRS; Thành phần 2, 3, 4, 5. | Tự đọc lại toàn bộ, đối chiếu bối cảnh case study và phạm vi đã duyệt buổi 2; tự kiểm tra bảng truy vết không ô trống; tự chỉnh sơ đồ theo quy ước đã học. |
| ChatGPT (OpenAI) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API Contract; rà soát tính nhất quán giữa các phần. | Rà soát Mục 1–6 SRS; tập trung Mục 3 (kiến trúc), Mục 4 (mô hình dữ liệu), Mục 5 (wireframe). | Tự kiểm tra các nội dung được gợi ý; đối chiếu ERD với mô hình dữ liệu và phạm vi đề tài; tự quyết định và chỉnh sửa nội dung cuối cùng trước khi đưa vào báo cáo. |
| Figma AI | Hỗ trợ gợi ý bố cục giao diện và tham khảo thiết kế wireframe cho các màn hình tiếp nhận, tạo mới và xem chi tiết phiếu bảo hành. | Mục 5 — Wireframe giao diện. | Tự kiểm tra các nội dung được gợi ý, đối chiếu với yêu cầu đề tài và tự chỉnh sửa trước khi đưa vào báo cáo. |
| Stitch | Hỗ trợ tạo mẫu giao diện và gợi ý cách sắp xếp các thành phần trên màn hình tiếp nhận, tạo mới và xem chi tiết phiếu bảo hành. | Mục 5 — Wireframe giao diện. | Tự rà soát mẫu giao diện, đối chiếu yêu cầu nghiệp vụ và chỉnh sửa trước khi đưa vào báo cáo. |

---

**Kết thúc tài liệu SRS.**