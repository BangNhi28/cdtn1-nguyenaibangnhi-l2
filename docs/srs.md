# BÁO CÁO BÀI TẬP 1
## MÔN: CHUYÊN NGÀNH TỐT NGHIỆP 1

**Trường:** Trường Đại học Văn Lang  
**Khoa:** Công nghệ Thông tin

**Đề tài:** Hệ thống Smart CRM – Mekong Mobile  
**Phân hệ:** L2 — Tiếp nhận và xử lý yêu cầu bảo hành

- **Track:** Công nghệ phần mềm (SE)
- **Lớp:** 261_71ITGR40203_06
- **Link GitHub repo:** https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2.git
- **Sinh viên thực hiện:** Nguyễn Ái Băng Nhi – 2374802010368
- **Giảng viên hướng dẫn:** TS. Nguyễn Trí Hải

---

## LỊCH SỬ THAY ĐỔI (VERSION HISTORY)

| Phiên bản | Ngày | Nội dung thay đổi | Người thực hiện |
|---|---|---|---|
| 1.0 | 08/10/2026 | Cập nhật tài liệu SRS; xác định phạm vi hệ thống, yêu cầu nghiệp vụ, yêu cầu chức năng và phi chức năng; xây dựng bảng truy vết, mô hình kiến trúc, ERD và wireframe giao diện. | Nguyễn Ái Băng Nhi |
| 1.1 | 18/10/2026 | Bỏ schema MongoDB, viết SQL DDL MySQL 8 cho 5 bảng quan hệ, lịch sử trạng thái nằm ở `ticket_status_log`. Thống nhất thuật ngữ phiếu bảo hành và cột `due_date`. Đổi R1–R5 thành QT-01, QT-02, QT-03, QT-04, QT-05, QT-06, QT-13, QT-15. Giảm User Story từ 8 xuống 7. Ghi phần ngoài phạm vi trên sơ đồ kiến trúc. | Nguyễn Ái Băng Nhi |

---

# MỤC 1 — BẢN SRS RÚT GỌN

## 1.1. Giới thiệu và phạm vi

### Bối cảnh

Mekong Mobile là chuỗi 24 cửa hàng và 6 trung tâm bảo hành tại TP.HCM, Cần Thơ và Hà Nội, với khoảng 260 yêu cầu bảo hành mỗi tháng. Hiện yêu cầu bảo hành được ghi tay nên không ai biết yêu cầu đang ở bước nào, ai đang xử lý và đã quá hạn cam kết hay chưa.

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

| Thuật ngữ | Giải nghĩa | Tên kỹ thuật |
|---|---|---|
| Khách hàng | Người đã mua hàng hoặc dùng dịch vụ của Mekong Mobile. | `customer` |
| Thiết bị | Máy cụ thể của khách, định danh bằng số serial/IMEI. | `device` |
| Phiếu bảo hành | Một phiếu ghi nhận lỗi/sự cố của khách hàng cần xử lý, có mã, trạng thái và hạn cam kết. | `ticket` |
| Trạng thái | Mới tiếp nhận → Đã phân loại → Đã xác định ưu tiên. | `status` |
| Lịch sử trạng thái | Mỗi lần chuyển trạng thái được ghi kèm thời điểm và người thực hiện. | `ticket_status_log` |
| Hạn cam kết (SLA) | Thời điểm trễ nhất phải hoàn tất phiếu, tính từ lúc tiếp nhận, phụ thuộc mức ưu tiên. | `due_date` |
| Nhóm sự cố | Phân loại loại lỗi: Phần cứng / Phần mềm / Khác. | `issue_category` |
| Mức ưu tiên | Mức khẩn của phiếu: Cao / Trung bình / Thấp; quyết định hạn cam kết. | `priority` |
| Tình trạng bảo hành | Còn bảo hành / Hết bảo hành / Chưa xác minh, xác định lúc tiếp nhận. | `is_warranty`, `purchase_date` |

## 1.2. Các bên liên quan và vai trò người dùng

