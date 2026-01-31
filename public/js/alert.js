function showAlert(message, title) {
  const overlay = document.getElementById("alertOverlay");
  const titleEl = document.getElementById("alertTitle");
  const messageEl = document.getElementById("alertMessage");
  const closeBtn = document.getElementById("alertClose");
  if (!overlay || !titleEl || !messageEl || !closeBtn) return;

  titleEl.textContent = title || "Notice";
  messageEl.textContent = message || "";
  overlay.classList.add("show");

  const close = () => {
    overlay.classList.remove("show");
    closeBtn.removeEventListener("click", close);
  };
  closeBtn.addEventListener("click", close);
}
