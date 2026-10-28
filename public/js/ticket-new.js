function addMonthsIso(isoDate, months) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const end = new Date(Date.UTC(y, m - 1 + months, d));
  return end.toISOString().slice(0, 10);
}

function isUnderWarrantyClient(purchaseDate, warrantyMonths) {
  if (!purchaseDate) {
    return null;
  }
  const today = new Date().toISOString().slice(0, 10);
  const end = addMonthsIso(String(purchaseDate).slice(0, 10), Number(warrantyMonths) || 12);
  return today <= end;
}

function formatIsoDateVn(iso) {
  if (!iso) {
    return "—";
  }
  const part = String(iso).slice(0, 10);
  return part.split("-").reverse().join("/");
}

function formatDuePreview(priority) {
  if (!priority) {
    return "—";
  }
  const hours = { CAO: 24, TRUNG_BINH: 72, THAP: 120 }[priority] || 72;
  const d = new Date();
  d.setHours(d.getHours() + hours);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return dd + "/" + d.getFullYear() + ", " + hh + ":" + mi + " — dự kiến";
}

/** Tránh popup Saved info / autofill của trình duyệt trên ô nhập tay. */
function blockBrowserSavedInfo(input) {
  if (!input || input.closest(".autofill-trap")) {
    return;
  }
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("data-lpignore", "true");
  input.setAttribute("data-form-type", "other");
  input.setAttribute("data-bwignore", "true");
  if (!input.getAttribute("autocomplete")) {
    input.setAttribute("autocomplete", "off");
  }
  input.setAttribute("readonly", "readonly");
  function unlock() {
    input.removeAttribute("readonly");
  }
  input.addEventListener("pointerdown", unlock);
  input.addEventListener("touchstart", unlock, { passive: true });
  input.addEventListener("focus", unlock);
  input.addEventListener("keydown", unlock);
}

function disableWizardAutofill() {
  const form = document.getElementById("ticketWizardForm");
  if (!form) {
    return;
  }
  form.setAttribute("autocomplete", "off");
  form.querySelectorAll("input, textarea, select").forEach(function (node) {
    blockBrowserSavedInfo(node);
  });
}

