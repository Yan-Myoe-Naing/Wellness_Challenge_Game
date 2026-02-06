
document.addEventListener("DOMContentLoaded", initSignup);



// initSignup.
function initSignup() {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;
  signupForm.addEventListener("submit", handleSignupSubmit);
}



// handleSignupSubmit.
function handleSignupSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const city_name = document.getElementById("city_name").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!/^[A-Za-z0-9]{3,20}$/.test(username)) {
    showWarning("Username must be 3-20 characters (letters and numbers only).");
    return;
  }
  if (String(password).length < 4) {
    showWarning("Password must be at least 4 characters.");
    return;
  }
  if (password !== confirmPassword) {
    showWarning("Passwords do not match");
    return;
  }

  const data = { username, password, city_name };
  fetchMethod(currentUrl + "/api/auth/register", handleSignupResponse, "POST", data);
}



// handleSignupResponse.
function handleSignupResponse(responseStatus, responseData) {
  const token = responseData?.token;
  if ((responseStatus === 200 || responseStatus === 201) && token) {
    localStorage.setItem("token", token);
    window.location.href = "index.html";
  } else {
    showWarning(responseData?.message || "Signup failed");
  }
}



// showWarning.
function showWarning(message) {
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");
  warningCard.classList.remove("d-none");
  warningText.innerText = message;
}
