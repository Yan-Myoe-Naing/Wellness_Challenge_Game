console.log("registerUser.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Signup button clicked");

    const username = document.getElementById("username").value;
    const city_name = document.getElementById("city_name").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


console.log("Username:", username);
console.log("City Name:", city_name);
console.log("Password:", password);

    // Perform signup logic
    if (password === confirmPassword) {
      // Passwords match, proceed with signup
      console.log("Signup successful");
      console.log("Username:", username);
      console.log("City Name:", city_name);
      console.log("Password:", password);
      warningCard.classList.add("d-none");

      const data = {
        username: username,
        password: password,
        city_name: city_name
      };

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          // Check if signup was successful
          if (responseData.token) {
            // Store the token in local storage
            localStorage.setItem("token", responseData.token);
            // Redirect or perform further actions for logged-in user
            window.location.href = "profile.html";
          }
        } else {
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };
console.log("currentUrl:", currentUrl);
      // Perform signup request
      fetchMethod(currentUrl + "/api/auth/register", callback, "POST", data);

      // Reset the form fields
      signupForm.reset();
    } else {
      // Passwords do not match, handle error
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});