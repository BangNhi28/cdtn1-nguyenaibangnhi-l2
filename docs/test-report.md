# Test Report — Smart CRM L2

**Ngày cập nhật:** _(điền ngày chạy)_  
**Lệnh tự động:** `npm test`  
**Tổng hợp:** Số TC trong bảng: **12** · Đã chạy thật: _(điền)_ · PASS: _(điền)_ · FAIL: _(điền)_

> Mỗi TC cần **ảnh** tại `docs/screenshots/<mã>.png`. TC ghi PASS mà chạy lại khác kết quả → không có minh chứng.

| Mã · Ưu tiên | Loại | Tiền điều kiện | Các bước | Kết quả mong đợi | Kết quả thực tế | K/L | Ảnh |
|--------------|------|----------------|----------|-------------------|-----------------|-----|-----|
| TC-01 · Cao | Luồng đúng | DB test `:memory:`; token nv1 | Chạy `npm test` → suite «Luồng đúng: tạo phiếu còn bảo hành» | 1 test pass; POST 201; MOI_TIEP_NHAN; is_warranty true | _(chạy và ghi: vd. pass; status 201; mã BH-…)_ | | `docs/screenshots/TC-01.png` |
| TC-02 · Cao | Luồng đúng | Server chạy; đã seed | 1. POST `/api/login` nv1/123456 2. GET `/api/tickets` kèm Bearer | 200; JSON có phiếu `BH-000001/2026` | _(ghi mã 200, ticket_code thấy trong body)_ | | `docs/screenshots/TC-02.png` |
| TC-03 · Cao | Biên (QT-05) | — | Chạy test «đúng ngày hết hạn vẫn còn bảo hành» (`ticket-boundary.test.js`) | isUnderWarranty = **true** | _(pass trong npm test)_ | | `docs/screenshots/TC-03.png` |
| TC-04 · Cao | Biên (QT-05) | — | Chạy test «ngày kế tiếp ngày hết hạn thì hết bảo hành» | isUnderWarranty = **false** | _(pass trong npm test)_ | | `docs/screenshots/TC-04.png` |
| TC-05 · TB | Biên | Token nv1 | POST `/api/tickets` với `issue_desc` = 9 ký tự (dưới min 10) | 400; `DU_LIEU_KHONG_HOP_LE`; fields có issue_desc | _(điền sau khi gọi curl/Postman)_ | | `docs/screenshots/TC-05.png` |
| TC-06 · Cao | Dữ liệu sai | DB test; token nv1 | Chạy test «thiếu issue_desc» hoặc POST không gửi issue_desc | 400; error DU_LIEU_KHONG_HOP_LE; fields gồm issue_desc | _(pass auto hoặc ghi response JSON)_ | | `docs/screenshots/TC-06.png` |
| TC-07 · TB | Dữ liệu sai | Token nv1 | POST `/api/tickets` với phone = `123` | 400; báo lỗi phone / validation | _(điền mã + message)_ | | `docs/screenshots/TC-07.png` |
| TC-08 · Cao | Bảo mật | Server chạy | GET `/api/tickets` **không** header Authorization | 401 hoặc body lỗi đăng nhập; không trả danh sách | _(điền status + body)_ | | `docs/screenshots/TC-08.png` |
| TC-09 · Cao | Bảo mật (QT-15) | 2 token: nv1 và ql1 | GET cùng `/api/tickets/:id` — so sánh field phone trong JSON | nv1: SĐT che dạng 090\*\*\*\*567; ql1: đủ số | _(paste 2 đoạn phone khác nhau)_ | | `docs/screenshots/TC-09.png` |
| TC-10 · Cao | Chất lượng DL (QT-03) | Serial đã thuộc khách A | POST tạo phiếu serial trùng cho khách B (SĐT khác) | **409**; không tạo phiếu; `THIET_BI_THUOC_KHACH_KHAC` (hoặc mã tương đương) | _(điền status + error code)_ | | `docs/screenshots/TC-10.png` |
| TC-11 · TB | Tái lập (C5) | `.env` + DB sạch hoặc SQLite | Chạy `npm run seed` **hai lần** liên tiếp | Lần 2 không lỗi UNIQUE; không nhân đôi phiếu mẫu | _(ghi số phiếu BH-000001 vẫn 1)_ | | `docs/screenshots/TC-11.png` |
| TC-12 · TB | Tái lập | — | Chạy `npm test` **hai lần** liên tiếp | Cả hai lần: 5 pass, 0 fail | _(chụp terminal lần 2)_ | | `docs/screenshots/TC-12.png` |

**Đủ năm loại:** luồng đúng (TC-01,02) · biên (TC-03–05) · dữ liệu sai (TC-06,07) · bảo mật/chất lượng (TC-08–10) · tái lập (TC-11,12).

**Ảnh tổng hợp npm test:** `docs/screenshots/npm-test.png`
