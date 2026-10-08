
# BÁO CÁO BÀI TẬP 1
## MÔN: CHUYÊN NGÀNH TỐT NGHIỆP 1

**Trường:** Trường Đại học Văn Lang  
**Khoa:** Công nghệ Thông tin

**Đề tài:** Hệ thống Smart CRM – Mekong Mobile  
**Phân hệ:** L2 — Tiếp nhận và xử lý yêu cầu bảo hành

- **Track:** Công nghệ phần mềm (SE)
- **Lớp:** 261_71ITGR40203_06
- **Link GitHub repo:** [Dán link repository tại đây]
- **Sinh viên thực hiện:** Nguyễn Ái Băng Nhi – 2374802010368
- **Giảng viên hướng dẫn:** TS. Nguyễn Trí Hải

---

## LỊCH SỬ THAY ĐỔI (VERSION HISTORY)

| Phiên bản | Ngày | Nội dung thay đổi | Người thực hiện |
|---|---|---|---|
| 1.0 | 08/10/2026 | Cập nhật tài liệu SRS; xác định phạm vi hệ thống, yêu cầu nghiệp vụ, yêu cầu chức năng và phi chức năng; xây dựng bảng truy vết, mô hình kiến trúc, ERD và wireframe giao diện. | Nguyễn Ái Băng Nhi |

---

# MỤC 1 — BẢN SRS RÚT GỌN

## 1.1. Giới thiệu và phạm vi

### Bối cảnh

Mekong Mobile là chuỗi 24 cửa hàng và 6 trung tâm bảo hành tại TP.HCM, Cần Thơ và Hà Nội, với khoảng 260 yêu cầu bảo hành mỗi tháng. Hiện tại, yêu cầu bảo hành được ghi tay nên khó theo dõi yêu cầu đang ở bước nào, ai đang xử lý và đã quá hạn cam kết hay chưa.

### Luồng nghiệp vụ được chọn

L2 — Tiếp nhận và xử lý yêu cầu bảo hành (Service Desk).

### Phạm vi

Nhân viên tiếp nhận ghi nhận, phân loại và xác định mức ưu tiên cho yêu cầu bảo hành; quản lý trung tâm theo dõi trạng thái, hạn cam kết và lịch sử xử lý.

### Chủ ý KHÔNG làm (WON'T)

- Quản lý tồn kho linh kiện thay thế.
- Bán hàng, khuyến mãi.
- Báo cáo doanh thu theo cửa hàng.
- Gửi thông báo tự động qua SMS/Zalo cho khách hàng (ngoài phạm vi prototype).

### Bảng thuật ngữ

| Thuật ngữ | Giải nghĩa |
|---|---|
| Yêu cầu bảo hành | Một phiếu ghi nhận lỗi/sự cố của khách hàng cần xử lý, có mã, trạng thái và hạn cam kết. |
| Trạng thái | Mới tiếp nhận → Đã phân loại → Đã xác định ưu tiên. |
| Hạn cam kết (SLA) | Thời điểm trễ nhất phải hoàn tất yêu cầu, tính từ lúc tiếp nhận, phụ thuộc mức ưu tiên. |
| Nhóm sự cố | Phân loại loại lỗi: Phần cứng / Phần mềm / Khác. |

## 1.2. Các bên liên quan và vai trò người dùng

| Vai trò | Được làm | Không được làm |
|---|---|---|
| Nhân viên tiếp nhận | Ghi nhận yêu cầu mới, phân loại và xác định ưu tiên, tra cứu yêu cầu. | Gán kỹ thuật viên, cập nhật trạng thái xử lý kỹ thuật. |
| Quản lý trung tâm | Xem danh sách yêu cầu bảo hành, xem danh sách quá hạn, xem lịch sử thay đổi trạng thái. | Trực tiếp chỉnh sửa nội dung kỹ thuật của yêu cầu. |

## 1.3. Yêu cầu chức năng (FR) và User Story

### Danh sách yêu cầu chức năng

