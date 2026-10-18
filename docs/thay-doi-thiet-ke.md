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
- Còn phải sửa: dòng Cursor trong phụ lục đang trống (nội dung điền nằm trong `docs/srs.md`). Thư mục làm việc hiện không còn file `.drawio` trong `docs/`. Cần đưa `usecase.drawio`, `architecture.drawio`, `erd.drawio` vào `docs/` và commit theo việc, ví dụ `docs(erd): chuyển sơ đồ vào docs và thêm schema.sql`