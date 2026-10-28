# Nhật ký thay đổi thiết kế
## Sau phản hồi Bài tập 1 (buổi 8, 15/10/2026)
### TD-01 Mục 4 thiếu SQL DDL, schema MongoDB mâu thuẫn ERD
- Phản hồi của GV: Mục 4 ghi schema MongoDB (`ObjectId`, `status_log` nhúng) trong khi ERD vẽ 5 bảng quan hệ có `ticket_status_log` riêng.
- Quyết định: SỬA
- Lý do: Luồng L2 cần khóa ngoại và lịch sử trạng thái truy vết được. Một mô hình quan hệ MySQL khớp ERD.
- Ảnh hưởng: `docs/schema.sql`; Mục 4 của SRS (DDL, chỉ mục, API).
- Đã khắc phục: Bỏ MongoDB. Viết SQL DDL MySQL 8 (InnoDB, utf8mb4) cho 5 bảng `customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`. Lịch sử trạng thái là bảng riêng, có khóa ngoại `ticket_id`. File chạy được nằm ở `docs/schema.sql` (bản Word đang ghi nhầm đường dẫn `db/schema.sql`).

### TD-02 Thuật ngữ và mã quy tắc chưa thống nhất
- Phản hồi của GV: SRS gọi "yêu cầu bảo hành", API và wireframe gọi "phiếu bảo hành". Wireframe dùng `ticket.sla_due_date`, `ticket.ticket_id` không có trong mô hình (`due_date`, `_id`). Mục 4 trích QT-01…QT-15 nhưng SRS chỉ có R1–R5.
- Quyết định: SỬA
- Lý do: Một khái niệm một tên. Tên thực thể là phiếu bảo hành (`ticket`). Hạn cam kết là `due_date`. Mã hiển thị là `ticket_code`. Quy tắc lấy đúng mã trong Bảng 9.1 của case study.
- Ảnh hưởng: Bảng thuật ngữ Mục 1.1, Mục 1.5, API, wireframe.
- Đã khắc phục: Bảng thuật ngữ và Mục 1.5 trong bản Word đã dùng phiếu bảo hành và các mã QT-01, QT-02, QT-03, QT-04, QT-05, QT-06, QT-13, QT-15. Cột hạn cam kết trong mô hình là `due_date`.
- Còn phải sửa trên bản Word: wireframe vẫn ghi `ticket.sla_due_date` và `ticket.ticket_id`; response mẫu API vẫn là chuỗi `671f...`, trạng thái `MOI`, cột `warranty_verified`; bảng validation vẫn ghi `ObjectId` và collection. Các tên đúng đã ghi trong `docs/srs.md`.

### TD-03 Kiến trúc thiếu NGOÀI PHẠM VI; 8 User Story
- Phản hồi của GV: Sơ đồ kiến trúc chưa ghi phần NGOÀI PHẠM VI. Có 8 User Story, vượt mức 5–7.
- Quyết định: SỬA
- Lý do: Đề bài yêu cầu 5–7 User Story và sơ đồ kiến trúc phải ghi phần ngoài phạm vi.
- Ảnh hưởng: Mục 1.3, Mục 1.6, Mục 3.1.
- Đã khắc phục: Mục 1.3 còn 7 User Story (US1–US7). Mục 3.1 đã ghi ngoài phạm vi: phân công kỹ thuật viên (L4), kho linh kiện (L5), bán hàng/khuyến mãi, báo cáo doanh thu, SMS/Zalo, khảo sát hài lòng, đăng nhập/quản lý nhân sự.
- Còn phải sửa trên bản Word: Mục 1.6 còn ô trống. Ghi chú gộp "quá hạn" vào US7 không khớp câu FR7/US7 (hai câu này chỉ còn lịch sử trạng thái). Bảng đã điền trong `docs/srs.md`.

### TD-04 Phụ lục AI, cấu trúc repo và commit
- Phản hồi của GV: Phụ lục AI thiếu dòng cam kết, họ tên, MSSV, ngày. Repo để `.drawio` ngoài `docs/`, thiếu `.gitignore`, `.env.example`. Commit `file .drawio` lặp lại không có nghĩa.
- Quyết định: SỬA
- Lý do: Đề bài bắt buộc dòng cam kết và cấu trúc repo tối thiểu.
- Ảnh hưởng: Phụ lục AI, `.gitignore`, `.env.example`, vị trí sơ đồ.
- Đã khắc phục: Bản Word đã có dòng "Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp", họ tên Nguyễn Ái Băng Nhi, MSSV 2374802010368, ngày 15/10/2026. Repo đã có `.gitignore` và `.env.example`.
- Còn phải sửa: dòng Cursor trong phụ lục đang trống (nội dung điền nằm trong `docs/srs.md`). Thư mục làm việc hiện không còn file `.drawio` trong `docs/`. Cần đưa `usecase.drawio`, `architecture.drawio`, `erd.drawio` vào `docs/` và commit theo việc, ví dụ `docs(erd): chuyển sơ đồ vào docs và thêm schema.sql`.

