function toggleGallery(id) {
  const gallery = document.getElementById(id);
  gallery.classList.toggle("hidden");
}

// Popup Elements
const showIdBtn = document.getElementById("showIdBtn");
const idPopup = document.getElementById("idPopup");
const closeBtn = document.querySelector(".closeBtn");

// Show Popup
showIdBtn.addEventListener("click", () => {
  idPopup.style.display = "flex";
});

// Hide Popup on Close button click
closeBtn.addEventListener("click", () => {
  idPopup.style.display = "none";
});

// Hide Popup if clicked outside content
window.addEventListener("click", (e) => {
  if (e.target === idPopup) {
    idPopup.style.display = "none";
  }
});
