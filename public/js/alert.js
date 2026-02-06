

// setAlertState.
function setAlertState({ message, title, loading }) {
  const overlay = document.getElementById("alertOverlay");
  const titleEl = document.getElementById("alertTitle");
  const messageEl = document.getElementById("alertMessage");
  const closeBtn = document.getElementById("alertClose");
  const spinner = document.getElementById("alertSpinner");
  if (!overlay || !titleEl || !messageEl || !closeBtn) return;

  titleEl.textContent = title || "Notice";
  messageEl.textContent = message || "";
  overlay.classList.add("show");

  if (spinner) spinner.classList.toggle("show", !!loading);
  closeBtn.classList.toggle("d-none", !!loading);

  closeBtn.onclick = () => {
    overlay.classList.remove("show");
  };
}



// showAlert.
function showAlert(message, title) {
  setAlertState({ message, title, loading: false });
}



// showAlertLoading.
function showAlertLoading(message, title) {
  setAlertState({ message, title, loading: true });
}
