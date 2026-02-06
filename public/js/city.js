let token = null;
let myArmies = [];
let myCities = [];
let currentUserId = null;

document.addEventListener("DOMContentLoaded", function () {
  token = ensureTokenOrRedirect("login.html");
  if (!token) return;

  if (!ensureBaseUrlOrWarn()) return;

  buildCityModal();
  eventListeners();
  loadPageData();
});



// buildCityModal.
function buildCityModal() {
  if (typeof buildModal !== "function") return;
  buildModal({
    id: "battleModal",
    title: "Choose Attacker Army",
    bodyHtml: `
      <form id="battleForm">
        <input type="hidden" id="battleDefenderArmyId" />
        <input type="hidden" id="battleAction" />
        <div class="mb-3">
          <label for="attackerArmySelect" class="form-label">Army (Army ID / City ID)</label>
          <select id="attackerArmySelect" class="form-select form-select-sm" required></select>
        </div>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" form="battleForm" class="btn btn-primary btn-sm">Attack</button>
    `,
  });

  buildModal({
    id: "createCityModal",
    title: "Create City",
    bodyHtml: `
      <form id="cityForm">
        <div class="form-group pb-3">
          <label for="city_name">City name</label>
          <input type="text" class="form-control" id="city_name" required>
        </div>
        <div id="warningCard" class="card border-danger mt-2 mb-0 d-none">
          <div class="card-body text-danger">
            <p id="warningText" class="card-text"></p>
          </div>
        </div>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" form="cityForm" class="btn btn-primary">Create</button>
    `,
  });

  buildModal({
    id: "buySoldiersModal",
    title: "Buy Soldiers",
    bodyHtml: `
      <form id="buySoldiersForm">
        <input type="hidden" id="buyArmyId" />
        <div class="form-group pb-3">
          <label for="soldiersAmount">Amount of soldiers</label>
          <input type="number" min="1" class="form-control" id="soldiersAmount" required>
          <small class="buyable-max-text">Max buyable: <span id="buyableMaxText">0</span></small>
        </div>
        <div id="buySoldiersWarning" class="card border-danger mt-2 mb-0 d-none">
          <div class="card-body text-danger">
            <p id="buySoldiersWarningText" class="card-text"></p>
          </div>
        </div>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" form="buySoldiersForm" class="btn btn-primary">Buy</button>
    `,
  });
}



// eventListeners.
function eventListeners() {
  document.getElementById("battleList")?.addEventListener("click", function (event) {
    openBattleModal(event);
  });
  document.getElementById("battleForm")?.addEventListener("submit", function (event) {
    handleBattleFormSubmit(event);
  });
  document.getElementById("openCreateCityModal")?.addEventListener("click", function () {
    openCreateCityModal();
  });
  document.getElementById("cityForm")?.addEventListener("submit", function (event) {
    createCity(token, event);
  });
  document.getElementById("myCityList")?.addEventListener("click", function (event) {
    openBuySoldiersModal(token, event);
  });
  document.getElementById("buySoldiersForm")?.addEventListener("submit", function (event) {
    buySoldiers(token, event);
  });
  document.getElementById("soldiersAmount")?.addEventListener("input", filterSoldiersAmount);
}



// loadPageData.
function loadPageData() {


// callback.
  const callback = (status, data) => {
    if (status !== 200) {
      showAlert(data?.message || "Failed to load city data.");
      return;
    }

    const cities = data?.data?.allCity || [];
    const targets = data?.data?.warTargets || [];
    const myCitiesList = data?.data?.cityByUser || [];
    myArmies = data?.data?.armies || [];
    myCities = cities;
    currentUserId = data?.data?.user?.id ?? null;
    const myCityCount = myCitiesList.length;
    const battleableCount = targets.length;
    const myCountEl = document.getElementById("myCityCount");
    const battleableEl = document.getElementById("battleableCount");
    if (myCountEl) myCountEl.textContent = myCityCount;
    if (battleableEl) battleableEl.textContent = battleableCount;



// armiesByCityId.
    const armiesByCityId = myArmies.reduce((map, army) => {
      map[army.city_id] = army;
      return map;
    }, {});

    showAllCities(cities, "cityList");
    showMyCities(myCitiesList, armiesByCityId, "myCityList");
    showBattleTargets(targets);
  };

  fetchMethod(currentUrl + "/api/cities/overview", callback, "GET", null, token);
}