## Sau khi hiện thực Bài tập 2 (21/10/2026)

### TD-05 Dùng SQLite cục bộ thay Aiven MySQL khi chạy prototype

- Thay đổi gì: runtime mặc định là file `data/smartcrm.sqlite`. DDL chạy nằm ở `sql/001_schema.sql` (cùng 5 bảng ERD). `docs/schema.sql` vẫn là bản MySQL đã nộp ở BT1.
- Vì sao: đề BT2 bắt buộc người khác dựng lại được từ README, không phụ thuộc dịch vụ Aiven (có thể tắt sau khi không dùng). Buổi 8 cho phép SQLite làm phương án dự phòng.
- Ảnh hưởng: `src/db.js`, `sql/001_schema.sql`, `.env.example`, README.
- Ghi chú kỹ thuật: không dùng `better-sqlite3` vì gói đó cần biên dịch C++ trên Windows. Dùng `node:sqlite` có sẵn từ Node 22.

### TD-06 Thêm bảng app_user và đăng nhập cơ bản

- Thay đổi gì: thêm `app_user` (không có trong ERD BT1) và `POST /api/login`.
- Vì sao: đề BT2 yêu cầu xác thực đăng nhập ở mức cơ bản cho module mở rộng.
- Ảnh hưởng: `sql/001_schema.sql`, `src/services/auth.service.js`, `public/login.html`.

### TD-07 Xóa là soft delete (cột is_active)

- Thay đổi gì: `customer` và `ticket` có `is_active`. `DELETE` chỉ gán 0, không xóa dòng.
- Vì sao: QT-13 cấm xóa vật lý; đề bài vẫn yêu cầu đủ thao tác CRUD.
- Ảnh hưởng: schema SQLite, `customer.service.js`, `ticket.service.js`.

### TD-08 Bổ sung endpoint CRUD ngoài 7 API của BT1

- Thay đổi gì: thêm list/update/delete `customer` và update/delete `ticket` để đủ bốn thao tác trên hai thực thể.
- Vì sao: tiêu chí S1 của BT2 yêu cầu ≥ 2 thực thể có đủ tạo-đọc-sửa-xóa.
- Ảnh hưởng: `src/routes/customers.routes.js`, `src/routes/tickets.routes.js`, `docs/api-contract.md` (bảy API nghiệp vụ L2 giữ nguyên).

### TD-10 Bổ sung validation đầy đủ theo SRS/schema (BT2)

- Thay đổi gì: tập trung ràng buộc tại `src/utils/fieldRules.js`, dùng chung API và form (`public/js/fieldRules.js`): phone QT-02, họ tên/địa chỉ/tên thiết bị theo VARCHAR, serial 8–50 ký tự QT-03, mô tả 10–500, ngày mua không tương lai, bảo hành 1–120 tháng.
- Vì sao: SRS Mục 4 và bảng validation BT1; làm rõ nghiệp vụ trên form trước khi gọi API.
- Ảnh hưởng: `ticket.validator.js`, `customer.validator.js`, `ticket-new.html`, `ticket-new.js`, `docs/api-contract.md`.

### TD-09 Kết nối Aiven MySQL, giữ SQLite cho test và máy không có mật khẩu

- Thay đổi gì: runtime dùng Aiven MySQL 8 (SSL) khi `.env` có `MYSQL_HOST` và `MYSQL_PASSWORD`. Thiếu mật khẩu thì vẫn chạy file SQLite. Test luôn mở `:memory:`.
- Vì sao: BT1 đã chốt MySQL trên Aiven; BT2 cần người khác dựng lại được nếu Aiven tắt — SQLite là phương án dự phòng buổi 8.
- Ảnh hưởng: `src/db.js`, `sql/001_schema.mysql.sql`, `.env.example`, README. Mật khẩu chỉ nằm trong `.env` (gitignore).

