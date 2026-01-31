function showModal(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap) return;
  const modal = window.bootstrap.Modal.getOrCreateInstance(el);
  modal.show();
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap) return;
  const modal = window.bootstrap.Modal.getInstance(el) || window.bootstrap.Modal.getOrCreateInstance(el);
  modal.hide();
}
