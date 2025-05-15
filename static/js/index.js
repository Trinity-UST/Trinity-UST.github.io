/* index.js — consolidated, defensive version */
'use strict';

/* --------------------------------------------------
 * Global settings
 * -------------------------------------------------- */
window.HELP_IMPROVE_VIDEOJS = false;

/* --------------------------------------------------
 * Interpolation image slider
 * -------------------------------------------------- */
const INTERP_BASE = './static/interpolation/stacked';
const NUM_INTERP_FRAMES = 9;
const interpImages = [];

function preloadInterpolationImages() {
  for (let i = 1; i < NUM_INTERP_FRAMES; i++) {
    const path = `${INTERP_BASE}/${String(i).padStart(6, '0')}.jpg`;
    const img = new Image();
    img.src = path;
    interpImages[i] = img;
  }
}

function setInterpolationImage(i) {
  const img = interpImages[i];
  if (!img) return;
  img.ondragstart = () => false;
  img.oncontextmenu = () => false;
  $('#interpolation-image-wrapper').empty().append(img);
}

/* --------------------------------------------------
 * Navbar burger (Bulma)
 * -------------------------------------------------- */
function initNavbarBurger() {
  $('.navbar-burger').on('click', () => {
    $('.navbar-burger, .navbar-menu').toggleClass('is-active');
  });
}

/* --------------------------------------------------
 * Bulma carousel
 * -------------------------------------------------- */
function initBulmaCarousel() {
  const options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  const carousels = bulmaCarousel.attach('.carousel', options);

  carousels.forEach(c => {
    c.on('before:show', state => {
      console.debug('carousel before:show', state);
    });
  });

  const myEl = document.querySelector('#my-element');
  if (myEl?.bulmaCarousel) {
    myEl.bulmaCarousel.on('before-show', state => {
      console.debug('single carousel before-show', state);
    });
  }
}

/* --------------------------------------------------
 * Interpolation slider
 * -------------------------------------------------- */
function initInterpolationSlider() {
  const $slider = $('#interpolation-slider');
  if ($slider.length === 0) return;

  $slider.on('input', function () {
    setInterpolationImage(this.value);
  });

  setInterpolationImage(0);
  $slider.prop('max', NUM_INTERP_FRAMES - 1);
}

/* --------------------------------------------------
 * Action carousel (horizontal scroll by buttons)
 * -------------------------------------------------- */
function initActionCarousel() {
  const track = document.getElementById('action-carousel');
  if (!track) return;

  const items = [...track.querySelectorAll('.action-item')];
  if (!items.length) return;

  const GAP = 40;
  const itemWidth = items[0].offsetWidth;

  const pad = () => {
    const side = (track.parentElement.clientWidth - itemWidth) / 2;
    track.style.paddingLeft = `${side}px`;
    track.style.paddingRight = `${side}px`;
  };
  pad();
  window.addEventListener('resize', pad);

  const step = () => itemWidth + GAP;
  let idx = 0;

  const scrollToIdx = (i, behavior = 'smooth') => {
    idx = (i + items.length) % items.length;
    track.scrollTo({ left: idx * step(), behavior });
  };

  document.querySelectorAll('.action-prev').forEach(b =>
    b.addEventListener('click', () => scrollToIdx(idx - 1))
  );
  document.querySelectorAll('.action-next').forEach(b =>
    b.addEventListener('click', () => scrollToIdx(idx + 1))
  );

  scrollToIdx(0, 'auto');
}

/* --------------------------------------------------
 * Entry point
 * -------------------------------------------------- */
$(document).ready(() => {
  initNavbarBurger();
  initBulmaCarousel();

  preloadInterpolationImages();
  initInterpolationSlider();

  initActionCarousel();

  bulmaSlider.attach();
});