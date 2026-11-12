# Test Plan (rút gọn) — Smart CRM L2

**Sinh viên:** Nguyễn Ái Băng Nhi · MSSV 2374802010368 · Track SE  
**Phiên bản:** 1.0 (BT3 — kiểm thử & đóng gói) · **Repo:** tag `v1.0` (sau nộp) / nhánh `main`

---

## 1. Phạm vi và phần chủ ý không kiểm

**Trong phạm vi**

- API đăng nhập, tra cứu khách, tạo phiếu, phân loại, ưu tiên, danh sách/chi tiết phiếu, serial-check.
- Quy tắc QT-02 (SĐT), QT-03 (serial), QT-04 (SLA), QT-05 (bảo hành), validation trường bắt buộc.
- Giao diện chính: `login.html`, `tickets.html`, `ticket-new.html`, `ticket-detail.html` (luồng nv1 / ql1).

**Chủ ý không kiểm (Out of scope)**

- Phân công kỹ thuật viên, trạng thái sửa chữa L4, kho linh kiện, SMS/Zalo.
- Kiểm thử tải (load test), E2E trình duyệt tự động (Playwright/Cypress).
- Pentest chuyên sâu; chỉ kiểm tra cơ bản 401/403 và che SĐT QT-15.

---

## 2. Loại test và số lượng (mục tiêu)

| Loại | Số lượng mục tiêu | Cách thực hiện |
|------|-------------------|----------------|
| Luồng đúng | 2–3 | API + UI: đăng nhập, tạo phiếu, xem danh sách |
| Giá trị biên | 2+ | QT-05 ngày cuối / ngày hết BH; độ dài chuỗi min/max |
| Dữ liệu sai | 2+ | Thiếu trường bắt buộc, SĐT/serial không hợp lệ |
| Bảo mật / chất lượng dữ liệu | 2+ | Không token; serial khách khác; che SĐT theo role |
| Tái lập | 2+ | `npm run seed` lần 2; `npm test` lần 2; migrate lần 2 |

**Tổng Test Report:** 10–12 test case (chi tiết tại `docs/test-report.md`).  
**Tự động hóa:** **18** test trong `tests/*.test.js` — chạy bằng `npm test` (bổ sung sau nhận xét BT2: QT-02/03/06/13/15, auth 401/403).

---

## 3. Tiêu chí thành công (đo được)

- `npm test`: **18 pass**, **0 fail**, **11 suites** (cập nhật 09/11/2026).
- API tạo phiếu hợp lệ: HTTP **201**, `status = MOI_TIEP_NHAN`, `ticket_code` khớp `BH-…/năm`.
- Dữ liệu sai: HTTP **400**, mã `DU_LIEU_KHONG_HOP_LE`, `fields` nêu đúng trường.
- Serial khách khác: HTTP **409**, không tạo phiếu mới.
- Không có token: HTTP **401** (hoặc redirect login trên UI).
- Seed lần 2: không lỗi UNIQUE, số phiếu mẫu không nhân đôi bất thường.
- Mỗi test case trong Report có **kết quả thực tế cụ thể** (mã HTTP, thông báo, đếm trước/sau nếu có) và **ảnh** trong `docs/screenshots/`.

---

## 4. Môi trường và dữ liệu thử

| Hạng mục | Giá trị |
|----------|---------|
| Node.js | ≥ 22 |
| Lệnh test tự động | `npm test` (SQLite `:memory:`, không cần Aiven) |
| Lệnh demo / test tay | `copy .env.example .env` → `npm install` → `npm run migrate` → `npm run seed` → `npm start` |
| URL | `http://localhost:3001` (theo `PORT` trong `.env.example`) |
| Tài khoản | `nv1` / `123456`, `ql1` / `123456` |
| Dữ liệu mẫu | Phiếu `BH-000001/2026` sau seed |
| Kỹ thuật chọn dữ liệu | Phân vùng hợp lệ / không hợp lệ; biên bảo hành (ngày cuối còn BH vs ngày sau hết hạn); serial mới vs serial đã tồn tại |

**Reset khi test tay:** có thể xóa DB SQLite local hoặc chạy lại migrate+seed; test tự động tự tạo DB mới mỗi lần..