| Mã | Yêu cầu chức năng | User Story | MoSCoW |
|---|---|---|---|
| FR1 | Tra cứu khách hàng theo số điện thoại | US1 | SHOULD |
| FR2 | Ghi nhận yêu cầu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) | US2 | MUST |
| FR3 | Phân loại yêu cầu theo nhóm sự cố | US3 | MUST |
| FR4 | Xác định mức độ ưu tiên của yêu cầu | US4 | MUST |
| FR5 | Xem hạn cam kết của yêu cầu bảo hành | US5 | SHOULD |
| FR6 | Xem danh sách yêu cầu bảo hành và trạng thái xử lý | US6 | SHOULD |
| FR7 | Xem danh sách yêu cầu sắp/đã quá hạn cam kết | US7 | COULD |
| FR8 | Xem lịch sử thay đổi trạng thái của yêu cầu | US8 | COULD |

### US1 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng theo số điện thoại để nhanh chóng xác định thông tin khách hàng khi tiếp nhận yêu cầu bảo hành.

### US2 [MUST]

Là nhân viên tiếp nhận, tôi muốn ghi nhận yêu cầu bảo hành mới (khách hàng, sản phẩm, mô tả lỗi) để bắt đầu quy trình xử lý.

- **AC1:** Given đã đăng nhập, When nhập đủ thông tin và nhấn Lưu, Then hệ thống tạo yêu cầu mới, trạng thái "Mới tiếp nhận".
- **AC2 (ngoại lệ):** Given bỏ trống trường bắt buộc, When nhấn Lưu, Then hệ thống báo lỗi, không tạo yêu cầu.

### US3 [MUST]

Là nhân viên tiếp nhận, tôi muốn phân loại yêu cầu theo nhóm sự cố để xác định loại vấn đề cần xử lý.

- **AC1:** Given yêu cầu ở trạng thái "Mới tiếp nhận", When chọn nhóm sự cố, Then trạng thái chuyển "Đã phân loại".
- **AC2 (ngoại lệ):** Given yêu cầu chưa được ghi nhận, When cố phân loại, Then hệ thống từ chối thao tác.

### US4 [MUST]

Là nhân viên tiếp nhận, tôi muốn xác định mức độ ưu tiên của yêu cầu để đảm bảo xử lý theo mức độ cần thiết.

- **AC1:** Given yêu cầu đã phân loại, When chọn mức ưu tiên (Thấp/Trung bình/Cao), Then hệ thống lưu và tính hạn cam kết tương ứng.
- **AC2 (ngoại lệ):** Given mức ưu tiên để trống hoặc không hợp lệ, When lưu, Then hệ thống báo lỗi yêu cầu chọn lại.

### US5 [SHOULD]

Là nhân viên tiếp nhận, tôi muốn xem hạn cam kết của yêu cầu bảo hành sau khi tiếp nhận để biết thời hạn xử lý và cung cấp thông tin cho khách hàng.

### US6 [SHOULD]

Là quản lý trung tâm, tôi muốn xem danh sách các yêu cầu bảo hành và trạng thái xử lý để theo dõi tình hình xử lý tại trung tâm.

### US7 [COULD]

Là quản lý trung tâm, tôi muốn xem danh sách các yêu cầu sắp hoặc đã quá hạn cam kết để can thiệp kịp thời.

### US8 [COULD]

Là quản lý trung tâm, tôi muốn xem lịch sử thay đổi trạng thái của yêu cầu bảo hành để theo dõi quá trình xử lý và kiểm tra tiến độ.

## 1.4. Yêu cầu phi chức năng (NFR)

| Mã | Mô tả | Ngưỡng |
|---|---|---|
| NFR1 | Thời gian phản hồi API tra cứu/tạo yêu cầu | ≤ 3 giây |
| NFR2 | Thời gian lưu trữ dữ liệu yêu cầu | Tối thiểu 2 năm |
| NFR3 | Tỉ lệ sẵn sàng hệ thống | ≥ 98% |

## 1.5. Ràng buộc và quy tắc nghiệp vụ

