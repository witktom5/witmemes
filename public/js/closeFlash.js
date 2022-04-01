const flashBtn = document.querySelector('.btn-flash');
function closeFlash() {
  flashBtn.click();
}
if (flashBtn) {
  setTimeout(closeFlash, 3500);
}
