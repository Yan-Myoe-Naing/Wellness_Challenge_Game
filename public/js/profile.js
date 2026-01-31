// Optimal CA2 Modularity + Code Quality Style

let token = null;
let citiesArray = [];

// Event: DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    token = localStorage.getItem("token");
    if (!token) {
        showToast("Please log in to view your profile.", false);
        window.location.href = "index.html";
        return;
    }

    if (typeof window.currentUrl === "undefined") {
        window.currentUrl = window.location.origin;
    }
    if (window.currentUrl === "null") {
        showToast("Open this page via http://localhost:3000 (not file://).", false);
        return;
    }

    eventListeners(token);
    loadProfile(token);
});

// Add all the Event Listeners
function eventListeners(token) {
    document.getElementById("cityForm")?.addEventListener("submit", function (event) {
        createCity(token, event);
    });
    document.getElementById("buySoldiersForm")?.addEventListener("submit", function (event) {
        buySoldiers(token, event);
    });
    document.getElementById("soldiersAmount")?.addEventListener("input", sanitizeSoldiersAmount);
    document.getElementById("cityList")?.addEventListener("click", function (event) {
        openBuySoldiersModal(token, event);
    });
}

function loadProfile(token) {
    const usernameEl = document.getElementById("profileUsername");
    const userIdEl = document.getElementById("profileUserId");
    const pointsEl = document.getElementById("profilePoints");

    if (!usernameEl || !userIdEl || !pointsEl) return;

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
        const armiesByCityId = armies.reduce((map, army) => {
            map[army.city_id] = army;
            return map;
        }, {});

        citiesArray = cities;
        renderCityCards(cities, armiesByCityId, false, token);
        renderDiplomacies(profile.diplomacies || []);
        renderPendingRequests(profile.pendingRequests || []);
    };

    fetchMethod(currentUrl + "/api/users/profile", callback, "GET", null, token);
}

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

