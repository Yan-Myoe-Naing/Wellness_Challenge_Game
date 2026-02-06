document.addEventListener("DOMContentLoaded", function () {


// callback.
  const callback = (responseStatus, responseData) => {
    if (responseStatus == 200) {
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        window.location.href = "profile.html";
      }
    } else {
      warningCard.classList.remove("d-none");
      warningText.innerText = responseData.message;
    }
  };

  const loginForm = document.getElementById("loginForm");

  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!/^[A-Za-z0-9]{3,20}$/.test(username)) {
      warningCard.classList.remove("d-none");
      warningText.innerText = "Username must be 3-20 characters (letters and numbers only).";
      return;
    }
    if (String(password).length < 4) {
      warningCard.classList.remove("d-none");
      warningText.innerText = "Password must be at least 4 characters.";
      return;
    }

    const data = {
      username: username,
      password: password,
    };
    fetchMethod(currentUrl + "/api/auth/login", callback, "POST", data);

    loginForm.reset();
  });
});