// showAllCities.
function showAllCities(cities, targetId) {
  const listEl = document.getElementById(targetId);
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



// showMyCities.
function showMyCities(cities, armiesByCityId, targetId) {
  const listEl = document.getElementById(targetId);
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!cities.length) {
    listEl.innerHTML = `<p class="text-center">No cities found.</p>`;
    return;
  }

  cities.forEach((city) => {
    const card = document.createElement("div");
    const army = armiesByCityId?.[city.id];
    const armyHtml = army
      ? `
          <div class="city-army mt-3" data-army-id="${army.id}">
            <p class="mb-1">Army ID: ${army.id}</p>
            <p class="mb-1" data-army-field="soldiers">Soldiers: ${army.soldiers ?? 0}</p>
            <p class="mb-1" data-army-field="power">Power: ${army.army_power ?? "N/A"}</p>
            <p class="mb-1" data-army-field="max">Max size: ${army.max_capacity ?? "N/A"}</p>
            <p class="mb-0">Buyable: <span class="buyable-size" data-army-id="${army.id}">...</span></p>
          </div>
          <button class="btn btn-outline-warning btn-sm mt-3 buy-soldiers-btn" data-army-id="${army.id}">
            Buy Soldiers
          </button>
        `
      : `<div class="city-army mt-3"><p class="mb-0">No army data.</p></div>`;
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${city.name || "Unnamed City"}</h5>
          <p class="card-text mb-0">Owner ID: ${city.owner_id}</p>
          ${armyHtml}
        </div>
      </div>
    `;
    listEl.appendChild(card);

    if (army) {
      fetchBuyableSize(army.id, token);
    }
  });
}



// showBattleTargets.
function showBattleTargets(targets) {
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



// handleBattleFormSubmit.
function handleBattleFormSubmit(event) {
  event.preventDefault();
  const attackerArmyId = document.getElementById("attackerArmySelect")?.value;
  const defenderArmyId = document.getElementById("battleDefenderArmyId")?.value;
  const action = document.getElementById("battleAction")?.value;
  if (!attackerArmyId || !defenderArmyId || !action) return;
  battleCity(attackerArmyId, defenderArmyId, action);
  if (typeof hideModal === "function") hideModal("battleModal");
}



// openCreateCityModal.
function openCreateCityModal() {
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");
  if (warningCard && warningText) {
    warningCard.classList.add("d-none");
    warningText.textContent = "";
  }
  if (typeof showModal === "function") showModal("createCityModal");
}



// createCity.
function createCity(token, event) {
  if (event?.preventDefault) {
    event.preventDefault();
  }

  const name = document.getElementById("city_name")?.value?.trim();
  if (!name) return;

  const data = { city_name: name };


// callback.
  const callback = (status, response) => {
    if (status === 201) {
      showAlert(response?.message || "City created.", "Success");
      if (typeof hideModal === "function") hideModal("createCityModal");
      loadPageData();
    } else {
      const warningCard = document.getElementById("warningCard");
      const warningText = document.getElementById("warningText");
      if (warningCard && warningText) {
        warningCard.classList.remove("d-none");
        warningText.textContent = response?.message || "Failed to create city.";
      }
      showAlert(response?.message || "Failed to create city.", "Error");
    }
  };

  fetchMethod(currentUrl + "/api/cities", callback, "POST", data, token);
}



// openBuySoldiersModal.
function openBuySoldiersModal(token, event) {
  const button = event?.target?.closest?.(".buy-soldiers-btn");
  if (!button) return;
  const armyId = button.getAttribute("data-army-id");
  if (!armyId) return;

  const buyArmyId = document.getElementById("buyArmyId");
  const soldiersAmountInput = document.getElementById("soldiersAmount");
  const buyableMaxText = document.getElementById("buyableMaxText");
  const warningCard = document.getElementById("buySoldiersWarning");
  const warningText = document.getElementById("buySoldiersWarningText");

  if (!buyArmyId || !soldiersAmountInput || !buyableMaxText) return;
  buyArmyId.value = armyId;
  soldiersAmountInput.value = "";
  buyableMaxText.textContent = "0";
  soldiersAmountInput.disabled = false;
  if (warningCard && warningText) {
    warningCard.classList.add("d-none");
    warningText.textContent = "";
  }

  if (typeof showModal === "function") showModal("buySoldiersModal");
  fetchBuyableSize(armyId, token);
}



// filterSoldiersAmount.
function filterSoldiersAmount(event) {
  const target = event?.target;
  if (!target) return;
  if (Number(target.value) < 0) {
    target.value = "0";
  }
}



// fetchBuyableSize.
function fetchBuyableSize(armyId, token) {


// callback.
  const callback = (status, response) => {
    const buyableMaxText = document.getElementById("buyableMaxText");
    const soldiersAmountInput = document.getElementById("soldiersAmount");
    const cardValueEl = document.querySelector(
      `.buyable-size[data-army-id="${armyId}"]`
    );

    if (status === 200 && response?.data?.buyableSize != null) {
      const maxValue = Number(response.data.buyableSize) || 0;
      if (cardValueEl) cardValueEl.textContent = String(maxValue);
      if (buyableMaxText && soldiersAmountInput) {
        buyableMaxText.textContent = String(maxValue);
        soldiersAmountInput.max = String(maxValue);
        soldiersAmountInput.disabled = maxValue === 0;
      }
    } else {
      if (cardValueEl) cardValueEl.textContent = "0";
      if (buyableMaxText) buyableMaxText.textContent = "0";
    }
  };

  fetchMethod(currentUrl + "/api/armies/" + armyId + "/getBuyableSize", callback, "GET", null, token);
}



// buySoldiers.
function buySoldiers(token, event) {
  if (event?.preventDefault) {
    event.preventDefault();
  }

  const buyArmyId = document.getElementById("buyArmyId");
  const soldiersAmountInput = document.getElementById("soldiersAmount");
  const warningCard = document.getElementById("buySoldiersWarning");
  const warningText = document.getElementById("buySoldiersWarningText");

  if (!buyArmyId || !soldiersAmountInput) return;

  const armyId = buyArmyId.value;
  const soldiers = Number(soldiersAmountInput.value);

  if (!armyId || !soldiers || soldiers <= 0) {
    if (warningCard && warningText) {
      warningCard.classList.remove("d-none");
      warningText.textContent = "Please enter a valid soldier amount.";
    }
    return;
  }

  const data = { soldiers };


// callback.
  const callback = (status, response) => {
    if (status === 200) {
      showAlert(response?.message || "Soldiers bought.", "Success");
      if (typeof hideModal === "function") hideModal("buySoldiersModal");
      loadPageData();
    } else {
      if (warningCard && warningText) {
        warningCard.classList.remove("d-none");
        warningText.textContent = response?.message || "Failed to buy soldiers.";
      }
      showAlert(response?.message || "Failed to buy soldiers.", "Error");
    }
  };

  fetchMethod(currentUrl + "/api/armies/" + armyId + "/buySoldiers", callback, "PUT", data, token);
}



// openBattleModal.
function openBattleModal(defenderArmyIdOrEvent, action) {
  let defenderArmyId = defenderArmyIdOrEvent;
  if (defenderArmyIdOrEvent?.target) {
    const btn = defenderArmyIdOrEvent.target?.closest(".battle-btn");
    if (!btn) return;
    defenderArmyId = btn.getAttribute("data-defender");
    action = btn.getAttribute("data-action");
  }

  const select = document.getElementById("attackerArmySelect");
  const defenderInput = document.getElementById("battleDefenderArmyId");
  const actionInput = document.getElementById("battleAction");
  const modalEl = document.getElementById("battleModal");
  if (!select || !defenderInput || !actionInput || !modalEl) return;



// cityNameById.
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



// battleCity.
function battleCity(attackerArmyId, defenderArmyId, action) {
  const data = { defender_army_id: Number(defenderArmyId) };
  if (typeof showAlertLoading === "function") {
    showAlertLoading("Battling...", "Battle");
  }


// callback.
  const callback = (status, response) => {


// handleResult.
    const handleResult = () => {
      if (status === 201) {
        const result = response?.data?.battleResult || "unknown";
        showAlert(`Battle result: ${result}`, "Battle Result");
        loadPageData();
      } else {
        showAlert(response?.message || "Battle failed.", "Battle Error");
      }
    };
    setTimeout(handleResult, 800);
  };

  fetchMethod(
    currentUrl + "/api/battles/armies/" + attackerArmyId + "/" + action, callback, "POST", data, token);
}
