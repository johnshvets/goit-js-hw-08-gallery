import galleryImages from './gallery-items.js';

const refs = {
  galleryElement: document.querySelector('.js-gallery'),
  modalElement: document.querySelector('.js-lightbox'),
  closeModalBtn: document.querySelector('[data-action="close-lightbox"]'),
  backdrop: document.querySelector('.lightbox__overlay'),
  modalImage: document.querySelector('.lightbox__image'),
};
const imageElements = createImagesMarkup(galleryImages);

refs.galleryElement.insertAdjacentHTML('beforeend', imageElements);

refs.galleryElement.addEventListener('click', onGalleryClick);
refs.closeModalBtn.addEventListener('click', onModalClose);
refs.backdrop.addEventListener('click', onBackdropClick);

function createImagesMarkup(images) {
  return images
    .map(
      ({ original, preview, description }) =>
        `<li class="gallery__item"> 
      <a class="gallery__link" href=${original}> 
      <img class="gallery__image" src=${preview} 
      data-source=${original} alt=${description} />
      </a></li>`,
    )
    .join('');
}

function onGalleryClick(event) {
  event.preventDefault();
  const isGalleryImage = event.target.classList.contains('gallery__image');
  if (!isGalleryImage) return;

  const srcImageAttribute = event.target.getAttribute('data-source');
  const altImageAttribute = event.target.getAttribute('alt');

  onModalOpen();
  changeImageAttributes(srcImageAttribute, altImageAttribute);
}

function onModalOpen() {
  window.addEventListener('keydown', onEskKeyDown);
  window.addEventListener('keydown', onControlKeyDown);

  refs.modalElement.classList.add('is-open');
}

function onModalClose() {
  window.removeEventListener('keydown', onEskKeyDown);
  window.removeEventListener('keydown', onControlKeyDown);

  refs.modalElement.classList.remove('is-open');
  refs.modalImage.removeAttribute('src');
  refs.modalImage.removeAttribute('alt');
}

function changeImageAttributes(src, alt) {
  refs.modalImage.setAttribute('src', src);
  refs.modalImage.setAttribute('alt', alt);
}

function onBackdropClick(event) {
  if (event.target === event.target) onModalClose();
}

function onEskKeyDown(event) {
  const isEscKey = event.code === 'Escape';
  if (isEscKey) onModalClose();
}

function onControlKeyDown(event) {
  const isArrowRight = event.code === 'ArrowRight';
  const isArrowLeft = event.code === 'ArrowLeft';

  let currentImageIndex = galleryImages.findIndex(
    image => image.original === refs.modalImage.src,
  );

  if (isArrowRight) {
    currentImageIndex === galleryImages.length - 1
      ? (currentImageIndex = 0)
      : (currentImageIndex += 1);
  } else if (isArrowLeft) {
    currentImageIndex === 0
      ? (currentImageIndex = galleryImages.length - 1)
      : (currentImageIndex -= 1);
  } else return;

  const newSrc = galleryImages[currentImageIndex].original;
  const newAlt = galleryImages[currentImageIndex].description;

  changeImageAttributes(newSrc, newAlt);
}