function initTicketNewWizard() {
  let step = 1;
  let customerVerified = false;
  let devices = [];
  let selectedDeviceIndex = null;
  /** @type {"none"|"existing"|"new"} */
  let deviceChoice = "new";
  let categories = [];
  let priority = null;
  let lastCreatePayload = null;
  let lastMeta = null;
  let serialConflict = false;
  let serialConflictField = "serial_no_taken";
  /** @type {"idle"|"checking"|"valid"|"invalid"} */
  let serialCheckStatus = "idle";
  let serialCheckTimer = null;
  let serialNetworkError = false;
  const NETWORK_MSG = "Vui lòng kiểm tra lại kết nối mạng.";
  let step1LookupDone = false;
  let step1ExistingCustomer = false;

  const STEP2_INLINE_MSG = {
    issue_desc: "issueDescMsg",
    issue_desc_max: "issueDescMsg",
    serial_no: "serialMsg",
    serial_no_taken: "serialMsg",
    serial_no_registered: "serialMsg",
    product_name_required: "productMsg",
    product_name: "productMsg",
    category_id: "step2FormMsg",
    priority: "step2FormMsg"
  };

  function el(id) {
    return document.getElementById(id);
  }

  function setPurchasePlaceValue(value) {
    const sel = el("purchase_place");
    if (!sel) {
      return;
    }
    const place = value || "";
    if (place && !Array.from(sel.options).some(function (o) {
      return o.value === place;
    })) {
      const opt = document.createElement("option");
      opt.value = place;
      opt.textContent = place;
      sel.appendChild(opt);
    }
    sel.value = place;
  }

  function applyDeviceRecordToForm(dev) {
    if (!dev) {
      return;
    }
    if (dev.serial_no) {
      el("serial_no").value = FieldRules.normalizeSerial(dev.serial_no);
    }
    el("product_name").value = dev.product_name || "";
    const pd = dev.purchase_date ? String(dev.purchase_date).slice(0, 10) : "";
    el("purchase_date").value = pd;
    setPurchasePlaceValue(dev.purchase_place || dev.note || "");
    el("warranty_months").value = String(dev.warranty_months || 12);
    refreshWarrantyBanner();
  }

  function isCustomerFieldsValid() {
    const phone = FieldRules.normalizePhone(el("phone").value);
    const name = el("full_name").value.trim();
    const addr = el("address").value.trim();
    if (!FieldRules.isValidPhone(phone)) {
      return false;
    }
    if (name.length < FieldRules.LIMITS.fullName.min || name.length > FieldRules.LIMITS.fullName.max) {
      return false;
    }
    if (addr.length > FieldRules.LIMITS.address.max) {
      return false;
    }
    return true;
  }

  function collectStep2FieldErrors() {
    const errors = [];
    const serial = FieldRules.normalizeSerial(el("serial_no").value);
    el("serial_no").value = serial;
    if (!FieldRules.isValidSerial(serial)) {
      errors.push("serial_no");
    }
    const product = el("product_name").value.trim();
    if (!product) {
      errors.push("product_name_required");
    } else if (
      product.length < FieldRules.LIMITS.productName.min ||
      product.length > FieldRules.LIMITS.productName.max
    ) {
      errors.push("product_name");
    }
    const issue = el("issue_desc").value.trim();
    if (issue.length < FieldRules.LIMITS.issueDesc.min) {
      errors.push("issue_desc");
    } else if (issue.length > FieldRules.LIMITS.issueDesc.max) {
      errors.push("issue_desc_max");
    }
    if (serialConflict) {
      errors.push(serialConflictField);
    } else if (
      FieldRules.isValidSerial(FieldRules.normalizeSerial(el("serial_no").value)) &&
      serialCheckStatus !== "valid"
    ) {
      errors.push("serial_no");
    }
    const purchase = FieldRules.validatePurchaseDate(el("purchase_date").value);
    if (!purchase.ok) {
      errors.push("purchase_date");
    }
    if (!el("category_id").value) {
      errors.push("category_id");
    }
    if (!priority) {
      errors.push("priority");
    }
    return errors;
  }

  function showFormError(message) {
    el("errorText").textContent = message;
    el("error").classList.remove("hidden");
  }

  function clearStep2InlineErrors() {
    ["issueDescMsg", "serialMsg", "productMsg", "step2FormMsg"].forEach(function (id) {
      const node = el(id);
      if (!node) {
        return;
      }
      node.textContent = "";
      node.classList.add("hidden");
    });
  }

  function showStep2InlineError(field, message) {
    clearStep2InlineErrors();
    el("error").classList.add("hidden");
    const msgId = STEP2_INLINE_MSG[field];
    if (msgId && el(msgId)) {
      el(msgId).textContent = message;
      el(msgId).classList.remove("hidden");
      return;
    }
    const compact = el("step2FormMsg");
    if (compact) {
      compact.textContent = message;
      compact.classList.remove("hidden");
      return;
    }
    showFormError(message);
  }

  function isSerialAllowedForExistingPick(serial) {
    if (deviceChoice !== "existing" || selectedDeviceIndex === null || !devices[selectedDeviceIndex]) {
      return false;
    }
    return FieldRules.normalizeSerial(devices[selectedDeviceIndex].serial_no) === serial;
  }

  function showSerialInlineError(fieldKey) {
    const serialNode = el("serialMsg");
    if (!serialNode) {
      return;
    }
    serialNode.textContent = FieldRules.messageForField(fieldKey);
    serialNode.classList.remove("hidden");
  }

  function connectivityFailed(err) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return true;
    }
    if (err && err.offline) {
      return true;
    }
    if (err && err.status >= 500) {
      return true;
    }
    return false;
  }

  function showStep2NetworkError() {
    serialNetworkError = true;
    clearStep2InlineErrors();
    if (typeof hideConnectionFault === "function") {
      hideConnectionFault();
    }
    showFormError(NETWORK_MSG);
    const banner = el("error");
    if (banner) {
      banner.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function clearStep2NetworkError() {
    serialNetworkError = false;
  }

  async function refreshSerialConflict() {
    serialConflict = false;
    serialConflictField = "serial_no_taken";
    const serialNode = el("serialMsg");
    if (serialNode) {
      serialNode.textContent = "";
      serialNode.classList.add("hidden");
    }
    const serial = FieldRules.normalizeSerial(el("serial_no").value);
    if (!FieldRules.isValidSerial(serial)) {
      serialCheckStatus = "idle";
      clearStep2NetworkError();
      updateChecklist();
      return;
    }
    if (!navigator.onLine) {
      serialCheckStatus = "idle";
      showStep2NetworkError();
      updateChecklist();
      return;
    }
    if (isSerialAllowedForExistingPick(serial)) {
      applyDeviceRecordToForm(devices[selectedDeviceIndex]);
      serialCheckStatus = "valid";
      clearStep2NetworkError();
      updateChecklist();
      return;
    }
    const phone = FieldRules.normalizePhone(el("phone").value);
    if (!FieldRules.isValidPhone(phone)) {
      serialCheckStatus = "idle";
      return;
    }
    const prevSerialStatus = serialCheckStatus;
    serialCheckStatus = "checking";
    updateChecklist();
    try {
      const result = await Api.serialCheck(phone, serial);
      if (result.status === "free") {
        serialCheckStatus = "valid";
        clearStep2NetworkError();
      } else if (result.status === "other_customer") {
        serialCheckStatus = "invalid";
        serialConflict = true;
        serialConflictField = "serial_no_taken";
        showSerialInlineError("serial_no_taken");
      } else if (result.status === "same_customer" && result.device) {
        applyDeviceRecordToForm(result.device);
        deviceChoice = "existing";
        serialCheckStatus = "valid";
        clearStep2NetworkError();
      } else {
        serialCheckStatus = "idle";
      }
    } catch (err) {
      if (connectivityFailed(err)) {
        serialCheckStatus = "idle";
        showStep2NetworkError();
        updateChecklist();
        return;
      }
      if (prevSerialStatus === "valid" && FieldRules.isValidSerial(serial)) {
        serialCheckStatus = "valid";
        clearStep2NetworkError();
      } else {
        serialCheckStatus = "idle";
      }
    }
    updateChecklist();
  }

  function scheduleSerialConflictCheck() {
    if (serialCheckTimer) {
      clearTimeout(serialCheckTimer);
    }
    serialCheckTimer = setTimeout(function () {
      serialCheckTimer = null;
      refreshSerialConflict();
    }, 350);
  }

  function showStep(n) {
    step = n;
    el("step1").classList.toggle("hidden", n !== 1);
    el("step2").classList.toggle("hidden", n !== 2);
    el("save").classList.toggle("hidden", n !== 2);
    updateStatusChip();
    updateSummary();
    if (n === 2) {
      loadCategoriesIfNeeded().then(function () {
        refreshWarrantyBanner();
        refreshSerialConflict();
        updateSummary();
      });
    }
  }

  function updateStatusChip() {
    const chip = el("statusChip");
    const label = el("statusChipLabel");
    const caption = el("statusChipCaption");
    if (!chip || !label) {
      return;
    }
    chip.classList.remove("ready");
    if (step === 1) {
      caption.textContent = "Phiếu trên hệ thống";
      label.textContent = "Chưa tạo · Bước 1/2";
      return;
    }
    caption.textContent = "Phiếu trên hệ thống";
    const ready = isCustomerFieldsValid() && collectStep2FieldErrors().length === 0;
    if (ready) {
      label.textContent = "Sẵn sàng lưu · Bước 2/2";
      chip.classList.add("ready");
    } else {
      label.textContent = "Chưa tạo · Bước 2/2";
    }
  }

  function updateChecklist() {
    const set = function (id, ok, pending) {
      const row = el(id);
      if (!row) {
        return;
      }
      row.classList.toggle("done", ok && !pending);
      row.classList.toggle("pending", pending);
    };
    const onStep2 = step === 2;
    set("chkCustomer", isCustomerFieldsValid(), false);
    set("chkSerial", onStep2 && serialCheckStatus === "valid", !onStep2);
    set("chkCategory", onStep2 && el("category_id").value !== "", !onStep2);
    set("chkDue", onStep2 && Boolean(priority), !onStep2);
    updateStatusChip();
  }

  function updateSummary() {
    if (step === 1) {
      el("summaryPriority").textContent = "—";
      el("summaryDue").textContent = "Chọn ở bước 2";
      el("summaryHours").textContent = "—";
      updateChecklist();
      return;
    }
    el("summaryPriority").innerHTML = priorityPill(priority);
    el("summaryDue").textContent = formatDuePreview(priority);
    el("summaryHours").textContent = !priority
      ? "—"
      : priority === "CAO"
        ? "24 giờ"
        : priority === "THAP"
          ? "120 giờ"
          : "72 giờ";
    updateChecklist();
  }

  function refreshWarrantyBanner() {
    const banner = el("warrantyBanner");
    const purchase = el("purchase_date").value;
    const months = Number(el("warranty_months").value) || 12;
    const status = isUnderWarrantyClient(purchase, months);
    banner.classList.remove("hidden", "warranty-banner--active", "warranty-banner--expired", "warranty-banner--unknown");
    if (status === null) {
      banner.classList.add("warranty-banner--unknown");
      banner.innerHTML =
        '<span><span data-icon="info" data-icon-size="18"></span></span><div><strong>Chưa xác định bảo hành</strong>' +
        "<p>Nhập <b>ngày mua</b> để hệ thống tính (mặc định " +
        months +
        " tháng kể từ ngày mua). Không có ngày mua thì phiếu ghi «Chưa xác định».</p></div>";
    } else if (status) {
      const end = addMonthsIso(purchase.slice(0, 10), months);
      banner.classList.add("warranty-banner--active");
      banner.innerHTML =
        '<span><span data-icon="shield" data-icon-size="18"></span></span><div><strong>Còn bảo hành</strong>' +
        "<p>Mua " +
        formatIsoDateVn(purchase) +
        " · " +
        months +
        " tháng · Hết hạn " +
        formatIsoDateVn(end) +
        ". Phiếu sẽ ghi «Còn bảo hành».</p></div>";
    } else {
      const end = addMonthsIso(purchase.slice(0, 10), months);
      banner.classList.add("warranty-banner--expired");
      banner.innerHTML =
        '<span><span data-icon="alert" data-icon-size="18"></span></span><div><strong>Đã hết hạn bảo hành</strong>' +
        "<p>Mua " +
        formatIsoDateVn(purchase) +
        " · Hết hạn " +
        formatIsoDateVn(end) +
        ". Phiếu sẽ ghi «Hết hạn bảo hành» / có tính phí.</p></div>";
    }
    document.querySelectorAll("#warrantyBanner [data-icon]").forEach(function (node) {
      node.innerHTML = icon(node.getAttribute("data-icon"), Number(node.getAttribute("data-icon-size") || 18));
    });
  }

  function clearDeviceFields() {
    el("serial_no").value = "";
    el("product_name").value = "";
    el("purchase_date").value = "";
    setPurchasePlaceValue("");
    el("warranty_months").value = "12";
    refreshWarrantyBanner();
  }

  function resetStep1LookupUi() {
    step1LookupDone = false;
    step1ExistingCustomer = false;
    customerVerified = false;
    devices = [];
    deviceChoice = "new";
    el("foundCard").classList.add("hidden");
    el("deviceList").classList.add("hidden");
    el("customerManualFields").classList.add("hidden");
    el("step1Actions").classList.add("hidden");
    el("full_name").value = "";
    el("address").value = "";
  }

  /** @param {"found"|"new"|"none"} mode */
  function applyStep1AfterLookup(mode) {
    if (mode === "none") {
      resetStep1LookupUi();
      return;
    }
    step1LookupDone = true;
    step1ExistingCustomer = mode === "found";
    el("step1Actions").classList.remove("hidden");
    if (mode === "found") {
      el("customerManualFields").classList.add("hidden");
    } else {
      el("full_name").value = "";
      el("address").value = "";
      el("customerManualFields").classList.remove("hidden");
    }
  }

  function renderDeviceList(list) {
    const box = el("deviceList");
    devices = list || [];
    selectedDeviceIndex = null;
    deviceChoice = devices.length ? "none" : "new";
    if (!devices.length) {
      clearDeviceFields();
      box.innerHTML = '<p class="field" style="font-weight:400;color:var(--muted)">Khách chưa có thiết bị — nhập thiết bị mới ở bước tiếp theo.</p>';
      box.classList.remove("hidden");
      return;
    }
    if (devices.length === 1) {
      selectedDeviceIndex = 0;
      deviceChoice = "existing";
      box.innerHTML =
        '<p class="field" style="font-weight:400;color:var(--muted)">Thiết bị: <strong>' +
        devices[0].product_name +
        "</strong> · Serial " +
        devices[0].serial_no +
        "</p>";
      box.classList.remove("hidden");
      return;
    }
    box.innerHTML =
      devices
        .map(function (d, i) {
          return (
            '<button type="button" class="device-pick-item" data-index="' +
            i +
            '"><strong>' +
            d.product_name +
            "</strong><small>Serial: " +
            d.serial_no +
            (d.purchase_date ? " · Mua " + d.purchase_date : "") +
            "</small></button>"
          );
        })
        .join("") +
      '<button type="button" class="device-pick-item device-pick-new" data-index="new">+ Thiết bị mới</button>';
    box.classList.remove("hidden");
    box.querySelectorAll(".device-pick-item").forEach(function (btn) {
      btn.onclick = function () {
        box.querySelectorAll(".device-pick-item").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        const idx = btn.getAttribute("data-index");
        if (idx === "new") {
          selectedDeviceIndex = null;
          deviceChoice = "new";
          clearDeviceFields();
          serialCheckStatus = "idle";
          scheduleSerialConflictCheck();
          return;
        }
        selectedDeviceIndex = Number(idx);
        deviceChoice = "existing";
        applyDeviceRecordToForm(devices[selectedDeviceIndex]);
        scheduleSerialConflictCheck();
      };
    });
  }

  async function lookup() {
    const msg = el("lookupMsg");
    const phoneNorm = FieldRules.normalizePhone(el("phone").value);
    if (!FieldRules.isValidPhone(phoneNorm)) {
      msg.textContent = FieldRules.messageForField("phone");
      msg.style.color = "var(--red)";
      return;
    }
    msg.textContent = "Đang tra cứu...";
    msg.style.color = "var(--muted)";
    resetStep1LookupUi();
    try {
      const data = await Api.customersByPhone(el("phone").value);
      el("full_name").value = data.full_name || "";
      el("address").value = data.address || "";
      el("foundName").textContent = data.full_name;
      el("foundPhone").textContent = data.phone;
      el("foundAvatar").textContent = initialsFromName(data.full_name);
      el("foundCard").classList.remove("hidden");
      customerVerified = true;
      renderDeviceList(data.devices || []);
      applyStep1AfterLookup("found");
      const devCount = (data.devices || []).length;
      if (devCount === 0) {
        msg.textContent = "Đã tìm thấy khách hàng. Nhập thiết bị ở bước 2.";
      } else if (devCount === 1) {
        msg.textContent = "Đã tìm thấy khách hàng. Thông tin thiết bị sẽ điền tự động ở bước 2.";
      } else {
        msg.textContent = "Đã tìm thấy khách hàng. Chọn thiết bị bên dưới rồi bấm Tiếp tục.";
      }
    } catch (err) {
      clearDeviceFields();
      if (err.status === 404) {
        applyStep1AfterLookup("new");
        msg.textContent = "Chưa có khách với số này — nhập họ tên, địa chỉ rồi bấm Tiếp tục.";
        msg.style.color = "var(--muted)";
      } else if (err.status === 400) {
        applyStep1AfterLookup("none");
        msg.textContent =
          err.message || "Số điện thoại phải đúng 10 chữ số, bắt đầu bằng 0.";
        msg.style.color = "var(--red)";
      } else if (err.offline || err.status >= 500 || !err.status) {
        applyStep1AfterLookup("none");
        msg.textContent = "";
        if (typeof connectionFaultFromError === "function") {
          connectionFaultFromError(err, { onRetry: lookup });
        } else {
          msg.textContent = NETWORK_MSG;
          msg.style.color = "var(--red)";
        }
      } else {
        applyStep1AfterLookup("none");
        msg.textContent = err.message || "Không tra cứu được. Thử lại sau.";
        msg.style.color = "var(--red)";
      }
    }
    updateChecklist();
  }

  function validateStep1() {
    const msg = el("lookupMsg");
    if (!FieldRules.isValidPhone(FieldRules.normalizePhone(el("phone").value))) {
      msg.textContent = FieldRules.messageForField("phone");
      msg.style.color = "var(--red)";
      return false;
    }
    if (!step1LookupDone) {
      msg.textContent = "Bấm Tra cứu trước khi tiếp tục.";
      msg.style.color = "var(--amber)";
      return false;
    }
    const name = el("full_name").value.trim();
    if (name.length < FieldRules.LIMITS.fullName.min) {
      msg.textContent = FieldRules.messageForField("full_name");
      msg.style.color = "var(--red)";
      return false;
    }
    if (name.length > FieldRules.LIMITS.fullName.max) {
      msg.textContent = FieldRules.messageForField("full_name_max");
      msg.style.color = "var(--red)";
      return false;
    }
    if (el("address").value.trim().length > FieldRules.LIMITS.address.max) {
      msg.textContent = FieldRules.messageForField("address");
      msg.style.color = "var(--red)";
      return false;
    }
    if (devices.length && deviceChoice === "none") {
      el("lookupMsg").textContent =
        "Chọn một thiết bị trong danh sách hoặc Thiết bị mới.";
      el("lookupMsg").style.color = "var(--amber)";
      return false;
    }
    return true;
  }

  function applySelectedDeviceToStep2() {
    if (deviceChoice === "existing" && selectedDeviceIndex !== null && devices[selectedDeviceIndex]) {
      applyDeviceRecordToForm(devices[selectedDeviceIndex]);
      serialCheckStatus = "valid";
      return;
    }
    if (deviceChoice !== "existing") {
      const serial = FieldRules.normalizeSerial(el("serial_no").value);
      if (!serial) {
        clearDeviceFields();
      }
    }
  }

  async function loadCategoriesIfNeeded() {
    if (categories.length) {
      return;
    }
    try {
      const res = await Api.categories();
      categories = res.data || [];
      el("category_id").innerHTML =
        '<option value="" selected>Chọn nhóm sự cố</option>' +
        categories
          .map(function (c) {
            return '<option value="' + c.category_id + '">' + c.category_name + "</option>";
          })
          .join("");
      el("category_id").value = "";
    } catch (err) {
      el("category_id").innerHTML = '<option value="">Không tải được nhóm sự cố</option>';
    }
  }

  async function saveTicket() {
    el("error").classList.add("hidden");
    clearStep2InlineErrors();
    if (!isCustomerFieldsValid()) {
      showFormError("Thông tin khách hàng chưa hợp lệ. Quay lại bước 1.");
      return;
    }
    if (!navigator.onLine) {
      showStep2NetworkError();
      updateChecklist();
      return;
    }
    await refreshSerialConflict();
    if (serialNetworkError || !navigator.onLine) {
      showStep2NetworkError();
      updateChecklist();
      return;
    }
    const step2Errors = collectStep2FieldErrors();
    if (step2Errors.length) {
      showStep2InlineError(step2Errors[0], FieldRules.messageForField(step2Errors[0]));
      updateChecklist();
      return;
    }
    const payload = {
      phone: FieldRules.normalizePhone(el("phone").value),
      full_name: el("full_name").value.trim(),
      address: el("address").value.trim() || null,
      product_name: el("product_name").value.trim(),
      serial_no: FieldRules.normalizeSerial(el("serial_no").value),
      purchase_date: el("purchase_date").value || null,
      warranty_months: el("warranty_months").value,
      note: el("purchase_place").value.trim() || null,
      issue_desc: el("issue_desc").value.trim()
    };
    const categoryId = Number(el("category_id").value);
    lastCreatePayload = payload;
    lastMeta = { categoryId, priority };
    el("loading").classList.remove("hidden");
    try {
      const created = await Api.createTicket(payload);
      if (categoryId) {
        await Api.classify(created.ticket_id, categoryId);
      }
      if (priority) {
        await Api.setPriority(created.ticket_id, priority);
      }
      window.location.href = "/ticket-detail.html?id=" + created.ticket_id;
    } catch (err) {
      el("loading").classList.add("hidden");
      if (connectivityFailed(err)) {
        showStep2NetworkError();
        return;
      }
      let text = err.message || "Không tạo được phiếu.";
      if (err.body && err.body.fields && err.body.fields.length) {
        const field = err.body.fields[0];
        text = FieldRules.messageForField(field);
        if (err.body.error === "THIET_BI_THUOC_KHACH_KHAC") {
          text = FieldRules.messageForField("serial_no_taken");
          showStep2InlineError("serial_no_taken", text);
          return;
        }
        if (
          field === "issue_desc" ||
          field === "product_name" ||
          field === "serial_no" ||
          field === "serial_no_taken"
        ) {
          showStep2InlineError(field === "serial_no" ? "serial_no_taken" : field, text);
          return;
        }
      }
      showFormError(text);
    }
  }

  el("lookup").onclick = lookup;
  el("btnContinue").onclick = function () {
    if (!validateStep1()) {
      return;
    }
    applySelectedDeviceToStep2();
    showStep(2);
  };
  el("btnBackStep2").onclick = function () {
    showStep(1);
  };

  document.querySelectorAll(".segment-priority").forEach(function (btn) {
    btn.onclick = function () {
      priority = btn.getAttribute("data-priority");
      document.querySelectorAll(".segment-priority").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      updateSummary();
      if (el("step2FormMsg")) {
        el("step2FormMsg").classList.add("hidden");
        el("step2FormMsg").textContent = "";
      }
    };
  });

  ["serial_no", "product_name", "purchase_date", "issue_desc"].forEach(function (id) {
    el(id).addEventListener("input", function () {
      if (id === "issue_desc" && el("issueDescMsg")) {
        el("issueDescMsg").classList.add("hidden");
        el("issueDescMsg").textContent = "";
      }
      if (id === "product_name" && el("productMsg")) {
        el("productMsg").classList.add("hidden");
        el("productMsg").textContent = "";
      }
      if (id === "serial_no") {
        serialConflict = false;
        serialCheckStatus = "idle";
        clearStep2NetworkError();
        el("error").classList.add("hidden");
        if (el("serialMsg")) {
          el("serialMsg").classList.add("hidden");
          el("serialMsg").textContent = "";
        }
        scheduleSerialConflictCheck();
      }
      refreshWarrantyBanner();
      updateChecklist();
      updateStatusChip();
    });
  });
  el("purchase_place").addEventListener("change", function () {
    refreshWarrantyBanner();
    updateChecklist();
  });
  el("category_id").addEventListener("change", function () {
    if (el("step2FormMsg")) {
      el("step2FormMsg").classList.add("hidden");
      el("step2FormMsg").textContent = "";
    }
    updateSummary();
    updateStatusChip();
  });
  el("full_name").addEventListener("input", function () {
    updateChecklist();
    updateSummary();
  });
  el("phone").addEventListener("input", function () {
    resetStep1LookupUi();
    el("lookupMsg").textContent = "";
    updateChecklist();
    updateSummary();
  });
  el("serial_no").addEventListener("blur", function () {
    el("serial_no").value = FieldRules.normalizeSerial(el("serial_no").value);
    refreshSerialConflict();
  });

  el("save").onclick = saveTicket;
  document.querySelectorAll(".segment-priority").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-priority") === priority);
  });
  el("save").classList.add("hidden");
  disableWizardAutofill();
  updateSummary();
  updateChecklist();
}