## Sau rà soát giao diện và SLA (28/10/2026)

### TD-11 Ngưỡng màu “Sắp đến hạn” trên giao diện (24 giờ wall-clock)

- Thay đổi gì: danh sách và banner chi tiết dùng chung `slaBannerTone` / `dueTone`: **xanh** (> 24 giờ hoặc chưa có hạn + Mới tiếp nhận), **vàng** (≤ 24 giờ), **đỏ** (quá `due_date`). Thẻ thống kê “Sắp đến hạn” đếm theo vàng.
- Vì sao: wireframe và UX cần cảnh báo sớm theo thời gian còn lại trên lịch; **không** thay thế QT-04 khi server tính `due_date` (giờ làm việc T2–T7).
- Ảnh hưởng: `public/js/layout.js`, `public/tickets.html`, `public/ticket-detail.html`, `public/css/app.css`.

### TD-12 Tách tab lọc “Sắp đến hạn” và “Quá hạn”

- Thay đổi gì: bỏ tab gộp “Sắp / quá hạn”; thêm hai tab riêng; luôn `GET /api/tickets` (full list), lọc client theo `dueTone`.
- Vì sao: US6 cần phân biệt sắp đến hạn và đã quá hạn; tránh lệch với `qua_han=true` (API chỉ lọc `due_date <= now`, không gồm “sắp”).
- Ảnh hưởng: `public/tickets.html`. API `qua_han` giữ nguyên cho tích hợp khác / tài liệu BT1.

### TD-13 Hiển thị bảo hành trên chi tiết phiếu

- Thay đổi gì: thay chuỗi “Hết / chưa xác minh” bằng **Hết hạn bảo hành** (có ngày mua) hoặc **Chưa xác định ngày mua** (thiếu ngày mua). `is_warranty` backend vẫn false khi không có ngày mua (QT-05).
- Ảnh hưởng: `public/ticket-detail.html`.

### TD-14 Form tạo phiếu (wizard) và trường dữ liệu

- Thay đổi gì: wizard 2 bước (SĐT → thiết bị/sự cố); địa chỉ khách không bắt buộc; **Nơi mua** → `device.note`, `warranty_months` ẩn mặc định 12; một lần Lưu gọi create + classify + setPriority; kiểm tra serial trùng khách khác; giảm autofill trình duyệt.
- Vì sao: khớp SRS, wireframe và phản hồi demo.
- Ảnh hưởng: `public/ticket-new.html`, `public/js/ticket-new.js`, `src/services/ticket.service.js` (`serial-check`).

### TD-15 Lưu `due_date` / `received_at` theo giờ local

- Thay đổi gì: `formatLocalDateTime` / `computeDueDateIso`; bỏ `toISOString()` khi lưu hạn (tránh lệch −7 giờ ở VN). Test `tests/sla.test.js`: tiếp nhận 10:10:29 + ưu tiên cao → hạn 10:10:29 ngày hôm sau (trong cùng khoảng không qua CN).
- Ảnh hưởng: `src/utils/datetime.js`, `src/utils/sla.js`, `src/services/ticket.service.js`, `package.json` (script test).

### TD-16 Thẻ thống kê danh sách phiếu

- Thay đổi gì: “Tổng phiếu hôm nay” = số tiếp nhận trong ngày; “Đang xử lý” = tổng phiếu active; ghi chú tiếp nhận hôm nay theo `received_at` (không chỉ trạng thái Mới tiếp nhận).
- Ảnh hưởng: `public/tickets.html`.

### Rà soát xung đột / không lỗi nghiêm trọng (28/10/2026)

| Hạng mục | Kết luận |
|----------|----------|
| US1–US7 vs màn hình | Đủ luồng tra cứu, tạo, phân loại/ưu tiên lúc tạo, xem hạn, danh sách + lọc, timeline (quản lý). |
| QT-06 trên chi tiết | Phân loại/ưu tiên thực hiện lúc tạo phiếu hoặc API riêng; chi tiết chỉ xem (không form sửa trạng thái) — đúng phạm vi L2 demo. |
| `qua_han` API vs UI | Không xung đột: UI không gọi `qua_han`; tài liệu API vẫn mô tả query cũ. |
| `dueSoon` (3 giờ) | Đã gỡ — tránh lệch với ngưỡng 24 giờ trên UI. |
| Hai bản `public/tickets.html` trên git ( `\` vs `/` ) | Cùng file trên Windows; không phải hai implementation. |