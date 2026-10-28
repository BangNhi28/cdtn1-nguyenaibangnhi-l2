# BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

Cập nhật cho Bài tập 2 — hiện thực module cốt lõi L2.

| Công cụ | Dùng vào việc gì | Áp dụng ở tệp / hàm nào | Em đã kiểm chứng thế nào |
|---|---|---|---|
| Cursor | Gợi ý khung Express 3 lớp, SQLite schema, ba kiểm thử và ba màn hình. | `src/services/ticket.service.js`, `src/utils/warranty.js`, `src/utils/sla.js`, `tests/*`, `public/js/api.js` | Đọc từng hàm; đối chiếu QT-04, QT-05 với case study; chạy `npm test`; gọi tạo phiếu thiếu `issue_desc` phải ra 400. |
| Claude (Anthropic) | BT1: khung SRS, bảng truy vết, sơ đồ nháp. | `docs/srs.md` | Đối chiếu case study và phạm vi L2. |
| ChatGPT (OpenAI) | BT1: rà soát SRS, ERD, API. | `docs/srs.md`, `docs/schema.sql` | Tự chỉnh tên cột `due_date`, `ticket_code`. |
| Figma AI | BT1: gợi ý bố cục wireframe. | Mục 5 SRS | Tự chỉnh trường cho khớp ERD. |
| Stitch | BT1: mẫu màn hình. | Mục 5 SRS | Tự rà soát nghiệp vụ trước khi đưa vào báo cáo. |

Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp.  
Họ tên: Nguyễn Ái Băng Nhi  
MSSV: 2374802010368  
Ngày: 28/10/2026
