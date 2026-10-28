# Smart CRM – Mekong Mobile (L2)

Prototype **tiếp nhận và phân loại phiếu bảo hành** cho chuỗi Mekong Mobile. Nhân viên tra cứu khách theo số điện thoại, tạo phiếu (wizard 2 bước), phân loại nhóm sự cố và xác định mức ưu tiên ngay khi lưu. Quản lý xem danh sách phiếu, lọc theo hạn cam kết, chi tiết phiếu và lịch sử trạng thái.

Track: Công nghệ phần mềm (SE). Luồng: L2.

## 2. Yêu cầu môi trường

- Node.js 22 trở lên
- CSDL: **Aiven MySQL 8** khi đã điền `MYSQL_PASSWORD` trong `.env`; nếu để trống mật khẩu thì chạy **SQLite** file cục bộ (không cần cài máy chủ)
- Kiểm thử luôn dùng SQLite `:memory:`, không đụng Aiven
- Biến môi trường: xem `.env.example`

## 3. Cài đặt và chạy

Làm đúng các lệnh dưới đây từ thư mục gốc repo.

```bash
copy .env.example .env
```

Mở `.env`, dán mật khẩu Aiven vào `MYSQL_PASSWORD` (file này đã nằm trong `.gitignore`, không commit).

```bash
npm install
npm run migrate
npm run seed
npm start
```

Mở http://localhost:3000 → chuyển tới đăng nhập.

Khi khởi động, console in `CSDL: Aiven MySQL ...` nếu đã kết nối cloud; nếu chưa có mật khẩu thì in `CSDL: SQLite ...`.

Tài khoản mẫu:

- Nhân viên tiếp nhận (US1–US5): `nv1` / `123456` — Nguyễn Thảo
- Quản lý trung tâm (US6–US7): `ql1` / `123456` — Trần Minh Quản; `ql2` / `123456` — Lê Thị Mai

Sau khi đổi seed, chạy lại `npm run seed` để đồng bộ tên và tài khoản `ql2`.

Chạy `npm run seed` lần hai không nhân đôi dữ liệu (khóa UNIQUE + `INSERT IGNORE` / `INSERT OR IGNORE`).

## 4. Kiểm thử

```bash
npm test
```

Bốn nhóm: luồng đúng (tạo phiếu còn bảo hành), giá trị biên bảo hành, dữ liệu sai (thiếu `issue_desc` → 400), SLA ưu tiên cao (+24 giờ làm việc cùng giờ ngày hôm sau).

## 5. Cách kiểm tra hệ thống đã chạy đúng

```bash
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d "{\"username\":\"nv1\",\"password\":\"123456\"}"
```

Lấy `token` rồi:

```bash
curl -s http://localhost:3000/api/tickets -H "Authorization: Bearer TOKEN"
```

Phải thấy phiếu mẫu `BH-000001/2026`. Thiếu `issue_desc` khi tạo phiếu phải ra HTTP 400, mã `DU_LIEU_KHONG_HOP_LE`.

## 6. Giao diện và vai trò

| Màn hình | Nhân viên | Quản lý |
|----------|-----------|---------|
| `login.html` | ✓ | ✓ |
| `tickets.html` — danh sách, thẻ thống kê, tab lọc | ✓ | ✓ (không tạo phiếu) |
| `ticket-new.html` — tạo phiếu wizard | ✓ | ✗ (redirect về danh sách) |
| `ticket-detail.html` — chi tiết, banner SLA, timeline | ✓ | ✓ |

**Danh sách phiếu (`tickets.html`):**

- Thẻ: Tổng phiếu hôm nay, Đang xử lý (+ ghi chú tiếp nhận hôm nay), Sắp đến hạn, Quá hạn.
- Tab lọc: **Tất cả** | **Sắp đến hạn** | **Quá hạn** (lọc trên trình duyệt, cùng logic màu cột Hạn cam kết).
- Cột **Hạn cam kết**: xanh = trong hạn (> 24 giờ), vàng = sắp đến hạn (≤ 24 giờ), đỏ = quá hạn; chưa có hạn + trạng thái Mới tiếp nhận = xanh.

**Chi tiết phiếu:** banner hạn cam kết (xanh / vàng / đỏ), đếm ngược, dòng hạn xử lý theo ưu tiên. Bảo hành: Còn bảo hành | Hết hạn bảo hành | Chưa xác định ngày mua.

**Tạo phiếu:** bước 1 tra SĐT; bước 2 thiết bị & mô tả; lưu một lần → tạo phiếu, phân loại, gán ưu tiên (API). Trường **Nơi mua** lưu `device.note`; địa chỉ khách không bắt buộc (SRS).

## 7. Trạng thái hiện tại (BT2)

- [x] Migration 5 bảng ERD (+ `app_user`) trên Aiven MySQL (fallback SQLite)
- [x] CRUD `customer` và `ticket` qua routes / services / repositories
- [x] Quy tắc QT-02, QT-04 (giờ làm việc T2–T7), QT-05, QT-06, QT-13, QT-15
- [x] Bốn file kiểm thử tự động PASS (`npm test`)
- [x] Bốn màn hình chính + API client + đăng nhập; trạng thái tải / rỗng / lỗi có thử lại
- [x] UI danh sách/chi tiết đồng bộ màu SLA và tab lọc (xem `docs/thay-doi-thiet-ke.md` TD-11…TD-16)
- [ ] Tag `v0.2` khi nộp bài

## 8. Lưu ý khi đối chiếu SRS

- **QT-04 (backend):** `due_date` = tiếp nhận + 24/72/120 **giờ làm việc** (bỏ Chủ nhật), lưu dạng `YYYY-MM-DD HH:mm:ss` giờ máy chủ (không UTC).
- **Cảnh báo UI:** “Sắp đến hạn” trên web = còn **≤ 24 giờ** theo đồng hồ tới `due_date` (màu vàng), khác biệt có chủ ý với giờ làm việc khi tính hạn — mô tả TD-11.
- **GET `/api/tickets?qua_han=true`:** chỉ trả phiếu có `due_date <= now` (quá hạn). UI không dùng query này; lọc Sắp đến hạn / Quá hạn làm trên client sau khi tải full list.
- Phiếu đã gán ưu tiên **trước** khi sửa lưu giờ local có thể còn `due_date` lệch 7 giờ; gán lại ưu tiên hoặc seed lại để đồng bộ.

Tài liệu chi tiết: `docs/srs.md`, `docs/api-contract.md`, `docs/thay-doi-thiet-ke.md`.
