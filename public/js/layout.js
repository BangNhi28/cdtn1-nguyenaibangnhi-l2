const STATUS_LABELS = {
  MOI_TIEP_NHAN: "Mới tiếp nhận",
  DA_PHAN_LOAI: "Đã phân loại",
  DA_XAC_DINH_UU_TIEN: "Đã xác định ưu tiên"
};

const STATUS_TONE = {
  MOI_TIEP_NHAN: "blue",
  DA_PHAN_LOAI: "warning",
  DA_XAC_DINH_UU_TIEN: "success"
};

const PRIORITY_LABELS = {
  CAO: "Cao",
  TRUNG_BINH: "Trung bình",
  THAP: "Thấp"
};

const PRIORITY_TONE = {
  CAO: "danger",
  TRUNG_BINH: "warning",
  THAP: "neutral"
};

const SLA_HOURS = {
  CAO: 24,
  TRUNG_BINH: 72,
  THAP: 120
};

function parseDueDate(value) {
  return new Date(String(value).replace(" ", "T"));
}

function formatDueCountdown(dueDate, nowIso) {
  const due = parseDueDate(dueDate);
  const now = nowIso ? parseDueDate(nowIso) : new Date();
  const diffMs = due.getTime() - now.getTime();
  if (diffMs <= 0) {
    const overdueMs = -diffMs;
    const h = Math.floor(overdueMs / 3600000);
    const m = Math.floor((overdueMs % 3600000) / 60000);
    if (h > 0) {
      return "Quá hạn " + h + " giờ " + m + " phút";
    }
    return "Quá hạn " + m + " phút";
  }
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  if (h > 0) {
    return "Còn " + h + " giờ " + m + " phút đến hạn cam kết";
  }
  return "Còn " + m + " phút đến hạn cam kết";
}

function formatDueDeadlineLabel(dueDate) {
  const due = parseDueDate(dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const dayDiff = Math.round((startOfDue - startOfToday) / 86400000);
  const hh = String(due.getHours()).padStart(2, "0");
  const mm = String(due.getMinutes()).padStart(2, "0");
  const timeStr = hh + ":" + mm;
  let dayLabel;
  if (dayDiff === 0) {
    dayLabel = "Hôm nay";
  } else if (dayDiff === 1) {
    dayLabel = "Ngày mai";
  } else if (dayDiff === -1) {
    dayLabel = "Hôm qua";
  } else {
    dayLabel =
      String(due.getDate()).padStart(2, "0") +
      "/" +
      String(due.getMonth() + 1).padStart(2, "0") +
      "/" +
      due.getFullYear();
  }
  return dayLabel + ", " + timeStr;
}

function formatSlaSubline(dueDate, priority) {
  const label = (PRIORITY_LABELS[priority] || priority || "—").toLowerCase();
  const hours = SLA_HOURS[priority] || "—";
  return "Hạn xử lý: " + formatDueDeadlineLabel(dueDate) + " - Ưu tiên " + label + " (" + hours + " giờ)";
}

/** Màn chi tiết: safe (> ngưỡng) | warning (≤ ngưỡng giờ) | danger (quá hạn). Ngưỡng mặc định 24 giờ. */
function slaBannerTone(dueDate, warningHours, nowIso) {
  const windowHours = warningHours == null ? 24 : warningHours;
  if (!dueDate) {
    return "none";
  }
  const due = parseDueDate(dueDate);
  const now = nowIso ? parseDueDate(nowIso) : new Date();
  if (due <= now) {
    return "danger";
  }
  const hours = (due - now) / 3600000;
  return hours <= windowHours ? "warning" : "safe";
}

function applySlaBanner(ticket, options) {
  const alertEl = options && options.element;
  if (!alertEl) {
    return;
  }
  const titleEl = options.titleEl;
  const subEl = options.subEl;
  const badgeEl = options.badgeEl;

  alertEl.classList.remove("hidden", "is-safe", "is-warning", "is-danger");

  if (!ticket.due_date || !ticket.priority) {
    if (ticket.status === "MOI_TIEP_NHAN") {
      alertEl.classList.add("is-safe");
      if (titleEl) {
        titleEl.textContent = "Phiếu mới tiếp nhận";
      }
      if (subEl) {
        subEl.textContent = "Chưa xác định ưu tiên — chưa có hạn cam kết";
      }
      if (badgeEl) {
        badgeEl.innerHTML = '<span class="status-pill success">Mới tiếp nhận</span>';
      }
      return;
    }
    alertEl.classList.add("hidden");
    return;
  }

  const tone = slaBannerTone(ticket.due_date, options.warningHours);
  alertEl.classList.add(
    tone === "danger" ? "is-danger" : tone === "warning" ? "is-warning" : "is-safe"
  );

  if (titleEl) {
    titleEl.textContent =
      tone === "danger"
        ? formatDueCountdown(ticket.due_date) + " — cần xử lý ngay"
        : formatDueCountdown(ticket.due_date);
  }
  if (subEl) {
    subEl.textContent = formatSlaSubline(ticket.due_date, ticket.priority);
  }
  if (badgeEl) {
    let badgeText = "Trong hạn";
    let badgeClass = "success";
    if (tone === "danger") {
      badgeText = "Đã quá hạn";
      badgeClass = "danger";
    } else if (tone === "warning") {
      badgeText = "Sắp đến hạn";
      badgeClass = "warning";
    } else if (ticket.status === "MOI_TIEP_NHAN") {
      badgeText = "Mới tiếp nhận";
    }
    badgeEl.innerHTML = '<span class="status-pill ' + badgeClass + '">' + badgeText + "</span>";
  }
}

function initialsFromName(name) {
  const parts = String(name || "NV").trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role) {
  return role === "QUAN_LY" ? "Quản lý trung tâm" : "Nhân viên tiếp nhận";
}

function isManager() {
  const user = Api.user();
  return Boolean(user && user.role === "QUAN_LY");
}

function isStaff() {
  const user = Api.user();
  return Boolean(user && user.role === "NHAN_VIEN");
}

function applyRoleUi() {
  const manager = isManager();
  document.querySelectorAll("[data-staff-only]").forEach(function (el) {
    el.classList.toggle("hidden", manager);
  });
  document.querySelectorAll("[data-manager-only]").forEach(function (el) {
    el.classList.toggle("hidden", !manager);
  });
}

function requireStaffPage() {
  requireLogin();
  if (isManager()) {
    window.location.href = "/tickets.html";
  }
}

function statusLabel(code) {
  if (!code) {
    return "";
  }
  return STATUS_LABELS[code] || code;
}

function formatTodayLabel() {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return days[d.getDay()] + ", " + dd + "/" + mm + "/" + d.getFullYear();
}

function statusPill(status) {
  const label = STATUS_LABELS[status] || status;
  const tone = STATUS_TONE[status] || "neutral";
  return '<span class="status-pill ' + tone + '">' + label + "</span>";
}

function priorityPill(priority) {
  if (!priority) {
    return '<span class="status-pill neutral">—</span>';
  }
  const label = PRIORITY_LABELS[priority] || priority;
  const tone = PRIORITY_TONE[priority] || "neutral";
  return '<span class="status-pill ' + tone + '">' + label + "</span>";
}

/** Màu hạn cam kết (danh sách + lọc): safe | warning | danger | neutral — cùng ngưỡng 24h với banner chi tiết. */
function dueTone(dueDate, nowIso, status) {
  if (!dueDate) {
    return status === "MOI_TIEP_NHAN" ? "safe" : "neutral";
  }
  const tone = slaBannerTone(dueDate, 24, nowIso);
  return tone === "none" ? "neutral" : tone;
}

function initAppShell(activePage) {
  const user = Api.user();
  if (!user) {
    return;
  }
  document.querySelectorAll("[data-icon]").forEach(function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-icon-size") || 18));
  });
  const nameEl = document.getElementById("profileName");
  const roleEl = document.getElementById("profileRole");
  const avatarEl = document.getElementById("profileAvatar");
  const rolePillEl = document.getElementById("rolePillLabel");
  const dateEl = document.getElementById("topDate");
  if (nameEl) {
    nameEl.textContent = user.full_name || user.username;
  }
  if (roleEl) {
    roleEl.textContent = roleLabel(user.role);
  }
  if (avatarEl) {
    avatarEl.textContent = initialsFromName(user.full_name || user.username);
  }
  if (rolePillEl) {
    rolePillEl.textContent = roleLabel(user.role);
  }
  if (dateEl) {
    dateEl.textContent = formatTodayLabel();
  }
  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.classList.toggle("active", el.getAttribute("data-nav") === activePage);
  });
  applyRoleUi();
}

