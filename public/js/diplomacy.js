let token = null;

document.addEventListener("DOMContentLoaded", function () {
  token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  if (typeof window.currentUrl === "undefined") {
    window.currentUrl = window.location.origin;
  }
  if (window.currentUrl === "null") {
    showToast("Open this page via http://localhost:3000 (not file://).", false);
    return;
  }

  eventListeners();
  loadPageData();
});

function eventListeners() {
  document.getElementById("sendRequestForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const targetId = Number(document.getElementById("targetUserId")?.value);
    const type = document.getElementById("requestType")?.value;
    if (!targetId || !type) return;
    sendRequest(targetId, type);
  });

  document.getElementById("openRequestModal")?.addEventListener("click", function () {
    const targetInput = document.getElementById("targetUserId");
    const typeSelect = document.getElementById("requestType");
    if (targetInput) targetInput.value = "";
    if (typeSelect) typeSelect.value = "alliance";
    if (typeof showModal === "function") showModal("requestModal");
  });

  document.getElementById("myDiplomacyList")?.addEventListener("click", function (event) {
    const btn = event.target?.closest(".delete-diplomacy-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    deleteDiplomacy(id);
  });

  document.getElementById("pendingRequestList")?.addEventListener("click", function (event) {
    const acceptBtn = event.target?.closest(".accept-request-btn");
    const rejectBtn = event.target?.closest(".reject-request-btn");
    if (acceptBtn) {
      const id = acceptBtn.getAttribute("data-id");
      respondRequest(id, "accepted");
    } else if (rejectBtn) {
      const id = rejectBtn.getAttribute("data-id");
      respondRequest(id, "rejected");
    }
  });
}

function loadPageData() {
  fetchMethod(currentUrl + "/api/diplomacies/overview", onOverviewLoaded, "GET", null, token);
}

function onOverviewLoaded(status, data) {
  if (handleAuthFailure(status, data)) return;
  if (status !== 200) {
    showToast(data?.message || "Failed to load diplomacy data.", false);
    return;
  }

  const allList = data?.data?.allDiplomacies || [];
  const myList = data?.data?.myDiplomacies || [];
  const pendingList = data?.data?.pendingRequests || [];

  renderDiplomacyList("allDiplomacyList", allList, false);
  document.getElementById("myDiplomacyCount").textContent = myList.length;
  document.getElementById("pendingRequestCount").textContent = pendingList.length;

  const wars = myList.filter((dip) => String(dip.status).toLowerCase() === "war");
  const nonWars = myList.filter((dip) => String(dip.status).toLowerCase() !== "war");
  renderDiplomacyList("myDiplomacyList", nonWars, true);
  renderDiplomacyList("myWarList", wars, false, true);
  renderPendingRequests(pendingList);
}

function renderDiplomacyList(targetId, items, showDelete, showWarNote) {
  const listEl = document.getElementById(targetId);
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!items.length) {
    listEl.innerHTML = `<p class="text-center">No diplomacies found.</p>`;
    return;
  }

  items.forEach((dip) => {
    const card = document.createElement("div");
    const statusClass = `dip-status-${String(dip.status).toLowerCase()}`;
    const base = `
      <div class="card city-card dip-card ${statusClass} h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title mb-0">Status</h5>
            <span class="dip-badge">${dip.status}</span>
          </div>
          <p class="card-text mb-1">Initiator: ${dip.initiator_id}</p>
          <p class="card-text mb-2">Responder: ${dip.responder_id}</p>
          ${showWarNote ? `<p class="card-text mb-2">Resolve via peace request.</p>` : ""}
          ${
            showDelete
              ? `<button class="btn btn-outline-warning btn-sm delete-diplomacy-btn" data-id="${dip.id}">Delete</button>`
              : ""
          }
        </div>
      </div>
    `;

    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = base;
    listEl.appendChild(card);
  });
}

function renderPendingRequests(items) {
  const listEl = document.getElementById("pendingRequestList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!items.length) {
    listEl.innerHTML = `<p class="text-center">No pending requests.</p>`;
    return;
  }

  items.forEach((req) => {
    const card = document.createElement("div");
    card.className = "col-12 p-2";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">Type: ${req.type}</h5>
          <p class="card-text mb-1">Sender: ${req.sender_id}</p>
          <p class="card-text mb-2">Receiver: ${req.receiver_id}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm accept-request-btn" data-id="${req.id}">Accept</button>
            <button class="btn btn-outline-warning btn-sm reject-request-btn" data-id="${req.id}">Reject</button>
          </div>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function sendRequest(targetId, type) {
  const data = { target_id: targetId };
  const callback = (status, response) => {
    if (handleAuthFailure(status, response)) return;
    if (status === 201) {
      showToast("Request sent.", true);
      loadPageData();
      if (typeof hideModal === "function") hideModal("requestModal");
      const form = document.getElementById("sendRequestForm");
      if (form) form.reset();
    } else {
      showToast(response?.message || "Failed to send request.", false);
    }
  };

  fetchMethod(currentUrl + "/api/diplomacyRequests/" + type, callback, "POST", data, token);
}

function respondRequest(requestId, action) {
  if (!requestId) return;
  const callback = (status, response) => {
    if (handleAuthFailure(status, response)) return;
    if (status === 200) {
      showToast(`Request ${action}.`, true);
      loadPageData();
    } else {
      showToast(response?.message || "Failed to update request.", false);
    }
  };

  fetchMethod(
    currentUrl + "/api/diplomacyRequests/" + requestId + "/" + action,
    callback,
    "PUT",
    null,
    token
  );
}

function deleteDiplomacy(diplomacyId) {
  if (!diplomacyId) return;
  const callback = (status, response) => {
    if (handleAuthFailure(status, response)) return;
    if (status === 204 || status === 200) {
      showToast("Diplomacy deleted.", true);
      loadPageData();
    } else {
      showToast(response?.message || "Failed to delete diplomacy.", false);
    }
  };

  fetchMethod(currentUrl + "/api/diplomacies/" + diplomacyId, callback, "DELETE", null, token);
}

function handleAuthFailure(status, response) {
  if (status === 401 || status === 403) {
    showToast(response?.message || "Session expired. Please log in again.", false);
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);
    return true;
  }
  return false;
}
