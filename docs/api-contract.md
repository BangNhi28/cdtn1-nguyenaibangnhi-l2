# API Contract — Smart CRM, luồng L2

Hợp đồng này khớp ERD và `docs/schema.sql`. `{id}` là `ticket.ticket_id` kiểu `BIGINT`. Mã hiển thị là `ticket_code`. Hạn cam kết là `due_date`.

Định dạng trao đổi: JSON. Thời gian kiểu `DATETIME`, ví dụ `2026-10-18T09:00:00`.

| Mã trạng thái lưu trong `ticket.status` | Nhãn |
|---|---|
| `MOI_TIEP_NHAN` | Mới tiếp nhận |
| `DA_PHAN_LOAI` | Đã phân loại |
| `DA_XAC_DINH_UU_TIEN` | Đã xác định ưu tiên |

| Mã `priority` | Nhãn | `due_date` theo QT-04 |
|---|---|---|
| `CAO` | Cao | 24 giờ làm việc |
| `TRUNG_BINH` | Trung bình | 72 giờ làm việc |
| `THAP` | Thấp | 120 giờ làm việc |

Ngày làm việc là thứ Hai đến thứ Bảy. `due_date` để trống cho đến khi gọi API xác định ưu tiên.

## Danh sách endpoint

| # | Endpoint | Mô tả | Quy tắc | Truy vết |
|---|---|---|---|---|
| 1 | `GET /api/customers?phone={sdt}` | Tra cứu khách hàng theo số điện thoại đã chuẩn hóa | QT-01, QT-02, QT-15 | US1, UC1 |
| 2 | `POST /api/tickets` | Ghi nhận phiếu bảo hành mới | QT-02, QT-03, QT-05 | US2, UC2 |
| 3 | `PUT /api/tickets/{id}/phan-loai` | Gán `category_id`, chuyển trạng thái đã phân loại | QT-06 | US3, UC3 |
| 4 | `PUT /api/tickets/{id}/uu-tien` | Gán `priority` và tính `due_date` | QT-04 | US4, UC4, US5 |
| 5 | `GET /api/tickets/{id}` | Xem chi tiết phiếu, gồm `due_date` | QT-15 | US5, UC5 |
| 6 | `GET /api/tickets?qua_han=true` | Danh sách phiếu, lọc phiếu sắp hoặc đã quá `due_date` | QT-04 | US6, UC6 |
| 7 | `GET /api/tickets/{id}/status-log` | Đọc `ticket_status_log` của phiếu | QT-06 | US7, UC7 |

Ngoài phạm vi: `PUT /api/tickets/{id}/xac-minh-bao-hanh` và `GET /api/bao-cao/theo-nhom-su-co`. QT-05 ghi bước phê duyệt của quản lý nằm ngoài phạm vi. Báo cáo nằm ngoài phạm vi kiến trúc.

## 1. GET /api/customers?phone={sdt}

Tra cứu khách theo số điện thoại. Số được chuẩn hóa về `0xxxxxxxxx` trước khi tìm. Số đã tồn tại thì trả hồ sơ cũ, không tạo khách mới.

QT-15: vai trò khác Quản lý trung tâm nhận `phone` dạng che, ví dụ `090****567`.

**200**

```json
{
  "customer_id": 12,
  "full_name": "Nguyen Van A",
  "phone": "090****567",
  "address": "Quan 10, TP.HCM",
  "segment": "THUONG_XUYEN",
  "devices": [
    {
      "device_id": 34,
      "product_name": "Dien thoai X",
      "serial_no": "IMEI123456",
      "purchase_date": "2025-01-15",
      "warranty_months": 12
    }
  ]
}
```

**404** khi không có khách với số đã chuẩn hóa.

## 2. POST /api/tickets

Tạo phiếu mới. Trạng thái lưu `MOI_TIEP_NHAN`. `category_id`, `priority` và `due_date` để trống. Hệ thống sinh `ticket_code`.

`is_warranty` tính theo QT-05: còn bảo hành khi (ngày tiếp nhận − `purchase_date`) không vượt `warranty_months`. Không có `purchase_date` thì `is_warranty` là `false` (chưa xác minh). Không có API phê duyệt riêng.

**Body**

```json
{
  "phone": "0901234567",
  "full_name": "Nguyen Van A",
  "address": "Quan 10, TP.HCM",
  "product_name": "Dien thoai X",
  "serial_no": "IMEI123456",
  "purchase_date": "2025-01-15",
  "warranty_months": 12,
  "issue_desc": "Man hinh khong len nguon",
  "note": null
}
```

**201**

```json
{
  "ticket_id": 987,
  "ticket_code": "BH000987/2026",
  "status": "MOI_TIEP_NHAN",
  "received_at": "2026-10-18T09:00:00",
  "is_warranty": true
}
```