| Vai trò | Được làm | Không được làm |
|---|---|---|
| Nhân viên tiếp nhận | Ghi nhận yêu cầu mới, phân loại và xác định ưu tiên, tra cứu yêu cầu. | Gán kỹ thuật viên, cập nhật trạng thái xử lý kỹ thuật. |
| Quản lý trung tâm | Xem danh sách phiếu bảo hành, xem danh sách quá hạn, xem lịch sử thay đổi trạng thái. | Trực tiếp chỉnh sửa nội dung kỹ thuật của yêu cầu. |

## 1.3. Yêu cầu chức năng (FR) và User Story

| Mã | Yêu cầu chức năng | User Story | MoSCoW |
|---|---|---|---|
| FR1 | Tra cứu khách hàng theo số điện thoại; nếu tìm thấy thì tự điền họ tên, địa chỉ và danh sách thiết bị của khách | US1 | SHOULD |
| FR2 | Ghi nhận phiếu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) | US2 | MUST |
| FR3 | Phân loại yêu cầu theo nhóm sự cố | US3 | MUST |
| FR4 | Xác định mức độ ưu tiên của yêu cầu | US4 | MUST |
| FR5 | Xem hạn cam kết của yêu cầu bảo hành | US5 | SHOULD |
| FR6 | Xem danh sách phiếu bảo hành và trạng thái xử lý, gồm bộ lọc sắp hoặc đã quá hạn | US6 | SHOULD |
| FR7 | Xem lịch sử thay đổi trạng thái của phiếu bảo hành | US7 | COULD |

### US1 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng theo số điện thoại để nhanh chóng xác định thông tin khách hàng khi tiếp nhận yêu cầu bảo hành.

### US2 [MUST]

Là nhân viên tiếp nhận, tôi muốn ghi nhận phiếu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) để bắt đầu quy trình xử lý.

- **AC1:** Given đã đăng nhập, When nhập đủ thông tin và nhấn Lưu, Then hệ thống tạo phiếu mới, trạng thái "Mới tiếp nhận".
- **AC2 (ngoại lệ):** Given bỏ trống trường bắt buộc, When nhấn Lưu, Then hệ thống báo lỗi, không tạo phiếu.

### US3 [MUST]

Là nhân viên tiếp nhận, tôi muốn phân loại yêu cầu theo nhóm sự cố để xác định loại vấn đề cần xử lý.

- **AC1:** Given phiếu ở trạng thái "Mới tiếp nhận", When chọn nhóm sự cố, Then trạng thái chuyển "Đã phân loại".
- **AC2 (ngoại lệ):** Given phiếu chưa được ghi nhận, When cố phân loại, Then hệ thống từ chối thao tác.

### US4 [MUST]

Là nhân viên tiếp nhận, tôi muốn xác định mức độ ưu tiên của yêu cầu để đảm bảo xử lý theo mức độ cần thiết.

- **AC1:** Given phiếu đã phân loại, When chọn mức ưu tiên (Thấp/Trung bình/Cao), Then hệ thống lưu và tính hạn cam kết tương ứng.
- **AC2 (ngoại lệ):** Given mức ưu tiên để trống hoặc không hợp lệ, When lưu, Then hệ thống báo lỗi yêu cầu chọn lại.

### US5 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn xem hạn cam kết của phiếu bảo hành sau khi xác định ưu tiên để biết thời hạn xử lý và cung cấp thông tin cho khách hàng.

### US6 [SHOULD]

Là quản lý trung tâm, tôi muốn xem danh sách các phiếu bảo hành và trạng thái xử lý, gồm các phiếu sắp hoặc đã quá hạn, để theo dõi tình hình xử lý tại trung tâm.

### US7 [COULD]

Là quản lý trung tâm, tôi muốn xem chi tiết lịch sử thay đổi trạng thái của phiếu bảo hành để theo dõi quá trình xử lý và kiểm tra tiến độ của từng yêu cầu.

## 1.4. Yêu cầu phi chức năng (NFR)

| Mã | Mô tả | Ngưỡng |
|---|---|---|
| NFR1 | Thời gian phản hồi API tra cứu/tạo phiếu | ≤ 3 giây |
| NFR2 | Thời gian lưu trữ dữ liệu phiếu | Tối thiểu 2 năm |
| NFR3 | Tỉ lệ sẵn sàng hệ thống | ≥ 98% |

