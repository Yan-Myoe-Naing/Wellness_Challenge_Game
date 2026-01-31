let token = null;
let allChallenges = null;
let completions = null;
let userPoints = null;
let completedChallenges = null;

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
    alert("Open this page via http://localhost:3000 (not file://).");
    return;
  }

  eventListeners();
  loadPageData();
});

function eventListeners() {
  document.getElementById("activeChallengeList")?.addEventListener("click", function (event) {
    const button = event.target?.closest(".complete-challenge-btn");
    if (!button) return;
    const challengeId = button.getAttribute("data-id");
    openCompletionModal(challengeId);
  });

  document.getElementById("completeChallengeForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const challengeId = document.getElementById("completeChallengeId")?.value;
    const details = document.getElementById("challengeDetails")?.value || "";
    if (!challengeId || details.trim() === "") return;
    completeChallenge(challengeId, details.trim());
  });

  document.getElementById("createChallengeForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const description = document.getElementById("challengeDescription")?.value?.trim();
    const pointsValue = Number(document.getElementById("challengePoints")?.value);
    if (!description || !pointsValue || pointsValue <= 0) return;
    createChallenge(description, pointsValue);
  });
}

function loadPageData() {
  fetchMethod(currentUrl + "/api/challenges/overview", onOverviewLoaded, "GET", null, token);
}

function onOverviewLoaded(status, data) {
  if (status !== 200) {
    allChallenges = [];
    completedChallenges = [];
    completions = [];
    userPoints = 0;
    tryRender();
    return;
  }

  allChallenges = data?.data?.challenges || [];
  completions = data?.data?.completions || [];
  userPoints = data?.data?.user?.points ?? 0;
  completedChallenges = [];
  allChallenges = allChallenges.filter((c) => {
    for (const comp of completions) {
      if (comp.challenge_id === c.id) {
        completedChallenges.push(c);
        return false;
      }
    }
    return true;
  });
  tryRender();
}

function tryRender() {
  if (!allChallenges || !completedChallenges || !completions || userPoints === null) return;

  renderStats(userPoints, allChallenges.length, completedChallenges.length);
  renderChallenges(allChallenges);
  renderProgress(completedChallenges);
}

function renderStats(points, activeCount, completedCount) {
  const values = document.querySelectorAll(".challenge-stats .stat-value");
  if (values.length >= 3) {
    values[0].textContent = points;
    values[1].textContent = activeCount;
    values[2].textContent = completedCount;
  }
}

function renderChallenges(challenges) {
  const listEl = document.getElementById("activeChallengeList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!challenges.length) {
    listEl.innerHTML = `<p class="text-center">No active challenges.</p>`;
    return;
  }

  challenges.forEach((challenge) => {
    const card = document.createElement("div");
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${challenge.description}</h5>
          <p class="card-text mb-3">Points: ${challenge.points}</p>
          <button class="btn btn-primary btn-sm complete-challenge-btn" data-id="${challenge.id}">
            Complete
          </button>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

function renderProgress(challenges) {
  const listEl = document.getElementById("completedChallengeList");
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!challenges.length) {
    listEl.innerHTML = `<p class="text-center">No completed challenges yet.</p>`;
    return;
  }

  const completionMap = completions.reduce((map, c) => {
    map[c.challenge_id] = c;
    return map;
  }, {});

  challenges.forEach((challenge) => {
    const completion = completionMap[challenge.id];
    const details = completion?.details || "Completed";
    const card = document.createElement("div");
    card.className = "col-xl-4 col-lg-6 col-md-12 p-3";
    card.innerHTML = `
      <div class="card city-card h-100">
        <div class="card-body">
          <h5 class="card-title">${challenge.description}</h5>
          <p class="card-text mb-1">Points: ${challenge.points}</p>
          <p class="card-text mb-0">Notes: ${details}</p>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });
}


function createChallenge(description, points) {
  const data = { description, points };
  const callback = (status, response) => {
    if (status === 201) {
      const challenge = response?.data?.challenge || {
        id: response?.data?.id,
        description,
        points,
      };
      if (challenge?.id == null) return;
      if (!allChallenges) allChallenges = [];
      if (!completedChallenges) completedChallenges = [];
      allChallenges.push(challenge);
      tryRender();
      const form = document.getElementById("createChallengeForm");
      if (form) form.reset();
      if (typeof showToast === "function") {
        showToast("Challenge created.", true);
      }
    } else {
      if (typeof showToast === "function") {
        showToast(response?.message || "Failed to create challenge.", false);
      } else {
        alert(response?.message || "Failed to create challenge.");
      }
    }
  };

  fetchMethod(currentUrl + "/api/challenges", callback, "POST", data, token);
}

function openCompletionModal(challengeId) {
  const idInput = document.getElementById("completeChallengeId");
  const detailsInput = document.getElementById("challengeDetails");
  const modalEl = document.getElementById("completeChallengeModal");
  if (!idInput || !detailsInput || !modalEl) return;

  idInput.value = challengeId;
  detailsInput.value = "";

  if (typeof showModal === "function") showModal("completeChallengeModal");
}

function completeChallenge(challengeId, details) {
  if (!challengeId || !details) return;
  const data = { details };
  const callback = (status, response) => {
    if (status === 201) {
      const completion = response?.data?.completion || {
        challenge_id: Number(challengeId),
        details: data.details,
      };
      completions.push(completion);

      const challengeIndex = allChallenges.findIndex((c) => String(c.id) === String(challengeId));
      if (challengeIndex >= 0) {
        const challenge = allChallenges[challengeIndex];
        userPoints += Number(challenge.points) || 0;
        allChallenges.splice(challengeIndex, 1);
        completedChallenges.push(challenge);
      }

      tryRender();
      if (typeof hideModal === "function") hideModal("completeChallengeModal");
      if (typeof showToast === "function") {
        showToast("Challenge completed.", true);
      }
    } else {
      if (typeof showToast === "function") {
        showToast(response?.message || "Failed to complete challenge.", false);
      } else {
        alert(response?.message || "Failed to complete challenge.");
      }
    }
  };

  fetchMethod(currentUrl + "/api/challenges/" + challengeId, callback, "POST", data, token);
}
