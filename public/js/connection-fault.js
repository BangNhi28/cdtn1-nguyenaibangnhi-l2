(function () {
  const DEFAULT_MSG = "Vui lòng kiểm tra lại kết nối mạng.";
  let retryHandler = null;

  function mountConnectionFault() {
    if (document.getElementById("connectionFault")) {
      return;
    }
    const root = document.createElement("div");
    root.id = "connectionFault";
    root.className = "connection-fault hidden";
    root.setAttribute("role", "alertdialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML =
      '<div class="connection-fault-panel">' +
      '<div class="connection-fault-cloud" aria-hidden="true">' +
      '<span class="connection-fault-cloud-shape"></span>' +
      '<span class="connection-fault-dots"><i></i><i></i><i></i></span>' +
      "</div>" +
      '<h2 class="connection-fault-title" id="connectionFaultTitle">Không thể kết nối hệ thống</h2>' +
      '<p class="connection-fault-message" id="connectionFaultMessage">' +
      DEFAULT_MSG +
      "</p>" +
      '<p class="connection-fault-code" id="connectionFaultCode"></p>" +
      '<button type="button" class="connection-fault-retry" id="connectionFaultRetry">Thử lại</button>' +
      '<p class="connection-fault-brand"><span data-icon="shield" data-icon-size="16"></span> Mekong Care</p>' +
      "</div>";
    document.body.appendChild(root);
    document.getElementById("connectionFaultRetry").addEventListener("click", function () {
      const fn = retryHandler;
      hideConnectionFault();
      if (typeof fn === "function") {
        fn();
      } else {
        window.location.reload();
      }
    });
    if (typeof icon === "function") {
      root.querySelectorAll("[data-icon]").forEach(function (el) {
        el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-icon-size") || 16));
      });
    }
  }

  function showConnectionFault(options) {
    const opts = options || {};
    mountConnectionFault();
    const panel = document.getElementById("connectionFault");
    document.getElementById("connectionFaultTitle").textContent =
      opts.title || "Không thể kết nối hệ thống";
    document.getElementById("connectionFaultMessage").textContent = opts.message || DEFAULT_MSG;
    const codeEl = document.getElementById("connectionFaultCode");
    if (opts.code) {
      codeEl.textContent = opts.code;
      codeEl.classList.remove("hidden");
    } else {
      codeEl.textContent = "";
      codeEl.classList.add("hidden");
    }
    retryHandler = opts.onRetry || null;
    panel.classList.remove("hidden");
    document.body.classList.add("connection-fault-open");
  }

  function hideConnectionFault() {
    const panel = document.getElementById("connectionFault");
    if (panel) {
      panel.classList.add("hidden");
    }
    document.body.classList.remove("connection-fault-open");
    retryHandler = null;
  }

  function isConnectivityError(err) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return true;
    }
    if (!err) {
      return false;
    }
    if (err.offline) {
      return true;
    }
    if (err.status >= 500) {
      return true;
    }
    return false;
  }

  /** @returns {boolean} true nếu đã hiện màn lỗi */
  function connectionFaultFromError(err, options) {
    if (!isConnectivityError(err)) {
      return false;
    }
    const opts = options || {};
    let code = opts.code || "";
    if (!code && err && err.status) {
      code = "HTTP_" + err.status;
    }
    if (!code && err && err.offline) {
      code = "NETWORK_OFFLINE";
    }
    showConnectionFault({
      title: opts.title || (err && err.status >= 500 ? "Máy chủ tạm không phản hồi" : "Không thể kết nối hệ thống"),
      message: opts.message || (err && err.message) || DEFAULT_MSG,
      code: code,
      onRetry: opts.onRetry
    });
    return true;
  }

  window.showConnectionFault = showConnectionFault;
  window.hideConnectionFault = hideConnectionFault;
  window.connectionFaultFromError = connectionFaultFromError;
})();
