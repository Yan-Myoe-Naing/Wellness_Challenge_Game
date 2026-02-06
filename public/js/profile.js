let token = null;
document.addEventListener("DOMContentLoaded", function () {
    token = ensureTokenOrRedirect("index.html");
    if (!token) return;

    if (!ensureBaseUrlOrWarn()) return;

    buildProfileModal();
    eventListeners();
    loadProfile(token);
});



// buildProfileModal.
function buildProfileModal() {
    if (typeof buildModal !== "function") return;
    buildModal({
        id: "editUsernameModal",
        title: "Edit Username",
        bodyHtml: `
          <form id="editUsernameForm">
            <div class="form-group">
              <label for="editUsernameInput">New username</label>
              <input type="text" class="form-control" id="editUsernameInput" required>
            </div>
          </form>
        `,
        footerHtml: `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" form="editUsernameForm" class="btn btn-primary">Save</button>
        `,
    });
}



// eventListeners.
function eventListeners() {
    document.getElementById("editUsernameBtn")?.addEventListener("click", function () {
        openEditUsernameModal();
    });

    document.getElementById("editUsernameForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        updateUsername();
    });
}



// openEditUsernameModal.
function openEditUsernameModal() {
    const current = document.getElementById("profileUsername")?.textContent || "";
    const input = document.getElementById("editUsernameInput");
    if (input) input.value = current.trim();
    if (typeof showModal === "function") showModal("editUsernameModal");
}



// loadProfile.
function loadProfile(token) {
    const usernameEl = document.getElementById("profileUsername");
    const userIdEl = document.getElementById("profileUserId");
    const pointsEl = document.getElementById("profilePoints");

    if (!usernameEl || !userIdEl || !pointsEl) return;



// callback.
    const callback = (responseStatus, responseData) => {
        if (handleAuthFailure(responseStatus, responseData)) return;
        if (responseStatus !== 200 || !responseData?.data?.profile) {
            usernameEl.textContent = "Unknown";
            userIdEl.textContent = "-";
            pointsEl.textContent = "-";
            showToast(responseData?.message || "Unable to load profile data.", false);
            return;
        }

        const profile = responseData.data.profile;
        const user = profile.user || {};
        usernameEl.textContent = user.username || "Unknown";
        userIdEl.textContent = user.id || "-";
        pointsEl.textContent = user.points ?? "0";

        const cities = profile.cities || [];
        const armies = profile.armies || [];


// armiesByCityId.
        const armiesByCityId = armies.reduce((map, army) => {
            map[army.city_id] = army;
            return map;
        }, {});

        showCityCards(cities, armiesByCityId, false);
        showDiplomacies(profile.diplomacies || []);
        showPendingRequests(profile.pendingRequests || []);
    };

    fetchMethod(currentUrl + "/api/users/profile", callback, "GET", null, token);
}



// handleAuthFailure.
function handleAuthFailure(responseStatus, responseData) {
    if (responseStatus === 401 || responseStatus === 403) {
        showToast(responseData?.message || "Session expired. Please log in again.", false);
        localStorage.removeItem("token");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);
        return true;
    }
    return false;
}



// updateUsername.
function updateUsername() {
    const input = document.getElementById("editUsernameInput");
    if (!input) return;
    const username = input.value.trim();
    if (!/^[A-Za-z0-9]{3,20}$/.test(username)) {
        showToast("Username must be 3-20 characters (letters and numbers only).", false);
        return;
    }

    const data = { username };


// callback.
    const callback = (responseStatus, responseData) => {
        if (handleAuthFailure(responseStatus, responseData)) return;
        if (responseStatus === 200) {
            const updated = responseData?.data?.user;
            if (updated?.username) {
                const nameEl = document.getElementById("profileUsername");
                if (nameEl) nameEl.textContent = updated.username;
            }
            if (typeof hideModal === "function") hideModal("editUsernameModal");
            showToast(responseData?.message || "Username updated.", true);
        } else {
            showToast(responseData?.message || "Failed to update username.", false);
        }
    };

    fetchMethod(currentUrl + "/api/users", callback, "PUT", data, token);
}



// showCityCards.
function showCityCards(cities, armiesByCityId, appendOnly) {
    const cityList = document.getElementById("cityList");
    if (!cityList) return;
    if (!appendOnly) {
        cityList.innerHTML = "";
    }
    cities.forEach((city) => {
        const displayItem = document.createElement("div");

        displayItem.className =
            "col-xl-3 col-lg-4 col-md-6 col-sm-12 p-3";

        const army = armiesByCityId[city.id];
        const armyHtml = army
            ? `
                <div class="city-army mt-3" data-army-id="${army.id}">
                    <p class="mb-1">Army ID: ${army.id}</p>
                    <p class="mb-1" data-army-field="soldiers">Soldiers: ${army.soldiers ?? 0}</p>
                    <p class="mb-1" data-army-field="power">Power: ${army.army_power ?? "N/A"}</p>
                    <p class="mb-1" data-army-field="max">Max size: ${army.max_capacity ?? "N/A"}</p>
                </div>
              `
            : `<div class="city-army mt-3"><p class="mb-0">No army data.</p></div>`;
        displayItem.innerHTML = `
            <div class="card city-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${city.name || "Unnamed City"}</h5>
                    <p class="card-text">
                        Population: ${city.population ?? "N/A"} <br>
                    </p>
                    ${armyHtml}
                </div>
            </div>
            `;
        cityList.appendChild(displayItem);
    });
}



// showDiplomacies.
function showDiplomacies(diplomacies) {
    const listEl = document.getElementById("diplomacyList");
    if (!listEl) return;

    listEl.innerHTML = "";
    if (!Array.isArray(diplomacies) || diplomacies.length === 0) {
        listEl.innerHTML = `<p class="text-center">No diplomacies found.</p>`;
        return;
    }

    diplomacies.forEach((dip) => {
        const card = document.createElement("div");
        card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
        card.innerHTML = `
            <div class="card city-card h-100">
                <div class="card-body">
                    <h5 class="card-title">Status: ${dip.status}</h5>
                    <p class="card-text mb-1">Initiator: ${dip.initiator_id}</p>
                    <p class="card-text mb-0">Responder: ${dip.responder_id}</p>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });
}



// showPendingRequests.
function showPendingRequests(requests) {
    const listEl = document.getElementById("pendingDiplomacyList");
    if (!listEl) return;

    listEl.innerHTML = "";
    if (!Array.isArray(requests) || requests.length === 0) {
        listEl.innerHTML = `<p class="text-center">No pending requests.</p>`;
        return;
    }

    requests.forEach((req) => {
        const card = document.createElement("div");
        card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
        card.innerHTML = `
            <div class="card city-card h-100">
                <div class="card-body">
                    <h5 class="card-title">Type: ${req.type}</h5>
                    <p class="card-text mb-1">Sender: ${req.sender_id}</p>
                    <p class="card-text mb-1">Receiver: ${req.receiver_id}</p>
                    <p class="card-text mb-0">Status: ${req.status}</p>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });
}