**400** khi thiếu trường bắt buộc, `phone` sai định dạng, hoặc `issue_desc` ngoài 10–500 ký tự. `serial_no` đã thuộc khách khác thì từ chối theo QT-03.

## 3. PUT /api/tickets/{id}/phan-loai

Chỉ phiếu đang `MOI_TIEP_NHAN` mới được phân loại. Gán `category_id`, chuyển `status` sang `DA_PHAN_LOAI`, thêm một dòng `ticket_status_log`.

**Body**

```json
{
  "category_id": 1
}
```

**200**

```json
{
  "ticket_id": 987,
  "category_id": 1,
  "status": "DA_PHAN_LOAI"
}
```

**400** khi phiếu chưa tồn tại hoặc `category_id` không có trong `issue_category`.

## 4. PUT /api/tickets/{id}/uu-tien

Chỉ phiếu đang `DA_PHAN_LOAI` mới được xác định ưu tiên. Gán `priority`, tính `due_date` từ `received_at` theo QT-04, chuyển `status` sang `DA_XAC_DINH_UU_TIEN`, thêm một dòng `ticket_status_log`.

**Body**

```json
{
  "priority": "CAO"
}
```

**200**

```json
{
  "ticket_id": 987,
  "priority": "CAO",
  "due_date": "2026-10-19T09:00:00",
  "status": "DA_XAC_DINH_UU_TIEN"
}
```

**400** khi `priority` trống hoặc khác `CAO`, `TRUNG_BINH`, `THAP`.

## 5. GET /api/tickets/{id}

Xem một phiếu. `due_date` có thể `null` nếu chưa gọi API xác định ưu tiên. Số điện thoại che theo QT-15.

**200**

```json
{
  "ticket_id": 987,
  "ticket_code": "BH000987/2026",
  "customer_id": 12,
  "device_id": 34,
  "category_id": 1,
  "issue_desc": "Man hinh khong len nguon",
  "priority": "CAO",
  "status": "DA_XAC_DINH_UU_TIEN",
  "received_at": "2026-10-18T09:00:00",
  "due_date": "2026-10-19T09:00:00",
  "closed_at": null,
  "is_warranty": true
}
```

**404** khi không có `ticket_id`.

## 6. GET /api/tickets

Danh sách phiếu. Không có query thì trả mọi phiếu. `qua_han=true` chỉ trả phiếu có `due_date` đã đến hoặc sắp đến.

**200**

```json
{
  "data": [
    {
      "ticket_id": 987,
      "ticket_code": "BH000987/2026",
      "full_name": "Nguyen Van A",
      "product_name": "Dien thoai X",
      "category_name": "MAN_HINH",
      "priority": "CAO",
      "status": "DA_XAC_DINH_UU_TIEN",
      "due_date": "2026-10-19T09:00:00"
    }
  ]
}
```

## 7. GET /api/tickets/{id}/status-log

Đọc bảng `ticket_status_log`, sắp theo `changed_at`.

**200**

```json
{
  "ticket_id": 987,
  "data": [
    {
      "log_id": 1,
      "from_status": null,
      "to_status": "MOI_TIEP_NHAN",
      "changed_at": "2026-10-18T09:00:00",
      "changed_by": 5,
      "note": null
    },
    {
      "log_id": 2,
      "from_status": "MOI_TIEP_NHAN",
      "to_status": "DA_PHAN_LOAI",
      "changed_at": "2026-10-18T09:10:00",
      "changed_by": 5,
      "note": null
    }
  ]
}
```

## Validation

| Trường | Bắt buộc | Kiểu | Ràng buộc |
|---|---|---|---|
| `phone` | Có | `VARCHAR(20)` | 10 số, dạng `0xxxxxxxxx`, chuẩn hóa QT-02, duy nhất trong `customer` |
| `full_name` | Có | `VARCHAR(120)` | 2–120 ký tự |
| `address` | Không | `VARCHAR(255)` | Tối đa 255 ký tự |
| `product_name` | Có | `VARCHAR(120)` | 2–120 ký tự |
| `serial_no` | Có | `VARCHAR(50)` | 8–50 ký tự, chữ/số/`-_ .`, chuẩn hóa in hoa, UNIQUE (QT-03); serial thuộc khách khác → 409 |
| `purchase_date` | Không | `DATE` | Đúng định dạng, không ở tương lai |
| `warranty_months` | Không | `SMALLINT` | 1–120, mặc định 12 (QT-05) |
| `issue_desc` | Có | `TEXT` | 10–500 ký tự |
| `category_id` | Có khi phân loại | `INT` | Khóa ngoại tới `issue_category.category_id`; NULL trước khi phân loại |
| `priority` | Có khi xác định ưu tiên | `VARCHAR(10)` | `CAO`, `TRUNG_BINH` hoặc `THAP`; NULL trước bước này |
