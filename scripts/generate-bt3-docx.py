# -*- coding: utf-8 -*-
"""Generate BT3 Word report. Run: python scripts/generate-bt3-docx.py"""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, Cm
from docx.oxml.ns import qn

OUT = Path(r"D:\CĐTN1\BT3_2374802010368_NguyenAiBangNhi.docx")
REPO = "https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2"
TAG = "v1.0"


def set_cell_shading(cell, fill):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = tcPr.find(qn("w:shd"))
    if shd is None:
        from docx.oxml import OxmlElement

        shd = OxmlElement("w:shd")
        tcPr.append(shd)
    shd.set(qn("w:fill"), fill)


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    for run in p.runs:
        run.font.name = "Times New Roman"
        run._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    return p


def add_para(doc, text, bold=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(13)
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    run.bold = bold
    return p


def main():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2)

    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(13)
    style._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    # --- TRANG BÌA ---
    for _ in range(2):
        doc.add_paragraph()
    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = t.add_run("TRƯỜNG ĐẠI HỌC VĂN LANG\nKHOA CÔNG NGHỆ THÔNG TIN")
    r.bold = True
    r.font.size = Pt(14)
    r.font.name = "Times New Roman"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    doc.add_paragraph()
    t2 = doc.add_paragraph()
    t2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r2 = t2.add_run(
        "CHUYÊN ĐỀ TỐT NGHIỆP 1 — HK1 NĂM HỌC 2026–2027\n\n"
        "BÀI TẬP 3\n"
        "KIỂM THỬ VÀ ĐÓNG GÓI PROTOTYPE\n\n"
        "Case study: Smart CRM — Mekong Mobile\n"
        "Luồng nghiệp vụ: L2 (Tiếp nhận và phân loại phiếu bảo hành)\n"
        "Track: Công nghệ phần mềm (SE)"
    )
    r2.bold = True
    r2.font.size = Pt(14)
    r2.font.name = "Times New Roman"
    r2._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    doc.add_paragraph()
    t3 = doc.add_paragraph()
    t3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r3 = t3.add_run(
        "Sinh viên: Nguyễn Ái Băng Nhi\n"
        "MSSV: 2374802010368\n"
        "Lớp: (điền mã lớp nếu GV yêu cầu)\n"
        "Ngày nộp: 09/11/2026"
    )
    r3.font.size = Pt(13)
    r3.font.name = "Times New Roman"
    r3._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    doc.add_paragraph()
    t4 = doc.add_paragraph()
    t4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r4 = t4.add_run(
        f"GitHub (PUBLIC): {REPO}\n"
        f"Tag bài nộp: {TAG}"
    )
    r4.bold = True
    r4.font.size = Pt(12)
    r4.font.name = "Times New Roman"
    r4._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    doc.add_page_break()

    # --- MỤC 1 ---
    add_heading(doc, "Mục 1. Test Plan (rút gọn)", 1)
    add_para(
        doc,
        "Hệ thống: prototype L2 — tiếp nhận, tạo phiếu bảo hành, phân loại, xác định ưu tiên/SLA; "
        "đăng nhập Bearer hai vai trò Nhân viên tiếp nhận (nv1) và Quản lý (ql1).",
    )
    add_para(doc, "Phạm vi kiểm thử:", bold=True)
    for line in [
        "API: login, tra cứu khách, CRUD phiếu (tạo, phân loại, ưu tiên), danh sách/chi tiết, serial-check, health.",
        "Quy tắc: QT-02 (SĐT), QT-03 (serial), QT-04 (SLA), QT-05 (bảo hành), QT-06 (vòng đời + log), QT-13 (soft delete), QT-15 (che SĐT).",
        "UI: login, danh sách phiếu, tạo phiếu (wizard), chi tiết phiếu.",
    ]:
        doc.add_paragraph(line, style="List Bullet")

    add_para(doc, "Ngoài phạm vi: L4 sửa chữa, kho, SMS; load test; pentest chuyên sâu.", bold=False)
    add_para(doc, "Loại test và mục tiêu:", bold=True)
    rows = [
        ("Luồng đúng", "2–3 TC", "Đăng nhập, tạo phiếu, xem danh sách"),
        ("Giá trị biên", "≥2", "Ngày cuối/bắt đầu hết BH; độ dài issue_desc"),
        ("Dữ liệu sai", "≥2", "Thiếu trường, SĐT/serial không hợp lệ"),
        ("Bảo mật / DL", "≥2", "401, 403, che SĐT, serial khách khác"),
        ("Tái lập", "≥2", "seed 2 lần; npm test 2 lần"),
    ]
    tbl = doc.add_table(rows=1 + len(rows), cols=3)
    tbl.style = "Table Grid"
    hdr = tbl.rows[0].cells
    for i, h in enumerate(["Loại", "Số lượng", "Cách thực hiện"]):
        hdr[i].text = h
        set_cell_shading(hdr[i], "D9E2F3")
    for i, row in enumerate(rows, 1):
        for j, val in enumerate(row):
            tbl.rows[i].cells[j].text = val

    add_para(
        doc,
        "Tự động hóa: 18 test / 11 suite (npm test) — SQLite :memory:, bổ sung sau nhận xét BT2. "
        "Tiêu chí: 18 pass; 201 tạo phiếu; 400/401/409 đúng mã; mỗi TC tay có ảnh minh chứng.",
    )

    doc.add_page_break()

    # --- MỤC 2 Test Report 8 cột ---
    add_heading(doc, "Mục 2. Test Report (12 test case)", 1)
    add_para(doc, "Bảng 12 TC, 8 cột theo đề BT3. Kết quả chạy thật ngày 09/11/2026.", bold=False)

    cols = [
        "Mã · Ưu tiên",
        "Loại",
        "Tiền điều kiện",
        "Các bước",
        "Kết quả mong đợi",
        "Kết quả thực tế",
        "K/L",
        "Ảnh",
    ]
    cases = [
        (
            "TC-01 · Cao",
            "Luồng đúng",
            "DB :memory:; token nv1",
            "npm test → suite tạo phiếu còn BH",
            "201; MOI_TIEP_NHAN; is_warranty true",
            "Pass; 201; ticket_code BH-…/năm",
            "PASS",
            "TC-01.png",
        ),
        (
            "TC-02 · Cao",
            "Luồng đúng",
            "Server + seed",
            "POST login nv1; GET /api/tickets",
            "200; có BH-000001/2026",
            "200; có phiếu seed",
            "PASS",
            "TC-02.png",
        ),
        (
            "TC-03 · Cao",
            "Biên QT-05",
            "—",
            "Test ngày cuối còn BH",
            "isUnderWarranty = true",
            "Pass ticket-boundary.test.js",
            "PASS",
            "TC-03.png",
        ),
        (
            "TC-04 · Cao",
            "Biên QT-05",
            "—",
            "Test ngày sau hết BH",
            "isUnderWarranty = false",
            "Pass ticket-boundary.test.js",
            "PASS",
            "TC-04.png",
        ),
        (
            "TC-05 · TB",
            "Biên",
            "Token nv1",
            "POST issue_desc 9 ký tự",
            "400; fields có issue_desc",
            "400 DU_LIEU_KHONG_HOP_LE",
            "PASS",
            "TC-05.png",
        ),
        (
            "TC-06 · Cao",
            "Dữ liệu sai",
            "Token nv1",
            "POST thiếu issue_desc",
            "400; fields issue_desc",
            "Pass auto test",
            "PASS",
            "TC-06.png",
        ),
        (
            "TC-07 · TB",
            "Dữ liệu sai",
            "Token nv1",
            "POST phone = 123",
            "400 phone",
            "400; fields có phone",
            "PASS",
            "TC-07.png",
        ),
        (
            "TC-08 · Cao",
            "Bảo mật",
            "App đang chạy",
            "GET /api/tickets không Authorization",
            "401",
            "401 CHUA_DANG_NHAP",
            "PASS",
            "TC-08.png",
        ),
        (
            "TC-09 · Cao",
            "Bảo mật QT-15",
            "nv1 + ql1",
            "GET cùng /api/tickets/:id",
            "nv che SĐT; ql đủ số",
            "090****567 vs 0901234567",
            "PASS",
            "TC-09.png",
        ),
        (
            "TC-10 · Cao",
            "Chất lượng QT-03",
            "Serial khách A",
            "POST serial trùng, SĐT khách B",
            "409 THIET_BI_THUOC_KHACH_KHAC",
            "409 đúng mã",
            "PASS",
            "TC-10.png",
        ),
        (
            "TC-11 · TB",
            "Tái lập",
            "SQLite local",
            "npm run seed 2 lần",
            "Lần 2 không UNIQUE",
            "Exit 0 (Docker/SQLite; bỏ MYSQL_PASSWORD khi cần)",
            "PASS",
            "TC-11.png",
        ),
        (
            "TC-12 · TB",
            "Tái lập",
            "—",
            "npm test 2 lần",
            "Cùng số pass",
            "18 pass, 11 suites × 2",
            "PASS",
            "TC-12.png",
        ),
    ]
    t2 = doc.add_table(rows=1 + len(cases), cols=8)
    t2.style = "Table Grid"
    for j, c in enumerate(cols):
        t2.rows[0].cells[j].text = c
        set_cell_shading(t2.rows[0].cells[j], "D9E2F3")
    for i, case in enumerate(cases, 1):
        for j, val in enumerate(case):
            cell = t2.rows[i].cells[j]
            cell.text = val
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9)

    add_para(doc, "Tổng hợp: 12 TC chạy thật — PASS 12 / FAIL 0. Ảnh đặt trong docs/screenshots/ và chèn Mục 7.")

    doc.add_page_break()

    # --- MỤC 3 Bug log ---
    add_heading(doc, "Mục 3. Bug Log (≥3 bug)", 1)
    bugs = [
        [
            ("Mã · mức độ", "BUG-01 · Major"),
            ("Phát hiện bởi", "Tự test SLA / TC-01,03"),
            ("Triệu chứng", "due_date lệch ~7h so với giờ tiếp nhận (UTC)"),
            ("Cách tái lập", "Tạo phiếu → ưu tiên Cao → so sánh received_at và due_date"),
            ("Nguyên nhân", "Dùng toISOString() lưu UTC"),
            ("Cách sửa", "formatLocalDateTime + SLA local (datetime.js, sla.js)"),
            ("Commit · xác nhận", f"{REPO}/commit/5a0b709 · npm test pass"),
        ],
        [
            ("Mã · mức độ", "BUG-02 · Major"),
            ("Phát hiện bởi", "Tự test UI ticket-new"),
            ("Triệu chứng", "Lỗi validation không hiện đúng từng ô"),
            ("Cách tái lập", "Bước 2 wizard: để trống tên thiết bị hoặc mô tả <10 ký tự"),
            ("Nguyên nhân", "ticket-new.js gom lỗi một chỗ"),
            ("Cách sửa", "Lỗi dưới field; banner bảo hành"),
            ("Commit · xác nhận", f"{REPO}/commit/33ef3e0"),
        ],
        [
            ("Mã · mức độ", "BUG-03 · Major"),
            ("Phát hiện bởi", "Đối chiếu README BT2"),
            ("Triệu chứng", "README port 3000 nhưng app 3001"),
            ("Cách tái lập", "Mở localhost:3000 → refused"),
            ("Nguyên nhân", "README lệch PORT mặc định"),
            ("Cách sửa", "Cập nhật README, .env.example, curl"),
            ("Commit · xác nhận", f"{REPO}/commit/17ab783"),
        ],
    ]
    for bi, bug in enumerate(bugs, 1):
        add_heading(doc, f"BUG-0{bi}", 2)
        bt = doc.add_table(rows=len(bug), cols=2)
        bt.style = "Table Grid"
        for ri, (k, v) in enumerate(bug):
            bt.rows[ri].cells[0].text = k
            bt.rows[ri].cells[1].text = v
            set_cell_shading(bt.rows[ri].cells[0], "F2F2F2")

    doc.add_page_break()

    # --- MỤC 4 Deployment Guide (tóm tắt EN + VI) ---
    add_heading(doc, "Mục 4. Deployment Guide (tóm tắt)", 1)
    add_para(doc, "Bản đầy đủ tiếng Anh trong repo: docs/deployment-guide.md", bold=True)
    sections4 = [
        "1. Prerequisites: Docker 24+, Git, port 3001; không commit .env.",
        "2. Quick start (2 commands): copy .env.example .env → docker compose up -d --build.",
        "3. Health & smoke: GET /api/health → {ok:true}; login nv1; GET /api/tickets without token → 401; UI login.html.",
        "4. CI: GitHub Actions npm ci && npm test (18 pass).",
        "5. Production notes: TLS reverse proxy, TRUST_PROXY=1; optional CORS_ORIGINS; tag v1.0 sau nộp.",
    ]
    for s in sections4:
        doc.add_paragraph(s, style="List Number")

    add_para(doc, "Cách kiểm tra hệ thống đã chạy đúng (Windows):", bold=True)
    doc.add_paragraph("copy .env.example .env", style="List Bullet")
    doc.add_paragraph("docker compose up -d --build", style="List Bullet")
    doc.add_paragraph("Mở http://localhost:3001 → đăng nhập nv1/123456 → thấy BH-000001/2026", style="List Bullet")

    doc.add_page_break()

    # --- MỤC 5 Checklist ---
    add_heading(doc, "Mục 5. Checklist bảo mật (7 mục — tự đánh giá)", 1)
    sec = [
        ("1", "Không secret trong repo", "ĐÃ LÀM", ".gitignore .env; .env.example placeholder"),
        ("2", "Validation tầng ứng dụng", "ĐÃ LÀM", "tests/ticket-invalid; 400 + fields"),
        ("3", "Kiểm soát truy cập", "ĐÃ LÀM", "401/403 auth-security.test; QT-15 mask"),
        ("4", "Mật khẩu băm", "ĐÃ LÀM", "password.js SHA-256 + salt"),
        ("5", "Lỗi không lộ stack", "ĐÃ LÀM", "AppError JSON; 500 LOI_HE_THONG"),
        ("6", "Log không ghi token/pass", "ĐÃ LÀM", "Bearer header; không query token"),
        ("7", "Ghim dependency", "ĐÃ LÀM", "package-lock.json; CI npm ci"),
    ]
    ct = doc.add_table(rows=1 + len(sec), cols=4)
    ct.style = "Table Grid"
    for j, h in enumerate(["#", "Hạng mục", "Trạng thái", "Minh chứng"]):
        ct.rows[0].cells[j].text = h
        set_cell_shading(ct.rows[0].cells[j], "D9E2F3")
    for i, row in enumerate(sec, 1):
        for j, val in enumerate(row):
            ct.rows[i].cells[j].text = val

    add_para(
        doc,
        "Ghi trung thực bổ sung: HTTPS production — CHƯA LÀM (có hướng dẫn proxy); "
        "JWT — KHÔNG ÁP DỤNG (session prototype); rate-limit — CHƯA LÀM.",
    )

    doc.add_page_break()

    # --- MỤC 6 API docs SE ---
    add_heading(doc, "Mục 6. Tài liệu kỹ thuật track SE — API Reference (tóm tắt)", 1)
    add_para(doc, "Chi tiết: docs/api-docs/API.md · Base URL: http://localhost:3001 · JSON · Bearer token", bold=False)
    api_rows = [
        ("POST /api/login", "Không auth", "200 token + role; 401 sai mật khẩu"),
        ("GET /api/health", "Public", "200 {ok, db}"),
        ("GET /api/customers?phone=", "Auth", "200 hồ sơ + devices; QT-02, QT-15 mask"),
        ("POST /api/tickets", "Auth nhân viên", "201 tạo phiếu; 400/409"),
        ("GET /api/tickets", "Auth", "Danh sách + meta; qua_han=true"),
        ("GET /api/tickets/{id}", "Auth", "Chi tiết; che SĐT theo role"),
        ("PUT …/phan-loai", "Nhân viên", "QT-06 → DA_PHAN_LOAI"),
        ("PUT …/uu-tien", "Nhân viên", "QT-04 due_date"),
        ("GET …/status-log", "Auth", "Lịch sử trạng thái"),
        ("GET …/serial-check", "Nhân viên", "Kiểm tra serial trước tạo"),
        ("GET /api/issue-categories", "Auth", "Danh mục nhóm sự cố"),
    ]
    at = doc.add_table(rows=1 + len(api_rows), cols=3)
    at.style = "Table Grid"
    for j, h in enumerate(["Endpoint", "Auth", "Ghi chú"]):
        at.rows[0].cells[j].text = h
        set_cell_shading(at.rows[0].cells[j], "D9E2F3")
    for i, row in enumerate(api_rows, 1):
        for j, val in enumerate(row):
            at.rows[i].cells[j].text = val

    doc.add_page_break()

    # --- MỤC 7 Screenshots ---
    add_heading(doc, "Mục 7. Ảnh minh chứng", 1)
    add_para(
        doc,
        "Chèn ảnh chụp từ thư mục docs/screenshots/ (và thư mục local trước khi xuất PDF):",
    )
    for name in [
        "npm-test.png — kết quả npm test (18 pass)",
        "TC-01.png … TC-12.png — từng test case",
        "Ảnh UI đăng nhập + danh sách phiếu BH-000001 (tùy chọn)",
        "Phép thử máy trắng: docker compose up + curl /api/health (tùy chọn)",
    ]:
        doc.add_paragraph(name, style="List Bullet")
    p = doc.add_paragraph()
    r = p.add_run(
        "[Chèn ảnh tại đây: Insert → Pictures — hoặc kéo thả file PNG vào các dòng trống phía dưới]"
    )
    r.italic = True
    for _ in range(3):
        doc.add_paragraph("(Khoảng trống chèn ảnh …)")

    doc.add_page_break()

    # --- PHỤ LỤC AI ---
    add_heading(doc, "Phụ lục. Bảng khai báo sử dụng công cụ AI", 1)
    ai = [
        ("Cursor", "Soạn test, Docker, docs BT3", "docs/*, tests/*, Dockerfile", "Chạy npm test; đối chiếu đề BT3/buổi 15"),
        ("Claude", "BT1 SRS khung", "docs/srs.md", "Đối chiếu case study"),
        ("ChatGPT", "BT1 rà ERD/API", "docs/schema.sql", "Tự chỉnh cột"),
        ("Figma AI", "Wireframe", "SRS mục 5", "Chỉnh khớp ERD"),
        ("Stitch", "Mẫu màn hình", "SRS", "Rà nghiệp vụ"),
    ]
    ait = doc.add_table(rows=1 + len(ai), cols=4)
    ait.style = "Table Grid"
    for j, h in enumerate(["Công cụ", "Dùng vào việc gì", "Tệp / vùng", "Kiểm chứng"]):
        ait.rows[0].cells[j].text = h
        set_cell_shading(ait.rows[0].cells[j], "D9E2F3")
    for i, row in enumerate(ai, 1):
        for j, val in enumerate(row):
            ait.rows[i].cells[j].text = val

    doc.add_paragraph()
    add_para(
        doc,
        "Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp.\n"
        "Họ tên: Nguyễn Ái Băng Nhi — MSSV: 2374802010368 — Ngày: 09/11/2026",
        bold=True,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print("Saved:", str(OUT))


if __name__ == "__main__":
    main()