## 1.5. Ràng buộc và quy tắc nghiệp vụ

| Mã | Quy tắc |
|---|---|
| QT-01 | Số điện thoại khách hàng là duy nhất; nhập số đã tồn tại thì hiển thị hồ sơ có sẵn thay vì tạo mới. |
| QT-02 | Số điện thoại được chuẩn hóa về 10 chữ số bắt đầu bằng 0 trước khi lưu (+84…, 84…, dấu cách, dấu chấm đều quy về dạng chuẩn). |
| QT-03 | Thiết bị xác định duy nhất bằng serial/IMEI; một thiết bị chỉ thuộc một khách hàng tại một thời điểm. |
| QT-04 | Hạn cam kết sinh tự động từ thời điểm tiếp nhận: Cao = 24 giờ, Trung bình = 72 giờ, Thấp = 120 giờ; chỉ tính ngày làm việc (thứ Hai–thứ Bảy). |
| QT-05 | Còn bảo hành nếu (ngày tiếp nhận − ngày mua) ≤ số tháng bảo hành; không có ngày mua thì đánh dấu "Chưa xác minh". Bước phê duyệt của quản lý nằm ngoài phạm vi. |
| QT-06 | Phiếu chỉ chuyển trạng thái theo vòng đời; không quay lại trạng thái trước; mọi lần chuyển ghi vào `ticket_status_log`. |
| QT-13 | Không xóa vật lý phiếu và hồ sơ khách hàng: hệ thống không cung cấp thao tác xóa. |
| QT-15 | Số điện thoại hiển thị dạng che với mọi vai trò trừ Quản lý trung tâm. |

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

Bản 08/10 có 8 User Story. Bản 18/10 còn 7: danh sách sắp hoặc đã quá hạn là bộ lọc của US6, không còn là một User Story riêng. US7 chỉ là xem lịch sử trạng thái.

---

# MỤC 2 — USE CASE

## 2.1. Use Case Diagram

**Actor (2):** Nhân viên tiếp nhận; Quản lý trung tâm.

**Use Case (7):**

- UC1: Tra cứu khách hàng theo số điện thoại.
- UC2: Ghi nhận phiếu bảo hành mới.
- UC3: Phân loại phiếu theo nhóm sự cố.
- UC4: Xác định mức ưu tiên.
- UC5: Xem hạn cam kết.
- UC6: Xem danh sách phiếu và trạng thái, gồm phiếu sắp hoặc đã quá hạn.
- UC7: Xem lịch sử thay đổi trạng thái.

## 2.2. Đặc tả Use Case chính — UC2 Ghi nhận phiếu bảo hành mới

- **Actor chính:** Nhân viên tiếp nhận.
- **User Story liên quan:** US2.
- **Mục tiêu:** Tạo phiếu bảo hành mới với mã tự động.
- **Điều kiện trước:** Nhân viên tiếp nhận đã đăng nhập.
- **Điều kiện sau:** Phiếu mới được tạo với mã tự động, trạng thái "Mới tiếp nhận", sẵn sàng để phân loại (UC3).

### Luồng chính

1. Nhân viên tiếp nhận chọn "Tạo yêu cầu mới".
2. Hệ thống hiển thị form nhập thông tin.
3. Nhân viên nhập số điện thoại khách hàng — hệ thống tự động điền thông tin nếu khách đã tồn tại (UC1).
4. Nhân viên nhập sản phẩm và mô tả lỗi.
5. Nhân viên nhấn Lưu.
6. Hệ thống kiểm tra hợp lệ, tạo mã phiếu, lưu trạng thái "Mới tiếp nhận".
7. Hệ thống hiển thị xác nhận thành công.

### Luồng ngoại lệ

- **5a.** Thiếu trường bắt buộc → hệ thống báo lỗi, giữ nguyên form, quay lại bước 4.
- **6a.** Số điện thoại không đúng định dạng → hệ thống báo lỗi định dạng, quay lại bước 3.

---

# MỤC 3 — THIẾT KẾ KIẾN TRÚC

## 3.1. Sơ đồ kiến trúc phân lớp cho luồng L2

