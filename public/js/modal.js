

// showModal.
function showModal(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap) return;
  const modal = window.bootstrap.Modal.getOrCreateInstance(el);
  modal.show();
}



// hideModal.
function hideModal(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap) return;
  const modal = window.bootstrap.Modal.getInstance(el) || window.bootstrap.Modal.getOrCreateInstance(el);
  modal.hide();
}



// buildModal.
function buildModal({ id, title, bodyHtml, footerHtml, dialogClass }) {
  if (!id) return;
  if (document.getElementById(id)) return;
  const root = document.getElementById("modalRoot") || document.body;
  const labelId = `${id}Label`;
  const dialogClasses = ["modal-dialog", "modal-dialog-centered", dialogClass]
    .filter(Boolean)
    .join(" ");
  const modalEl = document.createElement("div");
  modalEl.className = "modal fade";
  modalEl.id = id;
  modalEl.tabIndex = -1;
  modalEl.setAttribute("aria-labelledby", labelId);
  modalEl.setAttribute("aria-hidden", "true");
  modalEl.innerHTML = `
    <div class="${dialogClasses}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${labelId}">${title || ""}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${bodyHtml || ""}
        </div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ""}
      </div>
    </div>
  `;
  root.appendChild(modalEl);
}
