# Checklist bảo mật — Smart CRM L2 (BT3 / buổi 15)

**Sinh viên:** Nguyễn Ái Băng Nhi · MSSV 2374802010368  
**Phiên bản:** v1.0 prototype · **Cập nhật:** 09/11/2026

Theo tài liệu buổi 15: mỗi mục ghi **ĐÃ LÀM** / **CHƯA LÀM** / **KHÔNG ÁP DỤNG** + minh chứng (file, lệnh, test).

| # | Hạng mục (bắt buộc BT3) | Trạng thái | Minh chứng |
|---|---------------------------|------------|------------|
| 1 | Không có secret trong repo (mật khẩu, chuỗi kết nối, token) | **ĐÃ LÀM** | `.gitignore` có `.env`; `.env.example` chỉ placeholder; `npm test` / CI không cần `MYSQL_PASSWORD` |
| 2 | Dữ liệu vào được kiểm tra ở tầng ứng dụng | **ĐÃ LÀM** | `tests/ticket-invalid.test.js`, `validateCreateTicket`; 400 + `fields` — chạy `npm test` |
| 3 | Kiểm soát truy cập theo vai trò | **ĐÃ LÀM** | `tests/auth-security.test.js`: 401 không token, 403 `ql1` POST tạo phiếu; QT-15 `tests/qt15-mask.test.js` |
| 4 | Mật khẩu băm, không lưu plaintext | **ĐÃ LÀM** | `src/utils/password.js` SHA-256 + salt; `app_user.password_hash` trong seed |
| 5 | Thông báo lỗi không lộ stack / SQL | **ĐÃ LÀM** | Handler `src/app.js`: `AppError` → JSON; lỗi 500 chỉ `LOI_HE_THONG` (không `err.stack` ra client) |
| 6 | Nhật ký không ghi mật khẩu/token | **ĐÃ LÀM** | `console.error("[LOI_HE_THONG]", err)` — không log body login; token chỉ trong header Bearer (không query string) |
| 7 | Phụ thuộc ghim phiên bản, kiểm CVE cơ bản | **ĐÃ LÀM** | `package-lock.json`; `engines.node >= 22`; `.github/workflows/ci.yml` chạy `npm ci` + `npm test` |

**OWASP Top 10:2025 (mức nhận biết — buổi 15):** prototype localhost chưa HTTPS thật; đã ghi kế hoạch TLS trong `docs/deployment-guide.md` §5. Kiểm soát truy cập và validation tương ứng A01/A07 ở mức đồ án.

**Hạn chế (ghi trung thực, không trừ điểm nếu không ghi “đã làm” giả):**

| Hạng mục | Trạng thái |
|----------|------------|
| HTTPS / HSTS production | **CHƯA LÀM** (chỉ ghi hướng dẫn proxy TLS) |
| JWT / refresh rotation | **KHÔNG ÁP DỤNG** — dùng Bearer session in-memory cho prototype; biết chuyển JWT khi triển khai thật (`docs/api-docs/API.md`) |
| Rate-limit đăng nhập | **CHƯA LÀM** |
| CORS whitelist đầy đủ | **ĐÃ LÀM** có điều kiện — chỉ bật khi set `CORS_ORIGINS` (`src/middleware/cors.js`); UI cùng origin port 3001 không bắt buộc CORS |

**Lệnh tự kiểm tra (minh chứng nhanh):**

```bash
npm test
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/tickets
```

Kết quả mong đợi: **18 tests pass**; curl in **401**.