**Chú thích:** Mũi tên là hướng phụ thuộc một chiều. Presentation gọi Business qua HTTP/JSON; Business gọi Repository qua interface; Repository dùng MySQL để đọc/ghi CSDL. Lớp dưới không gọi ngược lớp trên.

**Ngoài phạm vi:** phân công kỹ thuật viên (L4), kho linh kiện (L5), bán hàng/khuyến mãi, báo cáo doanh thu, SMS/Zalo, khảo sát hài lòng, đăng nhập/quản lý nhân sự.

## 3.2. Ba câu lập luận

1. Vì NFR1 yêu cầu thời gian phản hồi API tra cứu/tạo phiếu ≤ 3 giây, tôi chọn kiến trúc phân lớp và tách truy cập dữ liệu vào Repository để các truy vấn được tập trung, có thể tối ưu/index mà không sửa lớp giao diện; đánh đổi là phải đi qua thêm một lớp trung gian nên mã nguồn có nhiều thành phần hơn.

2. Vì NFR2 yêu cầu lưu trữ dữ liệu phiếu tối thiểu 2 năm, tôi chọn MySQL 8 và tách lịch sử trạng thái thành bảng `ticket_status_log` thay vì nhúng mảng vào phiếu; đánh đổi là phát sinh thêm bản ghi và cần JOIN khi xem lịch sử, nhưng dữ liệu truy vết rõ ràng và khóa ngoại được CSDL kiểm tra.

3. Vì NFR3 yêu cầu tỉ lệ sẵn sàng hệ thống ≥ 98%, tôi tách Presentation, Business và Data Access để giới hạn phạm vi ảnh hưởng khi thay đổi/sửa lỗi một thành phần và giữ lớp nghiệp vụ độc lập với công nghệ lưu trữ; đánh đổi là tăng chi phí thiết kế và kiểm thử giữa các lớp.

---

# MỤC 4 — MÔ HÌNH DỮ LIỆU (TRACK SE)

## 4.1. ERD

ERD gồm 5 bảng (`customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`), mỗi bảng có khóa chính, có khóa ngoại, không có bảng cô lập. Ký pháp chân chim. Lịch sử trạng thái là bảng `ticket_status_log`, không nhúng trong `ticket`.

## 4.2. Mỗi bảng phục vụ yêu cầu nào

| Bảng | Phục vụ FR | Lý do tồn tại |
|---|---|---|
| `customer` | FR1, FR2, FR6 | Thực thể khách hàng; số điện thoại là khóa nghiệp vụ UNIQUE (QT-01), khóa chính là khóa nhân tạo. |
| `device` | FR1, FR2, FR6 | Thiết bị xác định bằng serial duy nhất (QT-03); một khách có nhiều thiết bị. |
| `issue_category` | FR3, FR6 | Danh mục nhóm sự cố; thêm nhóm mới chỉ thêm dữ liệu, không sửa mã. |
| `ticket` | FR2, FR3, FR4, FR5, FR6, FR7 | Thực thể trung tâm của luồng: phiếu bảo hành và hạn cam kết. |
| `ticket_status_log` | FR7 | Lịch sử trạng thái (QT-06), không ghi đè một cột `status` duy nhất. |

## 4.3. Chỉ mục và ràng buộc

- `customer.phone` là UNIQUE (QT-01, QT-02).
- `device.serial_no` là UNIQUE (QT-03).
- `ticket.ticket_code` là UNIQUE.
- `device.customer_id`, `ticket.customer_id`, `ticket.device_id`, `ticket.category_id`, `ticket_status_log.ticket_id` là khóa ngoại thật của MySQL. InnoDB kiểm tra tham chiếu.
- Không có bảng cô lập: `customer` được `device` và `ticket` tham chiếu; `device` được `ticket` tham chiếu; `issue_category` được `ticket` tham chiếu; `ticket` được `ticket_status_log` tham chiếu.

## 4.4. SQL DDL

DDL đầy đủ nằm ở `docs/schema.sql`.

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

## 4.5. API Contract

`{id}` là `ticket.ticket_id` kiểu `BIGINT`.

