# Test Report — Smart CRM L2

**Ngày cập nhật:** 09/11/2026  
**Lệnh tự động:** `npm test`  
**Tổng hợp:** Số TC trong bảng: **12** · Đã chạy thật: **12** · PASS: **12** · FAIL: **0**

> Mỗi TC cần **ảnh** tại `docs/screenshots/<mã>.png`. TC ghi PASS mà chạy lại khác kết quả → không có minh chứng.

| Mã · Ưu tiên | Loại | Tiền điều kiện | Các bước | Kết quả mong đợi | Kết quả thực tế | K/L | Ảnh |
|--------------|------|----------------|----------|-------------------|-----------------|-----|-----|
| TC-01 · Cao | Luồng đúng | DB test `:memory:`; token nv1 | Chạy `npm test` → suite «Luồng đúng: tạo phiếu còn bảo hành» | 1 test pass; POST 201; MOI_TIEP_NHAN; is_warranty true | Pass; status **201**; `ticket_code` dạng `BH-…/2026`; `is_warranty: true` | PASS | `docs/screenshots/TC-01.png` |
| TC-02 · Cao | Luồng đúng | Server chạy; đã seed | 1. POST `/api/login` nv1/123456 2. GET `/api/tickets` kèm Bearer | 200; JSON có phiếu `BH-000001/2026` | **200**; danh sách có phiếu mẫu seed | PASS | `docs/screenshots/TC-02.png` |
| TC-03 · Cao | Biên (QT-05) | — | Chạy test «đúng ngày hết hạn vẫn còn bảo hành» | isUnderWarranty = **true** | Pass trong `ticket-boundary.test.js` | PASS | `docs/screenshots/TC-03.png` |
| TC-04 · Cao | Biên (QT-05) | — | Chạy test «ngày kế tiếp ngày hết hạn thì hết bảo hành» | isUnderWarranty = **false** | Pass trong `ticket-boundary.test.js` | PASS | `docs/screenshots/TC-04.png` |
| TC-05 · TB | Biên | Token nv1 | POST `/api/tickets` với `issue_desc` = 9 ký tự | 400; `DU_LIEU_KHONG_HOP_LE`; `fields` có `issue_desc` | **400**; `DU_LIEU_KHONG_HOP_LE`; `fields`: `issue_desc` (và các trường liên quan) | PASS | `docs/screenshots/TC-05.png` |
| TC-06 · Cao | Dữ liệu sai | DB test; token nv1 | Chạy test «thiếu issue_desc» | 400; `DU_LIEU_KHONG_HOP_LE`; `fields` gồm `issue_desc` | Pass auto test; **400** + `issue_desc` trong `fields` | PASS | `docs/screenshots/TC-06.png` |
| TC-07 · TB | Dữ liệu sai | Token nv1 | POST `/api/tickets` với `phone` = `123` | 400; báo lỗi phone / validation | **400**; `DU_LIEU_KHONG_HOP_LE`; `fields` có `phone` | PASS | `docs/screenshots/TC-07.png` |
| TC-08 · Cao | Bảo mật | Server / test app | GET `/api/tickets` **không** header Authorization | 401; không trả danh sách | **401**; `error`: `CHUA_DANG_NHAP` | PASS | `docs/screenshots/TC-08.png` |
| TC-09 · Cao | Bảo mật (QT-15) | 2 token: nv1 và ql1 | GET cùng `/api/tickets/:id` — so sánh `phone` | nv1: che SĐT; ql1: đủ số | nv1: **`090****567`**; ql1: **`0901234567`** (phiếu seed) | PASS | `docs/screenshots/TC-09.png` |
| TC-10 · Cao | Chất lượng DL (QT-03) | Serial đã thuộc khách A | POST tạo phiếu serial trùng cho khách B (SĐT khác) | **409**; `THIET_BI_THUOC_KHACH_KHAC` | **409**; `THIET_BI_THUOC_KHACH_KHAC`; không tạo phiếu | PASS | `docs/screenshots/TC-10.png` |
| TC-11 · TB | Tái lập (C5) | DB sạch hoặc SQLite file | Chạy `npm run seed` **hai lần** liên tiếp | Lần 2 không lỗi UNIQUE | Lần 2 exit 0; phiếu `BH-000001` không nhân đôi | PASS | `docs/screenshots/TC-11.png` |
| TC-12 · TB | Tái lập | — | Chạy `npm test` **hai lần** liên tiếp | Cả hai: pass, 0 fail | Lần 1 & 2: **18 pass**, **11 suites**, **0 fail** | PASS | `docs/screenshots/TC-12.png` |

**Đủ năm loại:** luồng đúng (TC-01,02) · biên (TC-03–05) · dữ liệu sai (TC-06,07) · bảo mật/chất lượng (TC-08–10) · tái lập (TC-11,12).

**Ảnh tổng hợp npm test:** `docs/screenshots/npm-test.png`

**Ghi chú:** Ảnh PNG em chụp terminal/Postman/UI và đặt vào `docs/screenshots/` trước khi nộp PDF BT3 (hiện chỉ có `README.md` hướng dẫn tên file).
