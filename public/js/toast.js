

// showToast.
function showToast(message, isSuccess) {
  const toastEl = document.getElementById("actionToast");
  const toastBody = document.getElementById("actionToastBody");
  if (!toastEl || !toastBody) return;

  toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-dark");
  toastEl.classList.add(isSuccess ? "text-bg-success" : "text-bg-danger");
  toastBody.textContent = message || "Action completed.";

  if (window.bootstrap) {
    const toast = new window.bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();
  }
}
