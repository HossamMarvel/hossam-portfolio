// ===== RESET PAGE ON LOAD (Clear State & Reset Position) =====
window.addEventListener('beforeunload', () => {
  localStorage.clear();
  sessionStorage.clear();
});

window.addEventListener('load', () => {
  // Reset to top
  window.scrollTo(0, 0);
  
  // Clear any stored state
  localStorage.clear();
  sessionStorage.clear();
  
  // Reset loader display
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "1";
  }
});

gsap.utils.toArray('.card, .power-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out'
  });
});

window.addEventListener("load", ()=>{
  gsap.to("#loader", {
    opacity:0,
    duration:1,
    delay:1,
    onComplete:()=> document.getElementById("loader").style.display="none"
  });

  gsap.from(".hero-text h1", {
    y:100,
    opacity:0,
    duration:1.2
  });
});

// ===== SOUND CONTROL =====
const hoverSound = new Audio('assets/hover.mp3');
const clickSound = new Audio('assets/click.mp3');
hoverSound.volume = 0.4;
clickSound.volume = 0.6;

['.card', '.power-card', '.enter-btn', '.cv-dock'].forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
});

// ===== GSAP ANIMATIONS =====
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-text h1', {
    y: 120,
    opacity: 0,
    duration: 1.4,
    ease: 'power4.out'
  });

  gsap.from('.hero-image img', {
    scale: 0.6,
    opacity: 0,
    duration: 1.4,
    delay: 0.3,
    ease: 'power4.out'
  });

  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section.children, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%'
      },
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power3.out'
    });
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(card, {
        rotateY: x / 15,
        rotateX: -y / 15,
        duration: 0.4
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6
      });
    });
  });
}

const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

function setMusicUI(playing){
  isPlaying = playing;
  musicBtn.classList.toggle('is-on', playing);
  musicBtn.classList.toggle('is-off', !playing);
  musicBtn.setAttribute('aria-pressed', String(playing));
  musicBtn.setAttribute('aria-label', playing ? 'Sound on (click to mute)' : 'Muted (click to unmute)');
}
setMusicUI(false);

musicBtn.addEventListener('click', async () => {
  if (!isPlaying) {
    try {
      await bgMusic.play();
      setMusicUI(true);
    } catch (err) {
      console.log('اضغط على الزر لتشغيل الموسيقى');
    }
  } else {
    bgMusic.pause();
    setMusicUI(false);
  }
});

const enterBtn = document.getElementById('enter-btn');
const originStory = document.getElementById('origin-story');

enterBtn.addEventListener('click', () => {
  const sectionTop = originStory.offsetTop;
  const sectionHeight = originStory.offsetHeight;
  const scrollTo = sectionTop - (window.innerHeight / 2) + (sectionHeight / 2);
  window.scrollTo({ top: scrollTo, behavior: 'smooth' });
});

const powerCards = document.querySelectorAll('.power-card');

powerCards.forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    const sectionTop = targetSection.offsetTop;
    const sectionHeight = targetSection.offsetHeight;
    const scrollTo = sectionTop - (window.innerHeight / 2) + (sectionHeight / 2);

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  });
});

