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

  bulmaCarousel.attach('.carousel', options);
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

  /* --------------------------------------------------
   * layout helpers
   * -------------------------------------------------- */
  const GAP       = 40;
  const itemWidth = () => items[0].offsetWidth;
  const step      = () => itemWidth() + GAP;

  const pad = () => {
    const side = (track.parentElement.clientWidth - itemWidth()) / 2;
    track.style.paddingLeft  = `${side}px`;
    track.style.paddingRight = `${side}px`;
  };
  pad();
  window.addEventListener('resize', pad);

  /* --------------------------------------------------
   * dot indicator
   * -------------------------------------------------- */
  const dotsBox = document.getElementById('action-dots');
  const dots = [];

  if (dotsBox) {
    items.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'action-dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => scrollToIdx(i));
      dotsBox.appendChild(dot);
      dots.push(dot);
    });
  }

  /* --------------------------------------------------
   * scroll helpers
   * -------------------------------------------------- */
  let idx = 0;

  const activateDot = (i) => {
    if (!dots.length) return;
    dots[idx].classList.remove('is-active');
    dots[i].classList.add('is-active');
  };

  const scrollToIdx = (i, behavior = 'smooth') => {
    const next = (i + items.length) % items.length;
    activateDot(next);
    idx = next;
    track.scrollTo({ left: next * step(), behavior });
  };

  track.addEventListener('scroll', () => {
    const current = Math.round(track.scrollLeft / step());
    if (current !== idx) {
      activateDot(current);
      idx = current;
    }
  });

  /* --------------------------------------------------
   * nav buttons
   * -------------------------------------------------- */
  document.querySelectorAll('.action-prev').forEach(btn =>
    btn.addEventListener('click', () => scrollToIdx(idx - 1))
  );
  document.querySelectorAll('.action-next').forEach(btn =>
    btn.addEventListener('click', () => scrollToIdx(idx + 1))
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