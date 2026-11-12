# BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

Cập nhật cho **Bài tập 3** — kiểm thử, bug log, Docker và tài liệu triển khai (10/11/2026).

| Công cụ | Dùng vào việc gì | Áp dụng ở tệp / hàm nào | Em đã kiểm chứng thế nào |
|---|---|---|---|
| Cursor (AI trong IDE) | Gợi ý cách viết test tự động cho luồng đúng, giá trị biên bảo hành và dữ liệu sai. | `tests/ticket-happy.test.js`, `tests/ticket-boundary.test.js`, `tests/ticket-invalid.test.js` | Tự chạy từng test bằng `node --test --test-name-pattern=...` (ảnh 7.2–7.6), đọc lại từng `assert`; kiểm tra ngày biên bằng cách thay đổi dữ liệu để xác nhận test FAIL. |
| Cursor | Gợi ý test kiểm soát truy cập (401/403) và che số điện thoại theo vai trò. | `tests/auth-security.test.js`, hàm che SĐT (QT-15). | Gọi API bằng PowerShell với token `nv1` và `ql1`, đối chiếu kết quả (ảnh 7.9, 7.10). |
| Cursor | Soạn `Dockerfile`, `docker-compose.yml` và cấu hình healthcheck. | `Dockerfile`, `docker-compose.yml`, `.env.example` | Chạy `docker compose up -d --build`, kiểm tra `docker compose ps` và `/api/health`; thực hiện phép thử máy trắng từ thư mục trống. |
| Cursor | Tìm nguyên nhân BUG-01 (lỗi `due_date` bị lệch giờ UTC). | `src/utils/datetime.js`, `sla.js` | Tự tái lập lỗi bằng cách so sánh `received_at` và `due_date`; sau khi sửa, chạy lại `npm test` với kết quả đủ 18 test PASS. |
| Cursor | Soạn bản nháp tài liệu. | `docs/deployment-guide.md`, `docs/api-docs/API.md`, `docs/checklist-bao-mat.md` | Đối chiếu từng endpoint và từng lệnh với hệ thống đang chạy; loại bỏ những mục hệ thống chưa triển khai. |
| Claude (Anthropic) | Rà soát báo cáo theo đề BT3, gợi ý đặt caption ảnh và thông điệp commit. | Nội dung file PDF/Word, lịch sử commit. | Tự đọc lại từng gợi ý, đối chiếu với đề bài và repository; chỉ giữ lại những nội dung phù hợp với sản phẩm. |

Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp.  
Họ tên: Nguyễn Ái Băng Nhi  
MSSV: 2374802010368  
Ngày: 12/11/2026
