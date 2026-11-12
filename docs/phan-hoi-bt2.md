# Phản hồi nhận xét Bài tập 2

**Sinh viên:** Nguyễn Ái Băng Nhi · MSSV 2374802010368  
**Ngày:** 09/11/2026

## Nhận xét giảng viên (tóm tắt)

- **Điểm mạnh:** Kiến trúc 3 lớp, CRUD, Bearer 2 vai trò, QT-02/04/05/06/13/15, test SQLite in-memory, UI + API client 3 trạng thái.
- **Cần khắc phục:** Bộ test còn mỏng (5 test); bổ sung test quy tắc khác; một số commit trùng thông điệp.
- **Mục kiểm chứng 4.2:** Đạt đủ mục chung và theo track SE.

## Hành động đã làm (BT3 / sau buổi 15)

| Yêu cầu | Cách khắc phục | Minh chứng |
|---------|----------------|------------|
| Test mỏng | Mở rộng `tests/*.test.js`: **18** ca tự động, **11** suite | `npm test` — phủ QT-02, 03, 06, 13, 15, QT-04/05 (SLA + biên BH), auth 401/403 |
| Quy tắc khác | File riêng theo QT: `phone-qt02`, `serial-qt03`, `qt06-lifecycle`, `qt13-soft-delete`, `qt15-mask`, `auth-security` | Liên kết test ↔ quy tắc trong `docs/test-plan.md` |
| Commit trùng message | Không sửa lịch sử cũ (tránh force); từ đây dùng quy ước `docs/git-commit-guide.md` | Commit BT3 tiếp theo: tiền tố rõ (`test:`, `docs:`, `fix:`) |

## Liên kết tài liệu buổi 15

- Checklist 7 mục: `docs/checklist-bao-mat.md` (ĐÃ LÀM / CHƯA / KHÔNG ÁP DỤNG + minh chứng).
- Deployment Guide (EN): `docs/deployment-guide.md` — HTTPS/CORS/auth notes.
- API reference (SE): `docs/api-docs/API.md`.
