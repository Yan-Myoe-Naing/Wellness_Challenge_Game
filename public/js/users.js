let usersCache = [];
let diplomacyCache = [];

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureBaseUrlOrWarn()) return;
  loadPageData();
});



// loadPageData.
function loadPageData() {


// callback.
  const callback = (status, data) => {
    if (status !== 200) {
      alert(data?.message || "Failed to load players.");
      return;
    }

    usersCache = data?.data?.users || [];
    diplomacyCache = data?.data?.diplomacies || [];
    showUsers();
  };

  fetchMethod(currentUrl + "/api/users/overview", callback, "GET", null, null);
}



// showUsers.
function showUsers() {
  const users = usersCache;
  const listEl = document.getElementById("userList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!users.length) {
    listEl.innerHTML = `<p class="text-center">No players found.</p>`;
    return;
  }

  const countsByUser = buildRelationCounts(diplomacyCache);

  users.forEach((user) => {
    const counts = countsByUser[user.id] || { war: 0, alliance: 0, peace: 0 };
    const card = document.createElement("div");
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${user.username || "Unknown"}</h5>
          <p class="card-text mb-1">User ID: ${user.id}</p>
          <div class="d-flex flex-wrap gap-2">
            <span class="rel-badge rel-war">War (${counts.war})</span>
            <span class="rel-badge rel-alliance">Alliance (${counts.alliance})</span>
            <span class="rel-badge rel-peace">Peace (${counts.peace})</span>
          </div>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}



// buildRelationCounts.
function buildRelationCounts(diplomacies) {
  const counts = {};
  diplomacies.forEach((dip) => {
    const status = String(dip.status).toLowerCase();
    const a = dip.initiator_id;
    const b = dip.responder_id;
    if (!counts[a]) counts[a] = { war: 0, alliance: 0, peace: 0 };
    if (!counts[b]) counts[b] = { war: 0, alliance: 0, peace: 0 };
    if (status === "war" || status === "alliance" || status === "peace") {
      counts[a][status] += 1;
      counts[b][status] += 1;
    }
  });
  return counts;
}
