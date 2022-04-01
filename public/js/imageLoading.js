window.addEventListener('load', (e) => {
  const images = document.querySelectorAll('img');
  for (let image of images) {
    const imageDiv = document.getElementById(image.dataset.id);
    const imageSpinner = document.getElementById(`spinner-${image.dataset.id}`);
    const isLoaded = image.complete && image.naturalHeight !== 0;
    if (isLoaded) {
      imageDiv.classList.remove('meme-loading');
      imageSpinner.remove();
    }
  }
});
