document.addEventListener("DOMContentLoaded", function () {
  navbarHTML = `<nav class="navbar navbar-expand-lg navbar-dark nav-glass">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
        <img src="https://raw.githubusercontent.com/YanMyoeNaing/website_assets/main/flame.gif" class="logo img-fluid" alt="Game logo" />
        <span class="brand-title">Conquest of Paradise</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="challengeNav" href="challenge.html">Challenges</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="cityNav" href="city.html">City</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="diplomacyNav" href="diplomacy.html">Diplomacy</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="usersNav" href="users.html">Users</a>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <a id="profileButton" href="/profile.html" class="nav-link">Profile</a>
          </li>
          <li class="nav-item">
            <a id="logoutButton" href="#" class="nav-link">Logout</a>
          </li>
          <li class="nav-item">
            <a id="loginButton" href="/login.html" class="nav-link">Login</a>
          </li>
          <li class="nav-item">
            <a id="registerButton" class="btn btn-primary btn-sm navbar-btn" href="/register.html">Register</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;

  document.getElementById("navbar").innerHTML = navbarHTML;
});
