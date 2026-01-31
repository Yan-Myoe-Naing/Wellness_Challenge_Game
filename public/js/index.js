document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const titleEl = document.getElementById("homeTitle");
  const loginEl = document.getElementById("loginCta");

  if (!token) {
    if (titleEl) titleEl.textContent = "Welcome, Guest";
    if (loginEl) loginEl.classList.remove("d-none");
    return;
  }

  if (typeof window.currentUrl === "undefined") {
    window.currentUrl = window.location.origin;
  }
  if (window.currentUrl === "null") {
    return;
  }

  if (loginEl) loginEl.classList.add("d-none");
  fetchMethod(currentUrl + "/api/users/me", onUserLoaded, "GET", null, token);
});

function onUserLoaded(status, data) {
  if (status !== 200) return;
  const user = data?.data?.user;
  if (!user) return;

  const titleEl = document.getElementById("homeTitle");
  if (titleEl) titleEl.textContent = `Welcome, ${user.username || "Commander"}`;
}
