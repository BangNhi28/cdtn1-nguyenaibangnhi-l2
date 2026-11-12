# Bug Log — Smart CRM L2

Mỗi bug **7 dòng**. Mỗi bug **một commit** riêng; link commit phải mở được (repo PUBLIC).

---

## BUG-01

| | |
|---|---|
| **1. Mã · mức độ** | BUG-01 · **Major** |
| **2. Phát hiện bởi** | Tự test SLA / Test Report TC-01, TC-03 |
| **3. Triệu chứng** | Cột **Hạn cam kết** và API `due_date` lệch ~7 giờ so với giờ tiếp nhận (VN UTC+7) |
| **4. Cách tái lập** | Tạo phiếu → gán ưu tiên Cao → so sánh `received_at` với `due_date` trên DB/UI |
| **5. Nguyên nhân** | Lưu thời gian bằng `Date.toISOString()` (UTC) thay vì giờ local |
| **6. Cách sửa** | Thêm `formatLocalDateTime` / `parseLocalDateTime`; SLA dùng giờ local (`src/utils/datetime.js`, `sla.js`) |
| **7. Commit · xác nhận** | `https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2/commit/5a0b709` · Sau sửa: `npm test` pass (gồm `tests/sla.test.js`) |

---

## BUG-02

| | |
|---|---|
| **1. Mã · mức độ** | BUG-02 · **Major** |
| **2. Phát hiện bởi** | Tự test UI tạo phiếu |
| **3. Triệu chứng** | Lỗi validation (tên thiết bị, mô tả) chỉ hiện banner chung, khó biết trường nào sai |
| **4. Cách tái lập** | `ticket-new.html` → bước 2 → để trống **Tên thiết bị** hoặc mô tả &lt; 10 ký tự → Lưu |
| **5. Nguyên nhân** | `public/js/ticket-new.js` gom lỗi một chỗ, không gắn `#error-*` theo field |
| **6. Cách sửa** | Hiển thị lỗi dưới từng ô; banner bảo hành xanh/cam/xám theo QT-05 |
| **7. Commit · xác nhận** | `https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2/commit/33ef3e0` · Sau sửa: thử lại bước 4 |

---

## BUG-03

| | |
|---|---|
| **1. Mã · mức độ** | BUG-03 · **Major** |
| **2. Phát hiện bởi** | Giảng viên / đối chiếu README khi nộp BT2 |
| **3. Triệu chứng** | Hướng dẫn chạy ghi port **3000** nhưng `server.js` mặc định **3001** → curl/UI không vào được |
| **4. Cách tái lập** | Làm theo README cũ → mở `localhost:3000` → connection refused |
| **5. Nguyên nhân** | `README.md` và `.env.example` không đồng bộ với `process.env.PORT` |
| **6. Cách sửa** | Cập nhật README, `.env.example`, ví dụ `curl` dùng port 3001 |
| **7. Commit · xác nhận** | `https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2/commit/17ab783` · Sau sửa: `curl` login port 3001 OK |

---


**Yêu cầu BT3 / buổi 14:** ≥ 3 bug, ≥ 1 Critical hoặc Major — đủ 3 **Major** như trên.