function appShellHtml(activePage) {
  return (
    '<aside class="sidebar">' +
    '<a class="brand" href="/tickets.html" aria-label="Mekong Care">' +
    '<span class="brand-mark" data-icon="shield" data-icon-size="24"></span>' +
    '<span class="brand-text"><strong>MEKONG</strong><small>CARE</small></span></a>' +
    '<nav class="nav-stack" aria-label="Điều hướng">' +
    '<span class="nav-item"><span data-icon="home"></span><span>Tổng quan</span></span>' +
    '<a class="nav-item" data-nav="list" href="/tickets.html"><span data-icon="document"></span><span>Phiếu bảo hành</span></a>' +
    "</nav>" +
    '<div class="sidebar-foot">' +
    '<div class="support-box"><span class="support-icon" data-icon="headset" data-icon-size="20"></span>' +
    "<div><strong>Cần hỗ trợ?</strong><small>Liên hệ IT nội bộ</small></div></div>" +
    '<button type="button" class="profile" onclick="logout()" title="Đăng xuất">' +
    '<span class="avatar" id="profileAvatar">NV</span>' +
    '<div class="profile-copy"><strong id="profileName">Nhân viên</strong><small id="profileRole">Tiếp nhận</small></div>' +
    '<span data-icon="more"></span></button></div></aside>' +
    '<div class="app-body">' +
    '<header class="topbar">' +
    '<button type="button" class="mobile-menu" aria-label="Menu"><span data-icon="menu"></span></button>' +
    '<div class="top-context"><span class="online-dot"></span><span>TTBH Mekong Mobile</span></div>' +
    '<div class="top-actions">' +
    '<div class="role-pill"><span data-icon="user" data-icon-size="15"></span><span id="rolePillLabel">Nhân viên</span></div>' +
    '<span class="date-label" id="topDate"></span></div></header>' +
    '<main class="content" id="pageContent"></main></div>'
  );
}

function mountAppShell(activePage, innerHtml) {
  document.body.className = "app-page";
  document.body.innerHTML =
    '<div class="app-root">' +
    appShellHtml(activePage) +
    "</div>";
  document.getElementById("pageContent").innerHTML = innerHtml;
  initAppShell(activePage);
}