| # | Endpoint | Mô tả | Quy tắc | Truy vết |
|---|---|---|---|---|
| 1 | `GET /api/customers?phone={sdt}` | Tra cứu khách hàng theo SĐT đã chuẩn hóa | QT-01, QT-02, QT-15 | US1, UC1 |
| 2 | `POST /api/tickets` | Ghi nhận phiếu bảo hành mới | QT-02, QT-03, QT-05 | US2, UC2 |
| 3 | `PUT /api/tickets/{id}/phan-loai` | Gán `category_id`, chuyển trạng thái đã phân loại | QT-06 | US3, UC3 |
| 4 | `PUT /api/tickets/{id}/uu-tien` | Gán `priority` và tính `due_date` | QT-04 | US4, UC4, US5 |
| 5 | `GET /api/tickets/{id}` | Xem chi tiết phiếu, gồm `due_date` | QT-15 | US5, UC5 |
| 6 | `GET /api/tickets?qua_han=true` | Danh sách phiếu, lọc phiếu sắp hoặc đã quá `due_date` | QT-04 | US6, UC6 |
| 7 | `GET /api/tickets/{id}/status-log` | Đọc `ticket_status_log` của phiếu | QT-06 | US7, UC7 |

`PUT /api/tickets/{id}/xac-minh-bao-hanh` và `GET /api/bao-cao/theo-nhom-su-co` không thuộc phạm vi: QT-05 ghi bước phê duyệt của quản lý nằm ngoài phạm vi, báo cáo nằm trong phần ngoài phạm vi của Mục 3.1.

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

### Bảng quy tắc validation

| Trường | Bắt buộc | Kiểu MySQL | Ràng buộc |
|---|---|---|---|
| `customer.phone` | Có | `VARCHAR(20)` | 10 số, dạng `0xxxxxxxxx`, UNIQUE (QT-01, QT-02) |
| `ticket.issue_desc` | Có | `TEXT` | 10–500 ký tự |
| `ticket.category_id` | Có khi phân loại | `INT` | Khóa ngoại tới `issue_category.category_id`, NULL trước khi phân loại |
| `ticket.priority` | Có khi xác định ưu tiên | `VARCHAR(10)` | `CAO` / `TRUNG_BINH` / `THAP`, NULL trước bước này |
| `customer.full_name` | Có | `VARCHAR(120)` | 2–120 ký tự |
| `customer.address` | Không | `VARCHAR(255)` | Tối đa 255 ký tự |
| `device.product_name` | Có | `VARCHAR(120)` | 2–120 ký tự |
| `device.serial_no` | Có nếu thiết bị mới | `VARCHAR(50)` | 8–50 ký tự, chữ/số, UNIQUE (QT-03) |
| `device.purchase_date` | Không | `DATE` | Không ở tương lai |
| `device.warranty_months` | Không | `SMALLINT` | 1–120, mặc định 12 |

---

# MỤC 5 — WIREFRAME 3 MÀN HÌNH

Ba màn hình: (1) Danh sách phiếu bảo hành — UC5, UC6; (2) Tạo phiếu mới — UC1, UC2; (3) Chi tiết phiếu — UC3, UC4, UC7. Mọi trường hiển thị đều có trong Mục 4. Nhãn dùng bảng thuật ngữ ở Mục 1.

## 5.1. Màn hình 1 — Danh sách phiếu bảo hành

| STT | Thành phần | Ý nghĩa | Use Case |
|---|---|---|---|
| 1 | Ô tìm kiếm | Tra cứu phiếu theo thông tin phù hợp | UC6 |
| 2 | Mã phiếu | Mã hiển thị của phiếu | UC6, `ticket.ticket_code` |
| 3 | Khách hàng | Khách hàng của phiếu | UC6, `customer.full_name` |
| 4 | Thiết bị | Thiết bị của phiếu | UC6, `device.product_name` |
| 5 | Nhóm sự cố | Nhóm sự cố đã phân loại | UC6, `issue_category.category_name` |
| 6 | Mức ưu tiên | Cao / Trung bình / Thấp | UC6, `ticket.priority` |
| 7 | Trạng thái | Trạng thái hiện tại | UC6, `ticket.status` |
| 8 | Hạn cam kết | Thời hạn SLA | UC5, `ticket.due_date` |
| 9 | Phiếu quá hạn | Nhận biết phiếu sắp hoặc đã quá hạn | UC6, so sánh `ticket.due_date` |

