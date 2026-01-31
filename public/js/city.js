let token = null;
let myArmies = [];
let myCities = [];

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
    showAlert("Open this page via http://localhost:3000 (not file://).");
    return;
  }

  eventListeners(token);
  loadPageData();
});

function eventListeners(token) {
  document.getElementById("battleList")?.addEventListener("click", function (event) {
    handleBattleListClick(token, event);
  });
  document.getElementById("battleForm")?.addEventListener("submit", function (event) {
    handleBattleFormSubmit(token, event);
  });
}

function loadPageData() {
  fetchMethod(currentUrl + "/api/cities/overview", onOverviewLoaded, "GET", null, token);
}

function onOverviewLoaded(status, data) {
  if (status !== 200) {
    showAlert(data?.message || "Failed to load city data.");
    return;
  }

  const cities = data?.data?.allCity || [];
  const targets = data?.data?.warTargets || [];
  myArmies = data?.data?.armies || [];
  myCities = cities;
  const myCityCount = (data?.data?.cityByUser || []).length;
  const battleableCount = targets.length;
  const myCountEl = document.getElementById("myCityCount");
  const battleableEl = document.getElementById("battleableCount");
  if (myCountEl) myCountEl.textContent = myCityCount;
  if (battleableEl) battleableEl.textContent = battleableCount;

  renderCities(cities);
  renderBattleTargets(targets);
}

function renderCities(cities) {
  const listEl = document.getElementById("cityList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!cities.length) {
    listEl.innerHTML = `<p class="text-center">No cities found.</p>`;
    return;
  }

  cities.forEach((city) => {
    const card = document.createElement("div");
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${city.name || "Unnamed City"}</h5>
          <p class="card-text mb-0">Owner ID: ${city.owner_id}</p>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function renderBattleTargets(targets) {
  const listEl = document.getElementById("battleList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!targets.length) {
    listEl.innerHTML = `<p class="text-center">No battle targets found.</p>`;
    return;
  }

  targets.forEach((city) => {
    const card = document.createElement("div");
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${city.name || "Target City"}</h5>
          <p class="card-text mb-1">Owner ID: ${city.owner_id}</p>
          <p class="card-text mb-3">Defender Army ID: ${city.defender_army_id}</p>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-primary btn-sm battle-btn" data-action="capture" data-defender="${city.defender_army_id}">Capture</button>
            <button class="btn btn-outline-warning btn-sm battle-btn" data-action="destroy" data-defender="${city.defender_army_id}">Destroy</button>
          </div>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function handleBattleListClick(token, event) {
  const btn = event.target?.closest(".battle-btn");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  const defenderArmyId = btn.getAttribute("data-defender");
  openBattleModal(defenderArmyId, action);
}

function handleBattleFormSubmit(token, event) {
  event.preventDefault();
  const attackerArmyId = document.getElementById("attackerArmySelect")?.value;
  const defenderArmyId = document.getElementById("battleDefenderArmyId")?.value;
  const action = document.getElementById("battleAction")?.value;
  if (!attackerArmyId || !defenderArmyId || !action) return;
  battleCity(attackerArmyId, defenderArmyId, action);

  if (typeof hideModal === "function") hideModal("battleModal");
}

function openBattleModal(defenderArmyId, action) {
  const select = document.getElementById("attackerArmySelect");
  const defenderInput = document.getElementById("battleDefenderArmyId");
  const actionInput = document.getElementById("battleAction");
  const modalEl = document.getElementById("battleModal");
  if (!select || !defenderInput || !actionInput || !modalEl) return;

  const cityNameById = myCities.reduce((map, city) => {
    map[city.id] = city.name;
    return map;
  }, {});

  select.innerHTML = "";
  myArmies.forEach((army) => {
    const option = document.createElement("option");
    option.value = army.id;
    const cityName = cityNameById[army.city_id] || "City";
    option.textContent = `Army ${army.id} / ${cityName} (${army.city_id})`;
    select.appendChild(option);
  });

  defenderInput.value = defenderArmyId;
  actionInput.value = action;

  if (typeof showModal === "function") showModal("battleModal");
}

function battleCity(attackerArmyId, defenderArmyId, action) {
  const data = { defender_army_id: Number(defenderArmyId) };
  const callback = (status, response) => {
    if (status === 201) {
      const result = response?.data?.battleResult || "unknown";
      showAlert(`Battle result: ${result}`, "Battle Result");
      loadPageData();
    } else {
      showAlert(response?.message || "Battle failed.", "Battle Error");
    }
  };

  fetchMethod(
    currentUrl + "/api/battles/armies/" + attackerArmyId + "/" + action,
    callback,
    "POST",
    data,
    token
  );
}