// ================== ACTIVE FRAME (استثناء كروت الفيديو + PDF + IMAGE) ==================
const allCards = document.querySelectorAll('.card');
allCards.forEach(card => {
  card.addEventListener('click', () => {
    // ✅ ما نعملش active frame لكروت الفيديو و PDF والصور لأنها بتفتح مودال
    if (card.classList.contains('video-card')) return;
    if (card.classList.contains('pdf-card')) return;
    if (card.classList.contains('image-card')) return;

    allCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// ================== SLIDER NAV + DRAG ==================
document.querySelectorAll('.slider').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');

  function cardStep(){
    const card = track.querySelector('.card');
    if (!card) return 300;
    const gap = 20;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    startScrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const walk = (e.pageX - startX) * 1.1;
    track.scrollLeft = startScrollLeft - walk;
  });

  track.style.cursor = 'grab';
});

// ================== ✅ VIDEO MODAL (Blur Background) ==================
const vmodal = document.getElementById('video-modal');
const vmodalBg = document.getElementById('vmodal-bg');
const vmodalVideo = document.getElementById('vmodal-video');
const vmodalClose = document.getElementById('vmodal-close');

function openVideoModal(videoSrc, bgSrc){
  vmodal.classList.add('is-open');
  vmodal.setAttribute('aria-hidden', 'false');

  vmodalBg.style.backgroundImage = `url("${bgSrc || ''}")`;

  vmodalVideo.src = videoSrc;
  vmodalVideo.currentTime = 0;

  vmodalVideo.play().catch(()=>{});
  document.body.style.overflow = 'hidden';
}

function closeVideoModal(){
  vmodal.classList.remove('is-open');
  vmodal.setAttribute('aria-hidden', 'true');

  vmodalVideo.pause();
  vmodalVideo.removeAttribute('src');
  vmodalVideo.load();

  vmodalBg.style.backgroundImage = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();

    const videoSrc = card.getAttribute('href');
    const bgSrc = card.getAttribute('data-bg') || card.querySelector('img')?.src;
    const isMissingVideo = card.getAttribute('data-missing-video') === 'true';

    if (!videoSrc || videoSrc === '#' || isMissingVideo) return;

    openVideoModal(videoSrc, bgSrc);
  });
});

vmodalClose.addEventListener('click', closeVideoModal);

vmodal.addEventListener('click', (e) => {
  if (e.target === vmodal || e.target === vmodalBg) closeVideoModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && vmodal.classList.contains('is-open')) closeVideoModal();
});

// ================== ✅ PDF MODAL (Blur Background) ==================
const pmodal = document.getElementById('pdf-modal');
const pmodalBg = document.getElementById('pmodal-bg');
const pmodalIframe = document.getElementById('pmodal-iframe');
const pmodalClose = document.getElementById('pmodal-close');

function openPdfModal(pdfSrc, bgSrc){
  pmodal.classList.add('is-open');
  pmodal.setAttribute('aria-hidden', 'false');

  pmodalBg.style.backgroundImage = `url("${bgSrc || ''}")`;

  // عرض الـ PDF داخل الصفحة
  pmodalIframe.src = pdfSrc;

  document.body.style.overflow = 'hidden';
}

function closePdfModal(){
  pmodal.classList.remove('is-open');
  pmodal.setAttribute('aria-hidden', 'true');

  pmodalIframe.src = '';
  pmodalBg.style.backgroundImage = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.pdf-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();

    const pdfSrc = card.getAttribute('data-pdf') || card.getAttribute('href');
    const bgSrc = card.getAttribute('data-bg') || card.querySelector('img')?.src;

    openPdfModal(pdfSrc, bgSrc);
  });
});

pmodalClose.addEventListener('click', closePdfModal);

pmodal.addEventListener('click', (e) => {
  if (e.target === pmodal || e.target === pmodalBg) closePdfModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pmodal.classList.contains('is-open')) closePdfModal();
});

// ================== ✅ IMAGE MODAL (Blur Background) ==================
const imodal = document.getElementById('image-modal');
const imodalBg = document.getElementById('imodal-bg');
const imodalImage = document.getElementById('imodal-image');
const imodalClose = document.getElementById('imodal-close');

function openImageModal(imageSrc, bgSrc){
  imodal.classList.add('is-open');
  imodal.setAttribute('aria-hidden', 'false');

  imodalBg.style.backgroundImage = `url("${bgSrc || ''}")`;

  // عرض الصورة داخل الصفحة
  imodalImage.src = imageSrc;

  document.body.style.overflow = 'hidden';
}

function closeImageModal(){
  imodal.classList.remove('is-open');
  imodal.setAttribute('aria-hidden', 'true');

  imodalImage.src = '';
  imodalBg.style.backgroundImage = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.image-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();

    const imageSrc = card.getAttribute('data-image') || card.getAttribute('href');
    const bgSrc = card.getAttribute('data-bg') || card.querySelector('img')?.src;

    openImageModal(imageSrc, bgSrc);
  });
});

imodalClose.addEventListener('click', closeImageModal);

imodal.addEventListener('click', (e) => {
  if (e.target === imodal || e.target === imodalBg) closeImageModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imodal.classList.contains('is-open')) closeImageModal();
});
