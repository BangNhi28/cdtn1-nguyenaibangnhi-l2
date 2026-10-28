const Api = {
  base: "/api",
  token() {
    return localStorage.getItem("token") || "";
  },
  user() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },
  async request(path, options) {
    const headers = Object.assign({ "Content-Type": "application/json" }, options && options.headers);
    if (this.token()) {
      headers.Authorization = "Bearer " + this.token();
    }
    let res;
    try {
      res = await fetch(this.base + path, Object.assign({}, options, { headers }));
    } catch (err) {
      const error = new Error("Vui lòng kiểm tra lại kết nối mạng.");
      error.offline = true;
      throw error;
    }
    const body = await res.json().catch(() => ({}));
    if (res.status === 401 && !path.startsWith("/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login.html";
      throw new Error("Cần đăng nhập.");
    }
    if (!res.ok) {
      const error = new Error(body.message || "Yêu cầu thất bại.");
      error.status = res.status;
      error.body = body;
      throw error;
    }
    return body;
  },
  login(username, password) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },
  customersByPhone(phone) {
    return this.request("/customers?phone=" + encodeURIComponent(phone));
  },
  tickets(quaHan) {
    const q = quaHan ? "?qua_han=true" : "";
    return this.request("/tickets" + q);
  },
  ticket(id) {
    return this.request("/tickets/" + id);
  },
  createTicket(payload) {
    return this.request("/tickets", { method: "POST", body: JSON.stringify(payload) });
  },
  serialCheck(phone, serial) {
    const q =
      "?phone=" +
      encodeURIComponent(phone || "") +
      "&serial=" +
      encodeURIComponent(serial || "");
    return this.request("/tickets/serial-check" + q);
  },
  classify(id, categoryId) {
    return this.request("/tickets/" + id + "/phan-loai", {
      method: "PUT",
      body: JSON.stringify({ category_id: categoryId })
    });
  },
  setPriority(id, priority) {
    return this.request("/tickets/" + id + "/uu-tien", {
      method: "PUT",
      body: JSON.stringify({ priority })
    });
  },
  statusLog(id) {
    return this.request("/tickets/" + id + "/status-log");
  },
  categories() {
    return this.request("/issue-categories");
  }
};

function requireLogin() {
  if (!Api.token()) {
    window.location.href = "/login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