- **R1:** Yêu cầu bảo hành sau khi được tạo phải được phân loại theo nhóm sự cố trước khi xác định mức ưu tiên.
- **R2:** Chỉ yêu cầu đã được phân loại mới được xác định mức ưu tiên (Thấp / Trung bình / Cao) và tính hạn cam kết tương ứng.
- **R3:** Hạn cam kết (SLA) được tính dựa trên mức ưu tiên: Cao: 24 giờ, Trung bình: 48 giờ, Thấp: 72 giờ, tính từ thời điểm tiếp nhận yêu cầu.
- **R4:** Yêu cầu ở trạng thái “Đã xác định ưu tiên” hoặc các trạng thái sau đó không được quay ngược về trạng thái trước nếu không có thao tác hợp lệ theo quy trình nghiệp vụ.
- **R5:** Mỗi lần thay đổi trạng thái của yêu cầu phải được ghi nhận vào lịch sử, bao gồm trạng thái cũ, trạng thái mới, thời gian thay đổi và người thực hiện, phục vụ việc truy vết và kiểm tra tiến độ.

## 1.6. Bảng truy vết yêu cầu

| FR | User Story | Use Case | MoSCoW |
|---|---|---|---|
| FR1 | US1 | UC1 | SHOULD |
| FR2 | US2 | UC2 | MUST |
| FR3 | US3 | UC3 | MUST |
| FR4 | US4 | UC4 | MUST |
| FR5 | US5 | UC5 | SHOULD |
| FR6 | US6 | UC6 | SHOULD |
| FR7 | US7 | UC7 | COULD |
| FR8 | US8 | UC8 | COULD |

---

# MỤC 2 — USE CASE

## 2.1. Use Case Diagram

**Actor (2):**
- Nhân viên tiếp nhận.
- Quản lý trung tâm.

**Use Case (8):**
- UC1: Tra cứu khách hàng.
- UC2: Ghi nhận yêu cầu mới.
- UC3: Phân loại yêu cầu.
- UC4: Xác định mức ưu tiên.
- UC5: Xem hạn cam kết.
- UC6: Xem danh sách và trạng thái.
- UC7: Xem danh sách quá hạn.
- UC8: Xem lịch sử thay đổi trạng thái.

## 2.2. Đặc tả Use Case chính

**Điều kiện trước:** Nhân viên tiếp nhận đã đăng nhập.

**Điều kiện sau:** Yêu cầu mới được tạo với mã tự động, sẵn sàng để phân loại (UC3).

### Luồng chính

1. Nhân viên tiếp nhận chọn "Tạo yêu cầu mới".
2. Hệ thống hiển thị form nhập thông tin.
3. Nhân viên nhập số điện thoại khách hàng — hệ thống tự động điền thông tin nếu khách đã tồn tại (liên quan UC1).
4. Nhân viên nhập sản phẩm và mô tả lỗi.
5. Nhân viên nhấn Lưu.
6. Hệ thống kiểm tra hợp lệ, tạo mã yêu cầu, lưu trạng thái "Mới tiếp nhận".
7. Hệ thống hiển thị xác nhận thành công.

### Luồng ngoại lệ

- **5a.** Thiếu trường bắt buộc → hệ thống báo lỗi, giữ nguyên form, quay lại bước 4.
- **6a.** Số điện thoại không đúng định dạng → hệ thống báo lỗi định dạng, quay lại bước 3.

---

# MỤC 3 — THIẾT KẾ KIẾN TRÚC

## 3.1. Sơ đồ kiến trúc phân lớp (Layered Architecture) cho luồng L2

**Chú thích:** Mũi tên là hướng phụ thuộc một chiều. Presentation gọi Business qua HTTP/JSON; Business gọi Repository qua interface; Repository dùng SQL để đọc/ghi CSDL. Lớp dưới không gọi ngược lớp trên.

<!-- Nếu muốn hiển thị sơ đồ, hãy xuất ảnh kiến trúc vào thư mục ảnh của repository rồi thêm:
![Sơ đồ kiến trúc phân lớp](images/architecture.png)
-->

## 3.2. Ba câu lập luận

1. Vì NFR1 yêu cầu thời gian phản hồi API tra cứu/tạo yêu cầu ≤ 3 giây, tôi chọn kiến trúc phân lớp và tách truy cập dữ liệu vào Repository để các truy vấn được tập trung, có thể tối ưu/index mà không sửa lớp giao diện; đánh đổi là phải đi qua thêm một lớp trung gian nên mã nguồn có nhiều thành phần hơn.

