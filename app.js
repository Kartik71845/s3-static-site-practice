// Carousel logic - FIXED left arrow bug and streamlined navigation
(function () {
  const slidesContainer = document.getElementById('slidesContainer');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const dots = document.querySelectorAll('.dot');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const currentSlideSpan = document.getElementById('current-slide');
  const totalSlidesSpan = document.getElementById('total-slides');
  const AUTO_TIME = 8000; // 8 seconds

  let currentSlide = 0;
  let autoTimer = null;
  let userInteracting = false;

  totalSlidesSpan.textContent = totalSlides;

  /* ---------------- Core Navigation ---------------- */
  function updateUI(index) {
    currentSlideSpan.textContent = index + 1;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goToSlide(index) {
    // Normalise index to 0..totalSlides-1 using modulo to avoid boundary bugs
    index = (index + totalSlides) % totalSlides;
    currentSlide = index;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    updateUI(index);
    resetProgressBar();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  /* ---------------- Auto-Advance & Progress Bar ---------------- */
  function startAutoAdvance() {
    if (userInteracting) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, AUTO_TIME);
    startProgressBar();
  }

  function stopAutoAdvance() {
    clearInterval(autoTimer);
    pauseProgressBar();
  }

  function startProgressBar() {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth; // reflow
    progressFill.style.transition = `width ${AUTO_TIME}ms linear`;
    progressFill.style.width = '100%';
  }

  function resetProgressBar() {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    if (!userInteracting) {
      requestAnimationFrame(() => startProgressBar());
    }
  }

  function pauseProgressBar() {
    const computedWidth = getComputedStyle(progressFill).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  }

  /* ---------------- User Interaction Helpers ---------------- */
  function registerInteraction(callback) {
    userInteracting = true;
    stopAutoAdvance();
    callback();
    setTimeout(() => {
      userInteracting = false;
      startAutoAdvance();
    }, 3000);
  }

  /* ---------------- Event Listeners ---------------- */
  nextBtn.addEventListener('click', () => registerInteraction(nextSlide));
  prevBtn.addEventListener('click', () => registerInteraction(prevSlide));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => registerInteraction(() => goToSlide(i)));
  });

  // Swipe support
  let touchStartX = 0;
  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      registerInteraction(diff > 0 ? prevSlide : nextSlide);
    }
  }, { passive: true });

  // Hover (desktop)
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
  carouselContainer.addEventListener('mouseleave', () => {
    if (!userInteracting) startAutoAdvance();
  });

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') registerInteraction(prevSlide);
    if (e.key === 'ArrowRight') registerInteraction(nextSlide);
  });

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoAdvance();
    else if (!userInteracting) startAutoAdvance();
  });

  /* ---------------- Download Current Slide ---------------- */
  function downloadCurrentSlide() {
    const slideEl = slides[currentSlide];
    const filename = `S3-carousel-slide-${currentSlide + 1}.png`;

    // Hide UI overlays for clean snapshot
    const uiElems = document.querySelectorAll('.slide-counter, .nav-arrow, .nav-dots, .progress-bar, .download-btn');
    uiElems.forEach(el => el.style.visibility = 'hidden');

    html2canvas(slideEl, { scale: 2, backgroundColor: null }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => console.error(err)).finally(() => {
      uiElems.forEach(el => el.style.visibility = '');
    });
  }

  downloadBtn.addEventListener('click', downloadCurrentSlide);

  /* ---------------- Init ---------------- */
  goToSlide(0);
  startAutoAdvance();
})();