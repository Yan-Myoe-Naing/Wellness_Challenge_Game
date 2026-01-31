document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const challengeNav = document.getElementById("challengeNav");
  const cityNav = document.getElementById("cityNav");
  const diplomacyNav = document.getElementById("diplomacyNav");
  const usersNav = document.getElementById("usersNav");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, show profile button and hide login and register buttons
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
    challengeNav?.classList.remove("d-none");
    cityNav?.classList.remove("d-none");
    diplomacyNav?.classList.remove("d-none");
    usersNav?.classList.remove("d-none");
  } else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
    profileButton.classList.add("d-none");
    logoutButton.classList.add("d-none");
    challengeNav?.classList.add("d-none");
    cityNav?.classList.add("d-none");
    diplomacyNav?.classList.add("d-none");
    usersNav?.classList.add("d-none");
  }

  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to index.html
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