// Create City for the User
function createCity(token, event) {
    if (event?.preventDefault) {
        event.preventDefault();
    }

        // Reference city name input DIV
        const name = document.getElementById("city_name").value;
        const cityList = document.getElementById("cityList"); 

        // Create the Data Object for Fetch Method (req.body)
        const data = {
            city_name: name
        }

        const callback = (responseStatus, responseData) => {

            // If city was successfully created
            if (responseStatus == 201) {
                
                const city = responseData.data.city;
                const army = responseData.data.army || null;
                citiesArray.push(city);

                // Append new city card
                renderCityCards([city], army ? { [army.city_id]: army } : {}, true);
                updatePointsDisplay(responseData?.data?.newPoints);
                showToast(responseData?.message || "City created.", true);

                const modalEl = document.getElementById("createCityModal");
                if (modalEl && window.bootstrap) {
                    const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            } else {
                const warningCard = document.getElementById("warningCard");
                const warningText = document.getElementById("warningText");
                if (warningCard && warningText) {
                    warningCard.classList.remove("d-none");
                    warningText.textContent = responseData?.message || "Failed to create city.";
                }
                showToast(responseData?.message || "Failed to create city.", false);
            }
        }

        // POST /city for User based on User ID in Token
        fetchMethod(currentUrl + '/api/cities', callback, "POST", data, token);
}

function renderCityCards(cities, armiesByCityId, appendOnly, token) {
    // Reference citylist DIV
    const cityList = document.getElementById("cityList");
    if (!cityList) return;
    if (!appendOnly) {
        cityList.innerHTML = "";
    }

    // Loop through array of city data
    cities.forEach((city) => {
        
        // Create a DIV for each city
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
                    <p class="mb-0">Buyable: <span class="buyable-size" data-army-id="${army.id}">...</span></p>
                </div>
                <button class="btn btn-outline-warning btn-sm mt-3 buy-soldiers-btn" data-army-id="${army.id}">
                    Buy Soldiers
                </button>
              `
            : `<div class="city-army mt-3"><p class="mb-0">No army data.</p></div>`;
        
        // Fill in the data for each city DIV
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
        // Append DIV (add to back) to list 
        cityList.appendChild(displayItem);

        if (army) {
            fetchBuyableSize(army.id, token);
        }
    });
}

function fetchBuyableSize(armyId, token) {
    const callback = (responseStatus, responseData) => {
        const target = document.querySelector(`.buyable-size[data-army-id="${armyId}"]`);
        if (!target) return;

        if (responseStatus === 200 && responseData?.data?.buyableSize != null) {
            target.textContent = responseData.data.buyableSize;
            updateBuySoldiersLimit(armyId, responseData.data.buyableSize);
        } else {
            target.textContent = "N/A";
        }
    };

    fetchMethod(currentUrl + "/api/armies/" + armyId + "/getBuyableSize", callback, "GET", null, token);
}

function updateBuySoldiersLimit(armyId, buyableSize) {
    const buyArmyId = document.getElementById("buyArmyId");
    const soldiersAmountInput = document.getElementById("soldiersAmount");
    const buyableMaxText = document.getElementById("buyableMaxText");
    if (!buyArmyId || !soldiersAmountInput || !buyableMaxText) return;

    if (buyArmyId.value === String(armyId)) {
        const maxValue = Number(buyableSize) || 0;
        soldiersAmountInput.max = String(maxValue);
        soldiersAmountInput.value = "";
        buyableMaxText.textContent = String(maxValue);
        soldiersAmountInput.disabled = maxValue === 0;
    }
}

function updatePointsDisplay(newPoints) {
    const pointsEl = document.getElementById("profilePoints");
    if (!pointsEl || newPoints == null) return;
    pointsEl.textContent = String(newPoints);
}

function updateArmyCard(army, buyableSize) {
    if (!army?.id) return;
    const armyBlock = document.querySelector(`.city-army[data-army-id="${army.id}"]`);
    if (!armyBlock) return;

    const soldiersEl = armyBlock.querySelector('[data-army-field="soldiers"]');
    const powerEl = armyBlock.querySelector('[data-army-field="power"]');
    const maxEl = armyBlock.querySelector('[data-army-field="max"]');
    if (soldiersEl) soldiersEl.textContent = `Soldiers: ${army.soldiers ?? 0}`;
    if (powerEl) powerEl.textContent = `Power: ${army.army_power ?? "N/A"}`;
    if (maxEl) maxEl.textContent = `Max size: ${army.max_capacity ?? "N/A"}`;

    if (buyableSize != null) {
        const buyableEl = document.querySelector(`.buyable-size[data-army-id="${army.id}"]`);
        if (buyableEl) buyableEl.textContent = String(buyableSize);
    }
}

function sanitizeSoldiersAmount(event) {
    const target = event?.target;
    if (!target) return;
    if (Number(target.value) < 0) {
        target.value = "0";
    }
}

function openBuySoldiersModal(token, armyIdOrEvent) {
    let armyId = armyIdOrEvent;
    if (armyIdOrEvent?.target) {
        const button = armyIdOrEvent.target?.closest?.(".buy-soldiers-btn");
        if (!button) return;
        armyId = button.getAttribute("data-army-id");
    }

    const buyArmyId = document.getElementById("buyArmyId");
    const soldiersAmountInput = document.getElementById("soldiersAmount");
    const buyableMaxText = document.getElementById("buyableMaxText");
    const warningCard = document.getElementById("buySoldiersWarning");
    const warningText = document.getElementById("buySoldiersWarningText");

    if (!buyArmyId || !soldiersAmountInput || !buyableMaxText) return;
    buyArmyId.value = armyId || "";
    soldiersAmountInput.value = "";
    buyableMaxText.textContent = "0";
    soldiersAmountInput.disabled = false;
    if (warningCard && warningText) {
        warningCard.classList.add("d-none");
        warningText.textContent = "";
    }

    const modalEl = document.getElementById("buySoldiersModal");
    if (modalEl && window.bootstrap) {
        const modalInstance = new window.bootstrap.Modal(modalEl);
        modalInstance.show();
    }

    if (armyId) {
        fetchBuyableSize(armyId, token);
    }
}

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

    const callback = (responseStatus, responseData) => {
        if (handleAuthFailure(responseStatus, responseData)) return;
        if (responseStatus === 200) {
            updateArmyCard(responseData?.data?.army, responseData?.data?.buyableSize);
            updatePointsDisplay(responseData?.data?.newPoints);
            fetchBuyableSize(armyId, token);
            const validationMessage = responseData?.data?.validationMessage;
            const message = validationMessage
                ? `${responseData?.message || "Success."} ${validationMessage}`
                : (responseData?.message || "Soldiers bought.");
            showToast(message, true);

            const modalEl = document.getElementById("buySoldiersModal");
            if (modalEl && window.bootstrap) {
                const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        } else if (warningCard && warningText) {
            warningCard.classList.remove("d-none");
            warningText.textContent =
                responseData?.message || "Failed to buy soldiers.";
            showToast(responseData?.message || "Failed to buy soldiers.", false);
        }
    };

    fetchMethod(currentUrl + "/api/armies/" + armyId + "/buySoldiers", callback, "PUT", data, token);
}

function renderDiplomacies(diplomacies) {
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

function renderPendingRequests(requests) {
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