2. Vì NFR2 yêu cầu lưu trữ dữ liệu yêu cầu tối thiểu 2 năm, tôi chọn mô hình dữ liệu quan hệ và tách lịch sử trạng thái thành `ticket_status_log` thay vì ghi đè trạng thái; đánh đổi là phát sinh thêm bản ghi và cần JOIN khi xem lịch sử, nhưng đổi lại dữ liệu truy vết rõ ràng và hạn chế dư thừa.

3. Vì NFR3 yêu cầu tỉ lệ sẵn sàng hệ thống ≥ 98%, tôi tách Presentation, Business và Data Access để giới hạn phạm vi ảnh hưởng khi thay đổi/sửa lỗi một thành phần và giữ lớp nghiệp vụ độc lập với công nghệ lưu trữ; đánh đổi là tăng chi phí thiết kế và kiểm thử giữa các lớp.

---

# MỤC 4 — MÔ HÌNH DỮ LIỆU (TRACK SE)

ERD gồm 5 bảng, mỗi bảng có khóa chính, 4 quan hệ khóa ngoại, không có bảng cô lập.

<!-- Nếu muốn hiển thị ERD, hãy xuất ảnh ERD vào thư mục ảnh của repository rồi thêm:
![ERD hệ thống SMART CRM – Mekong Mobile](images/erd.png)
-->

## 4.1. Customers

```json
{
  "_id": "ObjectId",
  "full_name": "Nguyen Van A",
  "phone": "0901234567",
  "email": "a@example.com",
  "address": "...",
  "segment": "THUONG_XUYEN",
  "created_at": "ISODate"
}
```

- `phone`: unique index, đã chuẩn hóa theo QT-02.

## 4.2. Devices

```json
{
  "_id": "ObjectId",
  "customer_id": "ObjectId",
  "product_name": "Dien thoai X",
  "serial_no": "IMEI123456",
  "purchase_date": "ISODate",
  "warranty_months": 12
}
```

- `customer_id`: tham chiếu `customers._id`.
- `serial_no`: unique index theo QT-03.
- `purchase_date`: có thể null.

## 4.3. Issue Categories

```json
{
  "_id": "ObjectId",
  "category_name": "MAN_HINH",
  "default_priority": "TRUNG_BINH",
  "is_active": true
}
```

## 4.4. Tickets (nhúng status_log)

```json
{
  "_id": "ObjectId",
  "ticket_code": "BH000987/2026",
  "customer_id": "ObjectId",
  "device_id": "ObjectId",
  "center_id": "ObjectId",
  "issue_desc": "Man hinh khong len nguon",
  "category_id": "ObjectId",
  "priority": "CAO",
  "status": "MOI",
  "received_at": "ISODate",
  "due_date": "ISODate",
  "closed_at": null,
  "is_warranty": true,
  "warranty_verified": false,
  "status_log": [
    {
      "from_status": null,
      "to_status": "MOI",
      "changed_at": "ISODate",
      "changed_by": "NV001"
    }
  ]
}
```

- `ticket_code`: unique index.
- `customer_id`: tham chiếu `customers`.
- `device_id`: tham chiếu `devices`.
- `category_id`: tham chiếu `issue_categories`, có thể null trước khi phân loại.
- `due_date`: tính theo QT-04.
- `warranty_verified`: theo QT-05.

## 4.5. Chỉ mục (Index) và ràng buộc

- `customers.phone` — unique index (QT-01).
- `devices.serial_no` — unique index (QT-03).
- `tickets.ticket_code` — unique index.
- `tickets.customer_id`, `tickets.device_id`, `tickets.category_id` — index thường, đóng vai trò tương đương khóa ngoại (không ràng buộc toàn vẹn tham chiếu ở tầng CSDL như SQL; phải tự kiểm tra ở Service Layer).
- Không có collection cô lập: mọi collection đều được một collection khác tham chiếu tới (`customers` ← `devices`, `tickets`; `devices` ← `tickets`; `issue_categories` ← `tickets`).

## 4.6. API Contract — đúng thuật ngữ case study

Các thuật ngữ sử dụng: `ticket`, `customer`, `device`, `issue_category`.