## 5.2. Màn hình 2 — Tạo phiếu bảo hành

| STT | Thành phần | Ý nghĩa | Dữ liệu |
|---|---|---|---|
| 1 | Số điện thoại khách hàng | Tra cứu khách hàng | `customer.phone` |
| 2 | Họ tên khách hàng | Hiển thị sau khi tra cứu | `customer.full_name` |
| 3 | Thông tin thiết bị | Chọn hoặc nhập thiết bị | `device.product_name`, `device.serial_no` |
| 4 | Mô tả sự cố | Nội dung lỗi | `ticket.issue_desc` |
| 5 | Nút Lưu | Tạo phiếu mới | `ticket` |
| 6 | Thông báo lỗi | Thiếu dữ liệu hoặc dữ liệu không hợp lệ | UC2 |

Nhóm sự cố và mức ưu tiên không nằm trên màn tạo mới. Hai thao tác đó thuộc màn chi tiết (UC3, UC4).

## 5.3. Màn hình 3 — Chi tiết phiếu bảo hành

| STT | Thành phần | Ý nghĩa | Dữ liệu |
|---|---|---|---|
| 1 | Mã phiếu | Mã hiển thị của phiếu đang xem | `ticket.ticket_code` |
| 2 | Thông tin khách hàng | Khách hàng của phiếu | `customer` |
| 3 | Thông tin thiết bị | Thiết bị liên quan | `device` |
| 4 | Mô tả sự cố | Nội dung lỗi đã ghi nhận | `ticket.issue_desc` |
| 5 | Nhóm sự cố | Nhóm sự cố của phiếu | `ticket.category_id` |
| 6 | Mức ưu tiên | Mức ưu tiên hiện tại | `ticket.priority` |
| 7 | Hạn cam kết (SLA) | Thời hạn phải hoàn tất phiếu | `ticket.due_date` |
| 8 | Trạng thái hiện tại | Phiếu đang ở trạng thái nào | `ticket.status` |
| 9 | Lịch sử trạng thái | Các lần thay đổi trạng thái | `ticket_status_log`, UC7 |
| 10 | Thời gian cập nhật | Thời điểm thay đổi trạng thái | `ticket_status_log.changed_at` |

---

# PHỤ LỤC — BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
|---|---|---|---|
| Claude (Anthropic) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API contract. | Mục 1–5 SRS. | Tự đọc lại toàn bộ, đối chiếu bối cảnh case study và phạm vi đã duyệt; tự kiểm tra bảng truy vết không ô trống; tự chỉnh sơ đồ theo quy ước đã học. |
| ChatGPT (OpenAI) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API contract. | Rà soát Mục 1–5; tập trung Mục 3, Mục 4 và Mục 5. | Tự kiểm tra các nội dung được gợi ý; đối chiếu ERD với mô hình dữ liệu; tự quyết định và chỉnh sửa nội dung cuối cùng. |
| Figma AI | Hỗ trợ gợi ý bố cục giao diện và tham khảo thiết kế wireframe. | Mục 5 — Wireframe. | Tự kiểm tra bố cục và trường dữ liệu, đối chiếu ERD trước khi đưa vào báo cáo. |
| Stitch | Hỗ trợ tạo mẫu giao diện và gợi ý cách sắp xếp thành phần trên màn hình. | Mục 5 — Wireframe. | Tự rà soát mẫu giao diện, đối chiếu yêu cầu nghiệp vụ và chỉnh sửa trước khi đưa vào báo cáo. |
| Cursor | Hỗ trợ đối chiếu đề bài, case study và phản hồi giảng viên; chỉnh SRS, `schema.sql` và bảng truy vết cho khớp ERD MySQL. | Mục 1, Mục 4, phụ lục; `docs/srs.md`, `docs/schema.sql`, `docs/thay-doi-thiet-ke.md`. | Tự đọc bản Word, đối chiếu ERD và `docs/schema.sql`; tự quyết định nội dung giữ lại. |

Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp.  
Họ tên: Nguyễn Ái Băng Nhi  
MSSV: 2374802010368  
Ngày: 15/10/2026
