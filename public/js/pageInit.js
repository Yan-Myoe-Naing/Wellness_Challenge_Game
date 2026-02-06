// ensureTokenOrRedirect.
function ensureTokenOrRedirect(redirectTo) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = redirectTo || "login.html";
    return null;
  }
  return token;
}



// ensureBaseUrlOrWarn.
function ensureBaseUrlOrWarn() {
  if (typeof window.currentUrl === "undefined") {
    window.currentUrl = window.location.origin;
  }
  if (window.currentUrl === "null") {
    alert("Open this page via http://localhost:3000 (not file://).");
    return false;
  }
  return true;
}