| # | Endpoint | Mô tả | Quy tắc áp dụng |
|---|---|---|---|
| 1 | `GET /api/customers?phone={sdt}` | Tra cứu khách hàng theo SĐT đã chuẩn hóa | QT-01, QT-02, QT-15 |
| 2 | `POST /api/tickets` | Ghi nhận phiếu bảo hành mới (tạo/liên kết customer, device, issue_desc) | QT-02, QT-03, QT-05 |
| 3 | `PUT /api/tickets/{id}/phan-loai` | Gán `category_id` và `priority`, tự tính `due_date` | QT-04 |
| 4 | `PUT /api/tickets/{id}/xac-minh-bao-hanh` | Quản lý phê duyệt khi không xác minh được ngày mua | QT-05 |
| 5 | `GET /api/tickets/{id}` | Xem chi tiết phiếu | QT-15 |
| 6 | `GET /api/tickets?status=qua_han` | Danh sách phiếu sắp/đã quá `due_date` | QT-06 |
| 7 | `GET /api/tickets/{id}/status-log` | Xem lịch sử chuyển trạng thái của phiếu | QT-06 |
| 8 | `GET /api/bao-cao/theo-nhom-su-co` | Báo cáo số lượng phiếu theo `category_id` | — |

### Response mẫu — POST /api/tickets

```json
{
  "ticket_id": "671f...",
  "ticket_code": "BH000987/2026",
  "status": "MOI",
  "received_at": "2026-10-09T09:00:00Z",
  "warranty_verified": false
}
```

## 4.7. Bảng quy tắc Validation

| Trường | Bắt buộc | Kiểu | Ràng buộc |
|---|---|---|---|
| `phone` | Có | string | 10 số, chuẩn hóa dạng `0xxxxxxxxx` (QT-02) |
| `issue_desc` | Có | string | 10–500 ký tự |
| `category_id` | Có khi phân loại | ObjectId ref | Tồn tại trong collection `issue_categories` |
| `priority` | Có khi phân loại | enum | `CAO` / `TRUNG_BINH` / `THAP` |
| `serial_no` | Có nếu thiết bị mới | string | Duy nhất trong collection `devices` (QT-03) |

---

# MỤC 5 — WIREFRAME 3 MÀN HÌNH

Có 3 màn hình:

1. Danh sách yêu cầu bảo hành — UC5, UC6.
2. Tạo yêu cầu mới — UC1, UC2.
3. Chi tiết yêu cầu — UC3, UC4.

Mọi trường hiển thị đều tồn tại trong mô hình dữ liệu ở Mục 4; nhãn dùng đúng bảng thuật ngữ ở Mục 1.

<!-- Có thể chèn ảnh wireframe tại đây sau khi xuất ảnh từ công cụ thiết kế.
Ví dụ:
![Wireframe danh sách yêu cầu bảo hành](images/wireframe-list.png)
-->

## 5.1. Màn hình 1 — Danh sách yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Use Case liên quan |
|---|---|---|---|
| 1 | Ô tìm kiếm | Tra cứu yêu cầu bảo hành theo thông tin phù hợp | UC6 |
| 2 | Mã yêu cầu | Mã định danh của phiếu bảo hành | UC6 |
| 3 | Khách hàng | Hiển thị thông tin khách hàng của yêu cầu | UC6 |
| 4 | Thiết bị | Hiển thị thiết bị liên quan đến yêu cầu | UC6 |
| 5 | Nhóm sự cố | Hiển thị nhóm sự cố đã phân loại | UC6 |
| 6 | Mức ưu tiên | Hiển thị mức ưu tiên: Cao / Trung bình / Thấp | UC6 |
| 7 | Trạng thái | Hiển thị trạng thái hiện tại của yêu cầu | UC6 |
| 8 | Hạn cam kết | Hiển thị thời hạn SLA của yêu cầu | UC5 |
| 9 | Danh sách quá hạn | Cho phép nhận biết các yêu cầu đã hoặc sắp quá hạn | UC7 |

## 5.2. Màn hình 2 — Tạo yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Dữ liệu liên quan |
|---|---|---|---|
| 1 | Số điện thoại khách hàng | Nhập số điện thoại để tra cứu khách hàng | `customer.phone` |
| 2 | Họ tên khách hàng | Hiển thị thông tin khách hàng sau khi tra cứu | `customer.full_name` |
| 3 | Thông tin thiết bị | Chọn/nhập thiết bị của khách hàng | `device` |
| 4 | Mô tả sự cố | Nhập nội dung lỗi hoặc vấn đề của thiết bị | `ticket.issue_desc` |
| 5 | Nhóm sự cố | Phân loại yêu cầu theo nhóm sự cố | `issue_category.category_id` |
| 6 | Mức ưu tiên | Chọn mức ưu tiên cho yêu cầu | `ticket.priority` |
| 7 | Nút Lưu/Tạo yêu cầu | Tạo phiếu bảo hành mới | `ticket` |
| 8 | Thông báo lỗi | Thông báo khi thiếu dữ liệu hoặc dữ liệu không hợp lệ | UC2 / UC3 / UC4 |

## 5.3. Màn hình 3 — Chi tiết yêu cầu bảo hành

| STT | Thành phần trên màn hình | Ý nghĩa | Dữ liệu liên quan |
|---|---|---|---|
| 1 | Mã yêu cầu | Xác định phiếu bảo hành đang xem | `ticket.ticket_id` |
| 2 | Thông tin khách hàng | Hiển thị khách hàng của yêu cầu | `customer` |
| 3 | Thông tin thiết bị | Hiển thị thiết bị liên quan | `device` |
| 4 | Mô tả sự cố | Hiển thị nội dung lỗi đã ghi nhận | `ticket.issue_desc` |
| 5 | Nhóm sự cố | Hiển thị nhóm sự cố của yêu cầu | `ticket.category_id` |
| 6 | Mức ưu tiên | Hiển thị mức ưu tiên hiện tại | `ticket.priority` |
| 7 | Hạn cam kết (SLA) | Hiển thị thời hạn phải hoàn tất yêu cầu | `ticket.sla_due_date` |
| 8 | Trạng thái hiện tại | Cho biết yêu cầu đang ở trạng thái nào | `ticket.status` |
| 9 | Lịch sử trạng thái | Hiển thị các lần thay đổi trạng thái | `ticket_status_log` |
| 10 | Thời gian cập nhật | Hiển thị thời điểm thay đổi trạng thái | `ticket_status_log.changed_at` |

---

# PHỤ LỤC — BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
|---|---|---|---|
| Claude (Anthropic) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API Contract. | Mục 1–6 SRS; Thành phần 2, 3, 4, 5. | Tự đọc lại toàn bộ, đối chiếu bối cảnh case study và phạm vi đã duyệt buổi 2; tự kiểm tra bảng truy vết không ô trống; tự chỉnh sơ đồ theo quy ước đã học. |
| ChatGPT (OpenAI) | Hỗ trợ soạn khung SRS, bảng truy vết, sơ đồ Use Case/kiến trúc/ERD nháp, gợi ý API Contract; rà soát tính nhất quán giữa các phần. | Rà soát Mục 1–6 SRS; tập trung Mục 3 (kiến trúc), Mục 4 (mô hình dữ liệu), Mục 5 (wireframe). | Tự kiểm tra các nội dung được gợi ý; đối chiếu ERD với mô hình dữ liệu và phạm vi đề tài; tự quyết định và chỉnh sửa nội dung cuối cùng trước khi đưa vào báo cáo. |
| Figma AI | Hỗ trợ gợi ý bố cục giao diện và tham khảo thiết kế wireframe cho các màn hình tiếp nhận, tạo mới và xem chi tiết phiếu bảo hành. | Mục 5 — Wireframe giao diện. | Tự kiểm tra các nội dung được gợi ý, đối chiếu với yêu cầu đề tài và tự chỉnh sửa trước khi đưa vào báo cáo. |
| Stitch | Hỗ trợ tạo mẫu giao diện và gợi ý cách sắp xếp các thành phần trên màn hình tiếp nhận, tạo mới và xem chi tiết phiếu bảo hành. | Mục 5 — Wireframe giao diện. | Tự rà soát mẫu giao diện, đối chiếu yêu cầu nghiệp vụ và chỉnh sửa trước khi đưa vào báo cáo. |

---

**Kết thúc tài liệu SRS.**