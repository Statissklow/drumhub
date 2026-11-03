/**
 * DrumHub - Modern Interactive Application Script
 * Features:
 * - Dynamic Ambient Studio Background Slider & Scroll Observer
 * - Realtime Studio Price Calculator & Preset Loader
 * - 1-Click Quote Transfer to Contact/Booking Form
 * - Equipment Rack Filtering
 * - Studio Photo Gallery & Lightbox (without fenster.JPG)
 * - GDPR Compliant 2-Click YouTube Player
 * - Mobile Navigation Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundSlider();
  initMobileNav();
  initBookingFormPrefill();
  initMagazineShowcase();
  initSoundArchitect();
  initSoundCatalog();
  initCalculator();
  initEquipmentFilter();
  initEquipmentAccordion();
  initHeroStatLinks();
  initServiceModal();
  initGalleryLightbox();
  initGdprVideo();
  initGdprMap();
  initGdprCalendar();
  initContactTabs();
});

function initBookingFormPrefill() {
  const savedRecipe = localStorage.getItem('drumhub_sound_recipe');
  const messageField = document.getElementById('form-message');
  if (savedRecipe && messageField) {
    messageField.value = savedRecipe;
    localStorage.removeItem('drumhub_sound_recipe');
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        messageField.focus();
      }, 400);
    }
  }
}

/* ==========================================================================
   Magazine Showcase Interactions & 1-Click Booking Package Handler
   ========================================================================== */
function initMagazineShowcase() {
  // 1. Quick Filter Bar
  const filterBtns = document.querySelectorAll('.magazine-filter-btn');
  const cards = document.querySelectorAll('.magazine-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.getAttribute('data-filter-card');
        if (targetId === 'all') {
          cards.forEach(c => {
            c.style.display = 'block';
          });
          const firstCard = document.querySelector('.magazine-card');
          if (firstCard) {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          const targetCard = document.getElementById(targetId);
          if (targetCard) {
            cards.forEach(c => {
              c.style.display = 'block';
            });
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetCard.classList.add('highlight-pulse');
            setTimeout(() => {
              targetCard.classList.remove('highlight-pulse');
            }, 1800);
          }
        }
      });
    });
  }

  // 2. Collapsible Drawers within Magazine Cards
  const drawerToggles = document.querySelectorAll('[data-toggle-drawer]');
  drawerToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const drawerId = btn.getAttribute('data-toggle-drawer');
      const drawer = document.getElementById(drawerId);
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        btn.classList.remove('open');
        const arrow = btn.querySelector('.arrow');
        if (arrow) arrow.textContent = '▾';
      } else {
        drawer.classList.add('open');
        btn.classList.add('open');
        const arrow = btn.querySelector('.arrow');
        if (arrow) arrow.textContent = '▴';
      }
    });
  });

  // 3. Vault Accordion Toggle at Bottom
  const vaultToggleBtn = document.getElementById('vault-toggle-btn');
  const vaultContent = document.getElementById('vault-content');
  const vaultArrow = document.getElementById('vault-toggle-arrow');

  if (vaultToggleBtn && vaultContent) {
    vaultToggleBtn.addEventListener('click', () => {
      const isOpen = vaultContent.classList.contains('open');
      if (isOpen) {
        vaultContent.classList.remove('open');
        vaultToggleBtn.setAttribute('aria-expanded', 'false');
        if (vaultArrow) vaultArrow.textContent = '▾';
      } else {
        vaultContent.classList.add('open');
        vaultToggleBtn.setAttribute('aria-expanded', 'true');
        if (vaultArrow) vaultArrow.textContent = '▴';

        const searchInput = document.getElementById('catalog-search-input');
        if (searchInput && window.innerWidth > 768) {
          setTimeout(() => searchInput.focus(), 250);
        }
      }
    });
  }
}

// Global 1-Click Booking Package Handler
window.bookSoundPackage = function(packageName) {
  const note = `Hallo Santino,\n\nich interessiere mich für das Sound-Paket aus deinem Studio-Magazin:\n👉 Paket: ${packageName}\n\nBitte melde dich bei mir bezüglich Terminoptionen und Verfügbarkeit für meine Recording-Session.`;
  try {
    localStorage.setItem('drumhub_sound_recipe', note);
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
  window.location.href = 'index.html#contact';
};

/* ==========================================================================
   1. Studio Background - Pure Scroll-Driven (No timer, calm and stable)
   ========================================================================== */
function initBackgroundSlider() {
  const slides = document.querySelectorAll('.bg-slide');
  if (!slides.length) return;

  let currentIndex = 0;

  function showSlide(index) {
    if (index === currentIndex && slides[index].classList.contains('active')) return;
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    currentIndex = index;
  }

  // Section to background slide mapping:
  const sectionSlideMap = {
    'hero': 0,            // Schlagzeug Start
    'lab-overview': 1,    // Doppel-Labor Video & Sound
    'sound-architect': 4, // Sound-Architekt & Grafik
    'klangkatalog': 5,    // Der umfassende Klangkatalog
    'showcase': 1,        // Video Showcase
    'studio': 2,          // Aufnahmeraum Gesamteindruck
    'services': 3,        // Regieplatz & Leistungen
    'calculator': 4,      // Analoge Röhren-Preamps & Rechner
    'equipment': 5,       // Audix Mikrofonie & High-End Technik
    'gallery': 6,         // Studio Lounge & Einblicke
    'contact': 7          // Akustikwand & Kontakt
  };

  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id && sectionSlideMap[id] !== undefined) {
            showSlide(sectionSlideMap[id]);
          }
        }
      });
    }, {
      rootMargin: '-10% 0px -35% 0px',
      threshold: 0.15
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   2. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* ==========================================================================
   3. Interactive Studio Price Calculator
   ========================================================================== */
function initCalculator() {
  const state = {
    roomType: 'hours',
    hours: 2,
    drums: 'standard',
    micsCount: 0,
    preampSetup: 'none',
    cameraSetup: 'none',
    extraCams: 0,
    operator: false,
    postprod: 'none',
    discountActive: false
  };

  const RATES = {
    roomPerHour: 30,
    roomHalfDay: 110,
    roomFullDay: 200,
    drumsStandard: 0,
    drumsStudioChange: 35,
    drumsOwnSet: 50,
    micSingle: 3,
    preampSingle: 8,
    preampTriple: 15,
    camFHD: 25,
    cam4K: 30,
    cam6K: 40,
    camExtra: 8,
    operatorBase: 50,
    operatorPerHour: 50,
    postSync: 35,
    postAudio: 65,
    postFull: 160
  };

  const roomButtons = document.querySelectorAll('[data-calc-room]');
  const hoursGroup = document.getElementById('calc-hours-group');
  const hoursSlider = document.getElementById('calc-hours');
  const hoursDisplay = document.getElementById('calc-hours-val');
  
  const drumsButtons = document.querySelectorAll('[data-calc-drums]');
  const preampButtons = document.querySelectorAll('[data-calc-preamp]');
  const camButtons = document.querySelectorAll('[data-calc-cam]');
  const postButtons = document.querySelectorAll('[data-calc-post]');
  
  const extraCamsSlider = document.getElementById('calc-extra-cams');
  const extraCamsDisplay = document.getElementById('calc-extra-cams-val');
  const micsSlider = document.getElementById('calc-mics');
  const micsDisplay = document.getElementById('calc-mics-val');

  const operatorCheck = document.getElementById('calc-operator');
  const discountCheck = document.getElementById('calc-discount');

  const summaryList = document.getElementById('calc-summary-list');
  const totalPriceEl = document.getElementById('calc-total-price');
  const transferBtn = document.getElementById('calc-transfer-btn');

  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.roomType = btn.dataset.calcRoom;
      
      if (state.roomType === 'halfday') {
        state.hours = 4;
        if (hoursGroup) hoursGroup.style.display = 'none';
      } else if (state.roomType === 'fullday') {
        state.hours = 8;
        if (hoursGroup) hoursGroup.style.display = 'none';
      } else {
        if (hoursGroup) hoursGroup.style.display = 'block';
        state.hours = parseInt(hoursSlider.value, 10);
      }
      recalculate();
    });
  });

  if (hoursSlider) {
    hoursSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.hours = val;
      if (hoursDisplay) hoursDisplay.textContent = val + ' Std.';
      recalculate();
    });
  }

  drumsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      drumsButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.drums = btn.dataset.calcDrums;
      recalculate();
    });
  });

  preampButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      preampButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.preampSetup = btn.dataset.calcPreamp;
      recalculate();
    });
  });

  camButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      camButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.cameraSetup = btn.dataset.calcCam;
      recalculate();
    });
  });

  postButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      postButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.postprod = btn.dataset.calcPost;
      recalculate();
    });
  });

  if (extraCamsSlider) {
    extraCamsSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.extraCams = val;
      if (extraCamsDisplay) extraCamsDisplay.textContent = '+' + val;
      recalculate();
    });
  }

  if (micsSlider) {
    micsSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.micsCount = val;
      if (micsDisplay) micsDisplay.textContent = val;
      recalculate();
    });
  }

  if (operatorCheck) {
    operatorCheck.addEventListener('change', (e) => {
      state.operator = e.target.checked;
      recalculate();
    });
  }

  if (discountCheck) {
    discountCheck.addEventListener('change', (e) => {
      state.discountActive = e.target.checked;
      recalculate();
    });
  }

  document.querySelectorAll('[data-load-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.dataset.loadPreset;
      loadPackagePreset(preset);
      const calcSection = document.getElementById('calculator');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function loadPackagePreset(preset) {
    if (preset === 'basic') {
      setOption(roomButtons, 'data-calc-room', 'hours');
      if (hoursGroup) hoursGroup.style.display = 'block';
      if (hoursSlider) hoursSlider.value = 2;
      if (hoursDisplay) hoursDisplay.textContent = '2 Std.';
      state.roomType = 'hours';
      state.hours = 2;

      setOption(drumsButtons, 'data-calc-drums', 'standard');
      state.drums = 'standard';

      setOption(camButtons, 'data-calc-cam', 'fhd');
      state.cameraSetup = 'fhd';

      setOption(preampButtons, 'data-calc-preamp', 'none');
      state.preampSetup = 'none';

      if (extraCamsSlider) { extraCamsSlider.value = 0; extraCamsDisplay.textContent = '+0'; }
      state.extraCams = 0;

      if (operatorCheck) operatorCheck.checked = false;
      state.operator = false;
    } else if (preset === 'pro') {
      setOption(roomButtons, 'data-calc-room', 'halfday');
      if (hoursGroup) hoursGroup.style.display = 'none';
      state.roomType = 'halfday';
      state.hours = 4;

      setOption(drumsButtons, 'data-calc-drums', 'standard');
      state.drums = 'standard';

      setOption(camButtons, 'data-calc-cam', '4k');
      state.cameraSetup = '4k';

      setOption(preampButtons, 'data-calc-preamp', 'none');
      state.preampSetup = 'none';

      if (extraCamsSlider) { extraCamsSlider.value = 1; extraCamsDisplay.textContent = '+1'; }
      state.extraCams = 1;

      if (operatorCheck) operatorCheck.checked = false;
      state.operator = false;
    } else if (preset === 'ultimate') {
      setOption(roomButtons, 'data-calc-room', 'fullday');
      if (hoursGroup) hoursGroup.style.display = 'none';
      state.roomType = 'fullday';
      state.hours = 8;

      setOption(drumsButtons, 'data-calc-drums', 'standard');
      state.drums = 'standard';

      setOption(camButtons, 'data-calc-cam', '6k');
      state.cameraSetup = '6k';

      setOption(preampButtons, 'data-calc-preamp', 'triple');
      state.preampSetup = 'triple';

      if (extraCamsSlider) { extraCamsSlider.value = 3; extraCamsDisplay.textContent = '+3'; }
      state.extraCams = 3;

      if (operatorCheck) operatorCheck.checked = false;
      state.operator = false;
    }

    setOption(postButtons, 'data-calc-post', 'none');
    state.postprod = 'none';

    recalculate();
  }

  function setOption(buttonList, attribute, value) {
    buttonList.forEach(btn => {
      if (btn.getAttribute(attribute) === value) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  function recalculate() {
    const items = [];
    const h = state.hours;

    // Room
    let roomPrice = 0;
    let roomDesc = '';
    if (state.roomType === 'halfday') {
      roomPrice = RATES.roomHalfDay;
      roomDesc = 'Studio Raum-Miete (Halber Tag, 4h)';
    } else if (state.roomType === 'fullday') {
      roomPrice = RATES.roomFullDay;
      roomDesc = 'Studio Raum-Miete (Ganzer Tag, 8h)';
    } else {
      roomPrice = h * RATES.roomPerHour;
      roomDesc = `Studio Raum-Miete (${h} Std. × 30 €)`;
    }
    items.push({ name: roomDesc, price: roomPrice });

    // Drums & Percussion (Inklusive vs. Umbau)
    if (state.drums === 'standard') {
      items.push({ name: 'Studio-Set & Percussion aufgebaut (Inklusive)', price: 0 });
    } else if (state.drums === 'studio_change') {
      items.push({ name: 'Umbau anderes Studio-Set (1h Pauschale)', price: RATES.drumsStudioChange });
    } else if (state.drums === 'own_set') {
      items.push({ name: 'Eigenes Set: Komplett-Umbau & Mikrofonierung (1,5h Pauschale)', price: RATES.drumsOwnSet });
    }

    // Preamps
    if (state.preampSetup === 'single') {
      const price = h * RATES.preampSingle;
      items.push({ name: `High-End Preamp einzeln (${h}h × 8 €)`, price });
    } else if (state.preampSetup === 'triple') {
      const price = h * RATES.preampTriple;
      items.push({ name: `Preamp-Paket bis 3 Geräte (${h}h × 15 €)`, price });
    }

    // Mics
    if (state.micsCount > 0) {
      const price = h * state.micsCount * RATES.micSingle;
      items.push({ name: `${state.micsCount}x Mikrofone (${h}h × ${state.micsCount * 3} €)`, price });
    }

    // Cameras
    if (state.cameraSetup === 'fhd') {
      const price = h * RATES.camFHD;
      items.push({ name: `2 Kameras Full HD (${h}h × 25 €)`, price });
    } else if (state.cameraSetup === '4k') {
      const price = h * RATES.cam4K;
      items.push({ name: `2 Kameras 4K (${h}h × 30 €)`, price });
    } else if (state.cameraSetup === '6k') {
      const price = h * RATES.cam6K;
      items.push({ name: `2 Kameras 6K (${h}h × 40 €)`, price });
    }

    // Extra Cameras
    if (state.cameraSetup !== 'none' && state.extraCams > 0) {
      const totalCams = 2 + state.extraCams;
      const price = h * state.extraCams * RATES.camExtra;
      items.push({ name: `${state.extraCams}x zus. Kamera (Gesamt: ${totalCams} Cams gleichzeitig, ${h}h × ${state.extraCams * RATES.camExtra} €)`, price });
    }

    // Operator
    if (state.operator) {
      const price = RATES.operatorBase + (h * RATES.operatorPerHour);
      items.push({ name: `Kameramann / Video-Operator vor Ort (${RATES.operatorBase} € Pauschale + ${h}h × ${RATES.operatorPerHour} €)`, price });
    }

    // Postproduktion / Schnitt
    if (state.postprod === 'sync') {
      items.push({ name: 'Postproduktion Stufe 1: Timecode-Sync & Projekt-Setup', price: RATES.postSync });
    } else if (state.postprod === 'audio') {
      items.push({ name: 'Postproduktion Stufe 2: Drum-Mix & Audio-Mastering', price: RATES.postAudio });
    } else if (state.postprod === 'full') {
      items.push({ name: 'Postproduktion Stufe 3: Audio & Video Komplettpaket', price: RATES.postFull });
    }

    const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);

    let discount = 0;
    if (state.discountActive) {
      discount = Math.round(subtotal * 0.15);
      items.push({ name: '15% Einführungsrabatt', price: -discount, isDiscount: true });
    }

    const finalTotal = Math.max(0, subtotal - discount);
    renderSummary(items, finalTotal);
  }

  function renderSummary(items, total) {
    if (!summaryList || !totalPriceEl) return;

    summaryList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'summary-item-row' + (item.isDiscount ? ' discount' : '');
      const priceFormatted = item.isDiscount 
        ? `- ${Math.abs(item.price)} €` 
        : `${item.price} €`;
      li.innerHTML = `<span>${item.name}</span><span>${priceFormatted}</span>`;
      summaryList.appendChild(li);
    });

    totalPriceEl.textContent = `${total} €`;
  }

  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const messageField = document.getElementById('form-message');
      const contactSection = document.getElementById('contact');
      const slotSelect = document.getElementById('form-slot');
      const typeSelect = document.getElementById('form-type');

      if (slotSelect) {
        if (state.roomType === 'fullday') slotSelect.value = 'Ganzer Tag (ab 10:00 Uhr)';
        else if (state.roomType === 'halfday') slotSelect.value = 'Nachmittag (ab 14:00 Uhr)';
      }

      if (typeSelect) {
        if (state.postprod !== 'none') typeSelect.value = 'Postproduktion';
        else if (state.cameraSetup !== 'none') typeSelect.value = 'Musikvideo-Produktion';
        else typeSelect.value = 'Studiobuchung';
      }

      if (!messageField) return;

      const items = Array.from(summaryList.querySelectorAll('.summary-item-row')).map(row => {
        const text = row.querySelector('span:first-child')?.textContent || '';
        const val = row.querySelector('span:last-child')?.textContent || '';
        return `• ${text}: ${val}`;
      }).join('\n');

      const totalVal = totalPriceEl.textContent;

      const quoteText = 
`Hallo Santino & DrumHub Team,

ich interessiere mich für eine Studioaufnahme mit folgender Konfiguration:

${items}
----------------------------------------
Kalkulierte Gesamtsumme: ${totalVal}
(Hinweis: 100 € Kaution bei Self-Recording vor Ort zu hinterlegen)

Projektbeschreibung / Besonderheiten:
`;

      messageField.value = quoteText;

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        messageField.focus();
      }
    });
  }

  recalculate();
}

/* ==========================================================================
   4. Equipment Explorer Filtering
   ========================================================================== */
function initEquipmentFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.gear-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Studio Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'DrumHub Studio';
      }
      if (caption && lightboxCaption) {
        lightboxCaption.textContent = caption.textContent;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. GDPR Compliant 2-Click YouTube Loader
   ========================================================================== */
function initGdprVideo() {
  const activateBtn = document.getElementById('activate-video-btn');
  const videoContainer = document.getElementById('video-embed-container');
  const placeholder = document.getElementById('video-placeholder');

  if (!activateBtn || !videoContainer) return;

  activateBtn.addEventListener('click', () => {
    const videoId = activateBtn.dataset.videoId || 'cQYa82smLco';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
    iframe.setAttribute('title', 'DrumHub Studio Session');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('loading', 'lazy');

    if (placeholder) placeholder.style.display = 'none';
    videoContainer.appendChild(iframe);
  });
}

/* ==========================================================================
   7. Equipment Accordion (Compact & Expandable Tech Specs)
   ========================================================================== */
function initEquipmentAccordion() {
  const cards = document.querySelectorAll('.gear-card');
  cards.forEach(card => {
    const toggleBtn = card.querySelector('.gear-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.toggle('expanded');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.textContent = isExpanded ? 'Weniger anzeigen ▴' : 'Tech Specs ▾';
    });
  });
}

/* ==========================================================================
   8. Hero Stat Cards Filter Links
   ========================================================================== */
function initHeroStatLinks() {
  const statLinks = document.querySelectorAll('.hero-stats [data-filter-target]');
  statLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetFilter = link.dataset.filterTarget;
      if (targetFilter) {
        const tab = document.querySelector(`.filter-tab[data-filter="${targetFilter}"]`);
        if (tab) {
          tab.click();
        }
      }
    });
  });
}

/* ==========================================================================
   9. Service Detail Modal & Booking Workflow
   ========================================================================== */
function initServiceModal() {
  const modal = document.getElementById('service-detail-modal');
  if (!modal) return;

  const titleEl = document.getElementById('service-modal-title');
  const descEl = document.getElementById('service-modal-desc');
  const bulletsEl = document.getElementById('service-modal-bullets');
  const imgEl = document.getElementById('service-modal-img');
  const closeBtn = document.getElementById('service-modal-close');
  const dismissBtn = document.getElementById('service-modal-dismiss');
  const ctaBtn = document.getElementById('service-modal-cta');

  const serviceData = {
    video: {
      title: 'Musikvideos & Social Content',
      image: 'images/studio.jpg',
      desc: 'Von energetischen Drum-Play-Alongs über Album-Teaser bis zu hochqualitativem Instagram Reels & TikTok Content. Wir setzen deine Performance mit bis zu 8 synchronen Kameras gleichzeitig und variablen Studio-Hintergründen cinematisch in Szene.',
      bullets: [
        'Multi-Kamera Setup mit bis zu 8 Kameras gleichzeitig in 6K und 4K Ultra-HD inklusive dynamischen Slider-Fahrten',
        'Variable Studio-Kulissen: Akustik-Steinwand, Greenscreen oder stimmungsvolles Bühnen-Lighting',
        'Direkter Export von 16:9 (YouTube) und 9:16 (Instagram / TikTok) Formaten',
        'Eigenständiges DIY-Filmen (Plug & Play) oder erfahrener Video-Operator zubuchbar'
      ],
      preset: 'pro'
    },
    livestream: {
      title: 'Live-Streams & Video-Tutorials',
      image: 'images/preamps.jpg',
      desc: 'Übertrage Online-Masterclasses, exklusive Album-Listening-Sessions oder interaktive Drum-Workshops in professioneller Broadcast-Qualität direkt ins Internet.',
      bullets: [
        'Live-Bildmischung und synchroner Stereo-Master-Ton mit Null Latenz',
        'Perfekt für YouTube Live, Twitch, Zoom Masterclasses und Patreon Streamings',
        'Inklusive interaktivem Talkback und Monitoring für dich und deine Gäste',
        'Aufzeichnung aller Rohspuren für spätere Weiterverwertung im Videoschnitt'
      ],
      preset: 'pro'
    },
    postprod: {
      title: 'Postproduktion, Audio-Mix & Grading',
      image: 'images/splitset.jpg',
      desc: 'Gib deinen Sessions den finalen Schliff. Wir bieten professionellen Mehrspur-Audioschnitt, Drum-Mixing, Color Grading und Schnitt deiner Video-Aufnahmen.',
      bullets: [
        'Mehrspur-Audiobearbeitung: Phase Alignment, Transienten-Design & analoges Summing',
        'Professionelles Color Grading in DaVinci Resolve für den echten Kino-Look',
        'Sound-Optimierung nach modernsten Streaming-Standards (Spotify, Apple Music, YouTube)',
        'Lieferung fertiger Master-Dateien in allen gewünschten Formaten'
      ],
      preset: 'ultimate'
    },
    promo: {
      title: 'Vermarktungshilfen & Release-Strategie',
      image: 'images/eingangII.JPG',
      desc: 'Deine Musik verdient die maximale Aufmerksamkeit. Wir unterstützen dich bei der optimalen Verpackung und Veröffentlichung deines Contents.',
      bullets: [
        'Erstellung hochauflösender Thumbnails und Video-Teaser für Social Media',
        'Beratung zu Release-Timing, Hashtags, YouTube-SEO und Audience-Engagement',
        'Bereitstellung von Behind-the-Scenes Bild- und Videomaterial aus dem Studio',
        'Praxiserprobte Strategien für Musiker und Bands zur nachhaltigen Reichweitensteigerung'
      ],
      preset: 'basic'
    }
  };

  function openModal(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }

    if (bulletsEl) {
      bulletsEl.innerHTML = '';
      data.bullets.forEach(b => {
        const li = document.createElement('li');
        li.innerHTML = `<span>✓</span> <div>${b}</div>`;
        bulletsEl.appendChild(li);
      });
    }

    if (ctaBtn) {
      ctaBtn.onclick = () => {
        closeModal();
        const loadPresetBtn = document.querySelector(`[data-load-preset="${data.preset}"]`);
        if (loadPresetBtn) {
          loadPresetBtn.click();
        } else {
          const calcSec = document.getElementById('calculator');
          if (calcSec) calcSec.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.service;
      openModal(key);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.service);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. GDPR Compliant 2-Click Google Maps Loader & Route Planner
   ========================================================================== */
function initGdprMap() {
  const loadMapBtn = document.getElementById('load-map-btn');
  const mapContainer = document.getElementById('studio-map-frame');
  const placeholder = document.getElementById('map-consent-placeholder');

  if (!loadMapBtn || !mapContainer) return;

  loadMapBtn.addEventListener('click', () => {
    const embedUrl = 'https://maps.google.com/maps?q=DrumHub+Studio+Mannheim&t=&z=15&ie=UTF8&iwloc=&output=embed';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', embedUrl);
    iframe.setAttribute('title', 'DrumHub Studio Mannheim Anfahrt Google Maps');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('style', 'border:0; width:100%; height:100%;');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    if (placeholder) placeholder.style.display = 'none';
    mapContainer.style.display = 'block';
    mapContainer.appendChild(iframe);
  });
}

/* ==========================================================================
   11. GDPR Compliant 2-Click Google Calendar Embed
   ========================================================================== */
function initGdprCalendar() {
  const loadCalBtn = document.getElementById('load-cal-btn');
  const calContainer = document.getElementById('studio-calendar-frame');
  const placeholder = document.getElementById('calendar-consent-placeholder');

  if (!loadCalBtn || !calContainer) return;

  loadCalBtn.addEventListener('click', () => {
    // Google Kalender Embed URL (zeigt Wochen- / Tagesübersicht)
    const calUrl = 'https://calendar.google.com/calendar/embed?src=info%40santinoscavelli.de&ctz=Europe%2FBerlin&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', calUrl);
    iframe.setAttribute('title', 'DrumHub Studio Freie Termine Google Kalender');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('style', 'border:0; width:100%; height:100%; filter: invert(0.88) hue-rotate(180deg); border-radius: var(--radius-md);');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    if (placeholder) placeholder.style.display = 'none';
    calContainer.style.display = 'block';
    calContainer.appendChild(iframe);
  });
}

/* ==========================================================================
   12. Contact Tabs Switcher (Google Maps vs Google Kalender)
   ========================================================================== */
function initContactTabs() {
  const tabs = document.querySelectorAll('.contact-tab-btn');
  const panes = document.querySelectorAll('.contact-tab-pane');
  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const target = tab.dataset.contactTab;
      const targetPane = target === 'calendar' ? document.getElementById('pane-calendar') : document.getElementById('pane-map');
      if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.display = 'block';
      }
    });
  });
}





/* ==========================================================================
   13. Sound Architekt - Interaktiver Klang-Baukasten mit visueller Grafik
   ========================================================================== */
const SOUND_PRESETS = {
  cinematic: {
    name: 'Cinematic Tribal & Movie Impact',
    set: 'large',          // Tama Starclassic Maple 24"
    snare: 'signature',    // Santino Scavelli Signature Konzept 16×3
    snareLayers: ['smack'],
    kickLayers: ['subkick', 'sub_drop'],
    percussion: ['frame', 'surdos', 'effects'],
    hybrid: ['reverb'],
    preamp: 'subkick',
    desc: 'Monumentale 24" Tama Starclassic Maple Kick mit DIY Focal Subkick & 808-Drop, 16" Signature Snare w/ Meinl Smack Stack, Meinl Mizhars & Bahia Surdo.'
  },
  funk: {
    name: '70s Vintage Funk & Pocket',
    set: 'medium',         // Tama Rockstar 20"
    snare: 'alu',          // Tama S.L.P. Classic Dry Aluminum 14×5.5
    snareLayers: ['chingring'],
    kickLayers: ['subkick'],
    percussion: ['shakers', 'congas'],
    hybrid: ['prophet'],
    preamp: 'spl_tube',
    desc: 'Trockener Tama Rockstar 20" Funkpunch, Tama S.L.P. Aluminium Snare mit Meinl Ching Ring, Meinl Shaker und SPL GoldMike Röhrenwärme.'
  },
  pop: {
    name: 'Modern Radio Pop & Rock',
    set: 'studio',         // Tama Starclassic Performer 22"
    snare: 'bronze',       // Tama Brann Dailor Signature Bronze 14×6.5
    snareLayers: ['chingring', 'sensory'],
    kickLayers: ['subkick', 'roland_kick'],
    percussion: ['congas', 'shakers'],
    hybrid: ['prophet', 'sensory'],
    preamp: 'spl_tube',
    desc: 'Tama Starclassic Performer 22" Allrounder, Tama Bronze Snare w/ Evans Sensory Trigger, Roland Kick Trigger und Sequential Prophet-6 Synth.'
  },
  world: {
    name: 'Sphärische Weltmusik & Handpan',
    set: 'compact',        // Tama STAR Maple 18"
    snare: 'timbale_jingle', // Tama Holz Jingle Snare 10×3.5
    snareLayers: ['chingring'],
    kickLayers: ['bassbox'],
    percussion: ['handpan', 'steeltongue', 'kalimba', 'cajon'],
    hybrid: ['reverb'],
    preamp: 'clean',
    desc: 'Tama STAR Maple 18", Meinl Sonic Energy Handpan D-Kurd (10 Töne), Steel Tongue Drum, Kalimbas und Meinl Bass Box PBASSBOX.'
  },
  hybrid: {
    name: 'Hybrid Electro-Acoustic Lab',
    set: 'compact',        // Tama STAR Maple 18"
    snare: 'piccolo',      // Tama Maple Piccolo 13×3.5
    snareLayers: ['sensory', 'roland_snap'],
    kickLayers: ['subkick', 'sub_drop', 'roland_kick'],
    percussion: ['shakers'],
    hybrid: ['sensory', 'nord_drum', 'prophet', 'loupe'],
    preamp: 'warm_audio',
    desc: 'Evans Sensory Percussion 10-Zonen Trigger, Nord Drum 3P, Sequential Prophet-6, Behringer 808 Sub-Drop und Glou-Glou Loupé.'
  }
};

let architectState = {
  set: 'studio',
  snare: 'bronze',
  snareLayers: ['chingring'],
  kickLayers: ['subkick'],
  percussion: ['congas', 'shakers'],
  hybrid: ['prophet'],
  preamp: 'spl_tube'
};

function initSoundArchitect() {
  const container = document.getElementById('sound-architect');
  if (!container) return;

  // Preset Buttons
  const presetBtns = document.querySelectorAll('.architect-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.dataset.preset;
      if (SOUND_PRESETS[pKey]) {
        applyArchitectPreset(pKey);
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Drumset Chips (Single Select)
  const setChips = document.querySelectorAll('[data-architect-set]');
  setChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      architectState.set = chip.dataset.architectSet;
      updateArchitectVisualizer();
    });
  });

  // Snare Chips (Single Select)
  const snareChips = document.querySelectorAll('[data-architect-snare]');
  snareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      snareChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      architectState.snare = chip.dataset.architectSnare;
      updateArchitectVisualizer();
    });
  });

  // Snare Layering Multi-Select Pills
  const snareLayerPills = document.querySelectorAll('[data-snare-layer]');
  snareLayerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const layerId = pill.dataset.snareLayer;
      const idx = architectState.snareLayers.indexOf(layerId);
      if (idx > -1) {
        architectState.snareLayers.splice(idx, 1);
        pill.classList.remove('active');
      } else {
        architectState.snareLayers.push(layerId);
        pill.classList.add('active');
      }
      updateArchitectVisualizer();
    });
  });

  // Kick Layering Multi-Select Pills
  const kickLayerPills = document.querySelectorAll('[data-kick-layer]');
  kickLayerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const layerId = pill.dataset.kickLayer;
      const idx = architectState.kickLayers.indexOf(layerId);
      if (idx > -1) {
        architectState.kickLayers.splice(idx, 1);
        pill.classList.remove('active');
      } else {
        architectState.kickLayers.push(layerId);
        pill.classList.add('active');
      }
      updateArchitectVisualizer();
    });
  });

  // Percussion Multi-select Pills
  const percPills = document.querySelectorAll('[data-architect-perc]');
  percPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.dataset.architectPerc;
      const idx = architectState.percussion.indexOf(val);
      if (idx > -1) {
        architectState.percussion.splice(idx, 1);
        pill.classList.remove('selected');
        pill.classList.remove('active');
      } else {
        architectState.percussion.push(val);
        pill.classList.add('selected');
        pill.classList.add('active');
      }
      updateArchitectVisualizer();
    });
  });

  // Hybrid Multi-select Pills
  const hybridPills = document.querySelectorAll('[data-architect-hybrid]');
  hybridPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.dataset.architectHybrid;
      const idx = architectState.hybrid.indexOf(val);
      if (idx > -1) {
        architectState.hybrid.splice(idx, 1);
        pill.classList.remove('selected');
        pill.classList.remove('active');
      } else {
        architectState.hybrid.push(val);
        pill.classList.add('selected');
        pill.classList.add('active');
      }
      updateArchitectVisualizer();
    });
  });

  // Preamp Chips (Single Select)
  const preampChips = document.querySelectorAll('[data-architect-preamp]');
  preampChips.forEach(chip => {
    chip.addEventListener('click', () => {
      preampChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      architectState.preamp = chip.dataset.architectPreamp;
      updateArchitectVisualizer();
    });
  });

  // Transfer Button to Booking Form
  const transferBtn = document.getElementById('architect-transfer-btn');
  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      transferSoundRecipeToForm();
    });
  }

  // Interactive SVG Graphic Zones Direct Click System
  initInteractiveSvgZones();

  // Interactive Layering Console Tabs
  initStageInspectorTabs();

  // Wizard Multi-Step Navigation
  const stepItems = document.querySelectorAll('.wizard-step-item');
  const stepPanes = document.querySelectorAll('.wizard-pane');

  function goToStep(stepNum) {
    stepPanes.forEach((pane, idx) => {
      pane.classList.toggle('active', (idx + 1) === stepNum);
    });
    stepItems.forEach((item, idx) => {
      const stepIdx = idx + 1;
      item.classList.toggle('active', stepIdx === stepNum);
      item.classList.toggle('completed', stepIdx < stepNum);
    });
    // Scroll smoothly to top of wizard on mobile/small screens
    const progressEl = document.querySelector('.wizard-progress-container');
    if (progressEl) {
      progressEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = parseInt(item.dataset.stepTarget, 10);
      if (target) goToStep(target);
    });
  });

  document.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.nextStep, 10);
      if (next) goToStep(next);
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = parseInt(btn.dataset.prevStep, 10);
      if (prev) goToStep(prev);
    });
  });

  // Vault Collapsible Accordion
  const vaultToggleBtn = document.getElementById('vault-toggle-btn');
  const vaultContent = document.getElementById('vault-content');
  const vaultArrow = document.getElementById('vault-toggle-arrow');
  if (vaultToggleBtn && vaultContent) {
    vaultToggleBtn.addEventListener('click', () => {
      const isOpen = vaultContent.classList.toggle('open');
      vaultToggleBtn.setAttribute('aria-expanded', isOpen);
      if (vaultArrow) vaultArrow.textContent = isOpen ? '▴' : '▾';
    });
  }

  // Initial draw
  updateArchitectVisualizer();
}

function initInteractiveSvgZones() {
  const zones = document.querySelectorAll('.svg-clickable-zone');
  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      const zoneType = zone.dataset.zone;
      zones.forEach(z => z.classList.remove('active-zone'));
      zone.classList.add('active-zone');
      
      // Open the corresponding tab in the Stage Inspector
      openInspectorTab(zoneType);
    });
  });
}

function initStageInspectorTabs() {
  const tabBtns = document.querySelectorAll('.inspector-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.inspectorTab;
      openInspectorTab(targetTab);
    });
  });
}

function openInspectorTab(tabId) {
  const tabBtns = document.querySelectorAll('.inspector-tab-btn');
  const panes = document.querySelectorAll('.inspector-pane');

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.inspectorTab === tabId);
  });

  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === 'inspector-pane-' + tabId);
  });

  // Smooth scroll inspector into view if needed
  const inspector = document.getElementById('stage-inspector');
  if (inspector && window.innerWidth < 900) {
    inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function applyArchitectPreset(key) {
  const p = SOUND_PRESETS[key];
  if (!p) return;

  architectState.set = p.set;
  architectState.snare = p.snare;
  architectState.snareLayers = p.snareLayers ? [...p.snareLayers] : [];
  architectState.kickLayers = p.kickLayers ? [...p.kickLayers] : [];
  architectState.percussion = [...p.percussion];
  architectState.hybrid = [...p.hybrid];
  architectState.preamp = p.preamp;

  // Sync UI elements across page
  syncAllArchitectControls();
  updateArchitectVisualizer();
}

function syncAllArchitectControls() {
  // Sync Drumset
  document.querySelectorAll('[data-architect-set]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectSet === architectState.set);
  });
  // Sync Snare
  document.querySelectorAll('[data-architect-snare]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectSnare === architectState.snare);
  });
  // Sync Snare Layers
  document.querySelectorAll('[data-snare-layer]').forEach(pill => {
    pill.classList.toggle('active', architectState.snareLayers.includes(pill.dataset.snareLayer));
  });
  // Sync Kick Layers
  document.querySelectorAll('[data-kick-layer]').forEach(pill => {
    pill.classList.toggle('active', architectState.kickLayers.includes(pill.dataset.kickLayer));
  });
  // Sync Percussion
  document.querySelectorAll('[data-architect-perc]').forEach(pill => {
    const isAct = architectState.percussion.includes(pill.dataset.architectPerc);
    pill.classList.toggle('selected', isAct);
    pill.classList.toggle('active', isAct);
  });
  // Sync Hybrid
  document.querySelectorAll('[data-architect-hybrid]').forEach(pill => {
    const isAct = architectState.hybrid.includes(pill.dataset.architectHybrid);
    pill.classList.toggle('selected', isAct);
    pill.classList.toggle('active', isAct);
  });
  // Sync Preamp
  document.querySelectorAll('[data-architect-preamp]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectPreamp === architectState.preamp);
  });
}

function updateArchitectVisualizer() {
  // 1. Kick Diameter & Tama Model Label
  const kickRadiusMap = {
    compact: { r: 52, label: 'Tama STAR Maple 18"', sub: '18×14 Jazz & Besen' },
    medium: { r: 60, label: 'Tama Rockstar 20"', sub: '20×16 Funk & Pop' },
    studio: { r: 68, label: 'Tama Starclassic 22"', sub: '22×18 Studio Allrounder' },
    large: { r: 76, label: 'Tama Starclassic 24"', sub: '24×20 Cinematic Rock' }
  };
  const kickData = kickRadiusMap[architectState.set] || kickRadiusMap.studio;

  // 2. Snare color & Tama Model label
  const snareMap = {
    alu: { color: '#cbd5e1', label: 'Tama S.L.P. Dry Aluminum 14×5.5' },
    bronze: { color: '#f59e0b', label: 'Tama Brann Dailor Bronze 14×6.5' },
    vintage: { color: '#d97706', label: 'Tama Vintage Superstar 14×7' },
    piccolo: { color: '#fbbf24', label: 'Tama Maple Piccolo 13×3.5' },
    timbale_jingle: { color: '#a855f7', label: 'Tama Holz Jingle Snare 10×3.5' },
    signature: { color: '#ec4899', label: 'Santino Signature Snare 16×3' }
  };
  const snareData = snareMap[architectState.snare] || snareMap.bronze;

  // 3. Preamp color & label
  const preampMap = {
    clean: { label: 'MOTU 828es (Präzise 32-Spur Wandlung)', meter: 60 },
    spl_tube: { label: 'SPL GoldMike Mk2 (Diskrete Röhren-Wärme)', meter: 88 },
    warm_audio: { label: 'Warm Audio WA-273 / WA-412 (Neve/API)', meter: 95 },
    subkick: { label: 'DIY Focal Subkick & SPL Röhren-Kette', meter: 92 }
  };
  const preampData = preampMap[architectState.preamp] || preampMap.spl_tube;

  // 4. Update SVG Graphic elements
  const svg = document.getElementById('stage-svg');
  if (svg) {
    // Center Kick elements
    const kickCircle = svg.querySelector('#svg-kick-circle');
    const kickText = svg.querySelector('#svg-kick-text');
    const kickSubText = svg.querySelector('#svg-kick-subtext');

    if (kickCircle) {
      kickCircle.setAttribute('r', kickData.r);
    }
    if (kickText) {
      kickText.textContent = kickData.label;
    }
    if (kickSubText) {
      kickSubText.textContent = kickData.sub;
    }

    // Snare elements
    const snareCircle = svg.querySelector('#svg-snare-circle');
    const snareText = svg.querySelector('#svg-snare-text');

    if (snareCircle) {
      snareCircle.setAttribute('stroke', snareData.color);
      snareCircle.setAttribute('fill', snareData.color + '33');
    }
    if (snareText) {
      snareText.textContent = snareData.label.replace('Tama ', '');
    }

    // Snare Layer Overlays in SVG
    const layerChing = svg.querySelector('#svg-snare-layer-chingring');
    const layerSensory = svg.querySelector('#svg-snare-layer-sensory');
    const layerSmack = svg.querySelector('#svg-snare-layer-smack');

    if (layerChing) {
      const isAct = architectState.snareLayers.includes('chingring');
      layerChing.style.opacity = isAct ? '1' : '0';
      layerChing.style.pointerEvents = isAct ? 'auto' : 'none';
    }
    if (layerSensory) {
      const isAct = architectState.snareLayers.includes('sensory');
      layerSensory.style.opacity = isAct ? '1' : '0';
      layerSensory.style.pointerEvents = isAct ? 'auto' : 'none';
    }
    if (layerSmack) {
      const isAct = architectState.snareLayers.includes('smack');
      layerSmack.style.opacity = isAct ? '1' : '0';
      layerSmack.style.pointerEvents = isAct ? 'auto' : 'none';
    }

    // Kick Layer Overlays in SVG
    const kickSubkick = svg.querySelector('#svg-kick-layer-subkick');
    const kickTrigger = svg.querySelector('#svg-kick-layer-trigger');
    const kickSubwave = svg.querySelector('#svg-kick-layer-subwave');

    if (kickSubkick) {
      const isAct = architectState.kickLayers.includes('subkick');
      kickSubkick.style.opacity = isAct ? '1' : '0';
      kickSubkick.style.pointerEvents = isAct ? 'auto' : 'none';
    }
    if (kickTrigger) {
      const isAct = architectState.kickLayers.includes('roland_kick');
      kickTrigger.style.opacity = isAct ? '1' : '0';
      kickTrigger.style.pointerEvents = isAct ? 'auto' : 'none';
    }
    if (kickSubwave) {
      const isAct = architectState.kickLayers.includes('sub_drop');
      kickSubwave.style.opacity = isAct ? '1' : '0';
    }

    // Toggle Percussion Satellite visual nodes
    const percNodes = svg.querySelectorAll('[data-svg-perc]');
    percNodes.forEach(node => {
      const pId = node.dataset.svgPerc;
      const isActive = architectState.percussion.includes(pId);
      node.style.opacity = isActive ? '1' : '0.22';
      node.classList.toggle('svg-active-glow', isActive);
    });

    // Toggle Hybrid Satellite visual nodes
    const hybridNodes = svg.querySelectorAll('[data-svg-hybrid]');
    hybridNodes.forEach(node => {
      const hId = node.dataset.svgHybrid;
      const isActive = architectState.hybrid.includes(hId);
      node.style.opacity = isActive ? '1' : '0.22';
      node.classList.toggle('svg-active-glow', isActive);
    });

    // Preamp Node
    const preampText = svg.querySelector('#svg-preamp-text');
    if (preampText) {
      preampText.textContent = preampData.label;
    }
  }

  // 5. Calculate Sound Characteristics Radar
  let punch = 60;
  let warmth = 65;
  let room = 50;
  let hybridScore = 15;

  if (architectState.set === 'large') punch += 25;
  if (architectState.set === 'studio') punch += 15;
  if (architectState.set === 'compact') warmth += 15;

  if (architectState.snare === 'bronze' || architectState.snare === 'vintage') {
    punch += 15;
    warmth += 20;
  }
  if (architectState.snare === 'signature') {
    warmth += 25;
    room += 15;
  }

  // Layering bonuses
  if (architectState.kickLayers.includes('subkick')) {
    punch += 15;
    warmth += 10;
  }
  if (architectState.kickLayers.includes('sub_drop')) {
    hybridScore += 20;
    punch += 15;
  }
  if (architectState.snareLayers.includes('chingring')) {
    warmth += 10;
    room += 10;
  }
  if (architectState.snareLayers.includes('sensory')) {
    hybridScore += 25;
  }

  if (architectState.percussion.includes('handpan') || architectState.percussion.includes('steeltongue')) {
    warmth += 20;
    room += 25;
  }
  if (architectState.percussion.includes('frame') || architectState.percussion.includes('surdos')) {
    punch += 15;
    room += 20;
  }
  if (architectState.percussion.includes('cajon') || architectState.percussion.includes('congas')) {
    warmth += 15;
  }

  if (architectState.hybrid.includes('reverb') || architectState.hybrid.includes('loupe')) {
    room += 30;
    hybridScore += 25;
  }
  if (architectState.hybrid.includes('prophet') || architectState.hybrid.includes('sensory') || architectState.hybrid.includes('nord_drum')) {
    hybridScore += 35;
    punch += 10;
  }

  if (architectState.preamp === 'spl_tube' || architectState.preamp === 'warm_audio') {
    warmth += 20;
    punch += 10;
  }

  punch = Math.min(100, Math.max(25, punch));
  warmth = Math.min(100, Math.max(25, warmth));
  room = Math.min(100, Math.max(20, room));
  hybridScore = Math.min(100, Math.max(10, hybridScore));

  // Update Radar Bars
  const pBar = document.getElementById('radar-punch-fill');
  const pVal = document.getElementById('radar-punch-val');
  const wBar = document.getElementById('radar-warmth-fill');
  const wVal = document.getElementById('radar-warmth-val');
  const rBar = document.getElementById('radar-room-fill');
  const rVal = document.getElementById('radar-room-val');
  const hBar = document.getElementById('radar-hybrid-fill');
  const hVal = document.getElementById('radar-hybrid-val');

  if (pBar) pBar.style.width = punch + '%';
  if (pVal) pVal.textContent = punch + '%';
  if (wBar) wBar.style.width = warmth + '%';
  if (wVal) wVal.textContent = warmth + '%';
  if (rBar) rBar.style.width = room + '%';
  if (rVal) rVal.textContent = room + '%';
  if (hBar) hBar.style.width = hybridScore + '%';
  if (hVal) hVal.textContent = hybridScore + '%';

  // 6. Generate Recipe Text with Full Exact Brands & Layerings
  const snareLayerLabels = {
    chingring: 'Meinl Ching Ring (CRING)',
    smack: 'Meinl Vintage Smack Stack',
    sensory: 'Evans Sensory Percussion AI Trigger',
    roland_snap: 'Roland Dual-Trigger Snap'
  };

  const kickLayerLabels = {
    subkick: 'DIY Focal Polyflex 8 Subkick',
    sub_drop: 'Behringer Model D / 808 Sub-Drop',
    roland_kick: 'Roland RT-30K Hybrid Trigger',
    bassbox: 'Meinl Bass Box PBASSBOX'
  };

  const percLabels = {
    congas: 'Meinl Artist Congas & Bongos',
    frame: 'Meinl Tars & Mizhars',
    handpan: 'Meinl Sonic Energy Handpan D-Kurd',
    steeltongue: 'Meinl Octave Tongue Drum',
    kalimba: 'Meinl Sonic Energy Kalimbas',
    shakers: 'Meinl Shaker, Caxixis & Guiros',
    cajon: 'Meinl Artisan Cajon & Bass Box',
    surdos: 'Meinl Bahia Surdo 18"',
    effects: 'Meinl Regenmacher & Sea Drum'
  };

  const hybridLabels = {
    prophet: 'Sequential Prophet-6',
    nord_drum: 'Nord Drum 3P',
    sensory: 'Evans Sensory Percussion Portal',
    reverb: 'Empress Reverb & Echosystem',
    loupe: 'Glou-Glou Loupé Looper'
  };

  const activePercList = architectState.percussion.map(k => percLabels[k] || k);
  const activeHybridList = architectState.hybrid.map(k => hybridLabels[k] || k);

  let recipeParts = [];

  // Drumset & Kick Layering
  let kickLayerText = '';
  if (architectState.kickLayers && architectState.kickLayers.length) {
    const kNames = architectState.kickLayers.map(k => kickLayerLabels[k] || k);
    kickLayerText = ` [+ ${kNames.join(' & ')}]`;
  }
  recipeParts.push(`🥁 Drumset: ${kickData.label}${kickLayerText}`);

  // Snare & Snare Layering
  let snareLayerText = '';
  if (architectState.snareLayers && architectState.snareLayers.length) {
    const sNames = architectState.snareLayers.map(s => snareLayerLabels[s] || s);
    snareLayerText = ` [+ ${sNames.join(' & ')}]`;
  }
  recipeParts.push(`🎯 Snare: ${snareData.label}${snareLayerText}`);

  if (activePercList.length) recipeParts.push(`🪘 World Percussion: ${activePercList.join(', ')}`);
  if (activeHybridList.length) recipeParts.push(`🎹 Synthesizer & Hybrid: ${activeHybridList.join(', ')}`);
  recipeParts.push(`🎛️ Preamps: ${preampData.label}`);

  const recipeBox = document.getElementById('sound-recipe-text');
  if (recipeBox) {
    recipeBox.innerHTML = `<strong>Klang-Rezept:</strong> ${recipeParts.join(' • ')}`;
  }
}

function transferSoundRecipeToForm() {
  const container = document.getElementById('sound-architect');
  const recipeBox = container ? container.querySelector('#sound-recipe-text') : null;
  const messageField = document.getElementById('form-message');

  if (recipeBox) {
    const text = recipeBox.innerText;
    if (messageField) {
      // Direct transfer on the same page
      messageField.value = `[Gewünschtes Sound-Setup aus dem Klang-Labor]:\n${text}\n\nMeine Projekt-Details: `;
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      messageField.focus();
    } else {
      // Transfer from sound-lab.html to index.html#contact
      localStorage.setItem('drumhub_sound_recipe', `[Gewünschtes Sound-Setup aus dem Klang-Labor]:\n${text}\n\nMeine Projekt-Details: `);
      window.location.href = 'index.html#contact';
    }
  }
}

/* ==========================================================================
   14. Klangkatalog - Das umfassende DrumHub Instrumentarium & Sound Vault
   ========================================================================== */
const SOUND_CATALOG_DATA = [
  {
    "cat": "drumsets",
    "catLabel": "Drumsets",
    "name": "Tama STAR Maple (18 × 14, 12, 14)",
    "model": "Tama STAR Maple – 18×14 Bassdrum, 12×8 Tom, 14×14 Floor Tom",
    "sounds": "Offene Jazzsounds, kleine trockene Kick, resonante Ahorntoms, Besengrooves, leise feindynamische Begleitung.",
    "tags": [
      "Tama",
      "STAR Maple",
      "Jazz",
      "Trocken",
      "Besen",
      "Akustisch"
    ],
    "setTarget": "compact"
  },
  {
    "cat": "drumsets",
    "catLabel": "Drumsets",
    "name": "Tama Rockstar (20 × 16, 10, 12, 14)",
    "model": "Tama Rockstar – 20×16 Bassdrum, 10, 12 & 14 Toms",
    "sounds": "Kurze Funkkick, direkte Popsounds, knackige Toms, gedämpfte Retro-Grooves mit schnellem Punch.",
    "tags": [
      "Tama",
      "Rockstar",
      "Funk",
      "Pop",
      "Knackig",
      "Retro"
    ],
    "setTarget": "medium"
  },
  {
    "cat": "drumsets",
    "catLabel": "Drumsets",
    "name": "Tama Starclassic Performer Maple/Birch (22 × 18, 10, 12, 14, 16)",
    "model": "Tama Starclassic Performer Maple/Birch – 22×18 Bassdrum, 10, 12, 14 & 16 Toms",
    "sounds": "Vielseitige Pop- und Rockdrums, trockene tiefe Grooves, offene Fills, breite Raumaufnahmen für Studio-Alben.",
    "tags": [
      "Tama",
      "Starclassic Performer",
      "Ahorn/Birke",
      "Studio",
      "Allrounder"
    ],
    "setTarget": "studio"
  },
  {
    "cat": "drumsets",
    "catLabel": "Drumsets",
    "name": "Tama Starclassic Maple (24 × 20, 13, 14, 16)",
    "model": "Tama Starclassic Maple – 24×20 Bassdrum, 13, 14 & 16 Floor Toms",
    "sounds": "Tiefe Bassdrum, schwere Akzente, große Tomfiguren, langsame druckvolle Grooves, filmische Trommelschläge.",
    "tags": [
      "Tama",
      "Starclassic Maple",
      "Cinematic",
      "24 Zoll",
      "Wuchtig",
      "Heavy Rock"
    ],
    "setTarget": "large"
  },
  {
    "cat": "drumsets",
    "catLabel": "Drumsets",
    "name": "Tama Kessel & Spannreifen Resonanzen",
    "model": "Tama Die-Cast Hoops & Resonanzkessel",
    "sounds": "Holzige Klicks, metallische Randakzente, Rimclicks, mitschwingende Texturen und gezielte Obertöne.",
    "tags": [
      "Tama",
      "Rimclicks",
      "Resonanz",
      "Akzent",
      "Textur"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama S.L.P. Classic Dry Aluminum 14 × 5,5 (LAL1455)",
    "model": "Tama S.L.P. LAL1455 – 14 × 5,5 Nahtloser Aluminiumkessel",
    "sounds": "Trockener Backbeat, feine Ghostnotes, kurze Akzente, kontrollierte offene Schläge, ideal mit Besen.",
    "tags": [
      "Tama",
      "S.L.P.",
      "Aluminium",
      "Trocken",
      "Ghostnotes",
      "Besen"
    ],
    "snareTarget": "alu"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Brann Dailor Signature Bronze 14 × 6,5 (BD1465)",
    "model": "Tama Signature BD1465 – 14 × 6,5 Glockenbronze auf Starphonic-Basis",
    "sounds": "Voller massiver Backbeat, schmetternde Rimshots, singende Obertöne, tiefe breite Schläge mit extremem Durchsetzungsvermögen.",
    "tags": [
      "Tama",
      "Signature",
      "Starphonic",
      "Bronze",
      "Rimshot",
      "Power"
    ],
    "snareTarget": "bronze"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Vintage Superstar 14 × 7 (Parallelabhebung, 1980er)",
    "model": "Tama Vintage Superstar 14 × 7 – Klassische Parallelabhebung",
    "sounds": "Samtiger Vintage-Backbeat, sensible und dynamische Teppichansprache über den gesamten Dynamikbereich.",
    "tags": [
      "Tama",
      "Vintage",
      "Superstar",
      "Parallelabhebung",
      "1980s",
      "Warm"
    ],
    "snareTarget": "vintage"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Kirsche Snare 14 × 5,5 (Custom Reference)",
    "model": "Tama Referenz – 14 × 5,5 Cherry Wood Kessel",
    "sounds": "Holziger organischer Backbeat, mittige Akzente, feinfühlige Ghostnotes und warmer Cross-Stick.",
    "tags": [
      "Tama",
      "Kirsche",
      "Wood",
      "Organisch",
      "Cross Stick"
    ],
    "snareTarget": "piccolo"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama S.L.P. Vintage Hammered Steel 14 × 5,5 (LST1455H)",
    "model": "Tama S.L.P. LST1455H – 14 × 5,5 Gehammerter Stahlkessel",
    "sounds": "Prägnanter Anschlag, kontrolliertes metallisches Klingeln, scharfe Rimshots, kurzer gedämpfter Funkklang.",
    "tags": [
      "Tama",
      "S.L.P.",
      "Stahl",
      "Gehämmert",
      "Funk",
      "Attack"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama S.L.P. Big Black Steel 14 × 8 (LST148)",
    "model": "Tama S.L.P. LST148 – 14 × 8 Tiefer Stahlkessel",
    "sounds": "Tiefer voluminöser Körper, gewaltige Balladen-Backbeats, offene Ringeffekte, schwere dramatische Akzente.",
    "tags": [
      "Tama",
      "S.L.P.",
      "Tiefer Kessel",
      "8 Zoll",
      "Heavy",
      "Power"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama S.L.P. Studio Maple 14 × 6,5 (LMP1465F)",
    "model": "Tama S.L.P. LMP1465F – 14 × 6,5 Ahorn mit Holzspannreifen",
    "sounds": "Universeller Hauptsnaresound, warmer voller Backbeat, offene Resonanz durch Wood Hoops, satter Rimclick.",
    "tags": [
      "Tama",
      "S.L.P.",
      "Maple",
      "Holzspannreifen",
      "Allrounder",
      "Warm"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Nickel Snare 13 × 7 (Custom Reference)",
    "model": "Tama Referenz – 13 × 7 Kompakter Tiefkessel",
    "sounds": "Kompakter direkter Anschlag mit tiefem Kesselkörper, fokusiertes Klangbild mit schneller Ansprache.",
    "tags": [
      "Tama",
      "Nickel",
      "13 Zoll",
      "Fokussiert",
      "Punch"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Maple Piccolo Snare 13 × 3,5",
    "model": "Tama Referenz – 13 × 3,5 Ahorn Piccolokessel",
    "sounds": "Messerscharfer Piccoloklang, extrem hohe Akzente, blitzschnelle Ghostnotes, Hip-Hop und D&B Sidesnare.",
    "tags": [
      "Tama",
      "Piccolo",
      "Maple",
      "Sidesnare",
      "HipHop",
      "Funk"
    ],
    "snareTarget": "piccolo"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Birke Effektsnare 10 × 2",
    "model": "Tama Referenz – 10 × 2 Pancake Flachkessel",
    "sounds": "Sehr kurze hohe Rim-Effekte, trockene Snare-Impulse, Ausgangspunkt für elektronisch geschichtete Claps.",
    "tags": [
      "Tama",
      "Birke",
      "Effekt",
      "Pancake",
      "Kurz",
      "Elektronisch"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Birke Sidesnare 10 × 3,5",
    "model": "Tama Referenz – 10 × 3,5 Kompakte Birke",
    "sounds": "Knackige Sidesnare, hohe Funkakzente, schnelle perkussive Wirbel und Ghostnote-Fills.",
    "tags": [
      "Tama",
      "Sidesnare",
      "Birke",
      "Funk",
      "Crack"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Metalworks Effect Mini Tymp Stahl 10 × 3,5",
    "model": "Tama Metalworks Effect – 10 × 3,5 Stahl Timbale Snare",
    "sounds": "Heller metallischer Randklang, schneller Fellschlag, nahtloser Wechsel zwischen Snare-Crack und Timbale-Charakter.",
    "tags": [
      "Tama",
      "Metalworks",
      "Timbale",
      "Stahl",
      "Hybrid"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Holz Jingle Snare 10 × 3,5",
    "model": "Tama Referenz – 10 × 3,5 Holzkessel mit Jingles",
    "sounds": "Kurzer trockener Holzanschlag kombiniert mit rasselndem Schellennachklang für lateinamerikanische und urbane Grooves.",
    "tags": [
      "Tama",
      "Jingle Snare",
      "Holz",
      "Schellen",
      "Percussion"
    ],
    "snareTarget": "timbale_jingle"
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Pappel Snare 14 × 4,5",
    "model": "Tama Referenz – 14 × 4,5 Flacher Pappelkessel",
    "sounds": "Flacher trockener Vintage-Backbeat, weiche gedämpfte Schläge, perfekt für feine akustische Begleitung.",
    "tags": [
      "Tama",
      "Pappel",
      "Vintage",
      "Flach",
      "Warm",
      "Akustisch"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Tama Birke Snare 14 × 4,5",
    "model": "Tama Referenz – 14 × 4,5 Reine Birke",
    "sounds": "Kompakter fokussierter Backbeat, direkte Attack-Akzente, saubere dynamische Fills.",
    "tags": [
      "Tama",
      "Birke",
      "Präzise",
      "Attack",
      "Studio"
    ]
  },
  {
    "cat": "snares",
    "catLabel": "16 Snares",
    "name": "Santino Scavelli Signature Konzept Snare 16 × 3",
    "model": "Tama Zuordnung offen – 16 × 3 Custom Large-Diameter Flachkessel",
    "sounds": "Breite gewaltige Trommeltextur, tieffrequente Resonanzen, riesige Besenflächen, ungewöhnliche filmische Backbeats.",
    "tags": [
      "Signature",
      "Santino Scavelli",
      "16 Zoll",
      "Custom",
      "Cinematic",
      "Besen"
    ],
    "snareTarget": "signature"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Artist Series Congas (MSA11AWA, MSA1134AWA, MSA1212AWA)",
    "model": "Meinl Artist Series – Quinto 11\", Conga 11 3/4\", Tumba 12 1/2\"",
    "sounds": "Voluminöse offene Töne, tiefe Bässe, schneidende Slaps, gedämpfte Touches und mehrstimmige melodische Conga-Grooves.",
    "tags": [
      "Meinl",
      "Artist Series",
      "Congas",
      "Afro-Cuban",
      "Melodie"
    ],
    "percTarget": "congas"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Marathon Exclusive & Woodcraft Bongos (MB400EBP, WB400VBK-M)",
    "model": "Meinl Marathon Exclusive & Woodcraft – Macho & Hembra",
    "sounds": "Messerscharfe Martillo-Muster, helle offene Töne, trockene Fingerschläge und dynamische Slaps.",
    "tags": [
      "Meinl",
      "Bongos",
      "Woodcraft",
      "Salsa",
      "Attack"
    ],
    "percTarget": "congas"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Artisan Edition Cajons (AEFLIH, AESELIH, AECLWN, AEBLMY)",
    "model": "Meinl Artisan Linea / Solea / Cantina Kessel",
    "sounds": "Fein artikulierte Bässe, warme Holzresonanz, sensible Saitenschnarrung, virtuose Fingerrollen und Slaps.",
    "tags": [
      "Meinl",
      "Artisan Edition",
      "Cajon",
      "Flamenco",
      "Akustik"
    ],
    "percTarget": "cajon"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Percussion Bass Box (PBASSBOX) & Snare Box (PSNAREBOX)",
    "model": "Meinl PBASSBOX & PSNAREBOX mit L-Beater",
    "sounds": "Fußgespielter akustischer Kickimpuls, trockenes tiefes Pochen und knackiger rasselnder Backbeat.",
    "tags": [
      "Meinl",
      "Bass Box",
      "Snare Box",
      "Foot Percussion",
      "Kick"
    ],
    "percTarget": "cajon"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Traditional & Artisan Mizhars (FD18T-D, AE-FD22T-D)",
    "model": "Meinl Mizhar 14\", 18\" & 22\" Woven Synthetic & True Felt",
    "sounds": "Monumentale tiefe Fellimpulse, warme Raumresonanzen, tranceartige Begleitmuster und dynamische Handpatterns.",
    "tags": [
      "Meinl",
      "Mizhar",
      "Artisan",
      "Rahmentrommel",
      "Trance"
    ],
    "percTarget": "frame"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Traditional Tars & Bendirs (FD22T, FD16BE, FD14BE)",
    "model": "Meinl Tar 18\"/22\" & Bendir mit internem Schnarrsaitensystem",
    "sounds": "Resonante tiefe Doums, filigrane Split-Hand Teks, charakteristisches Bendir-Schnarren und obertonreiche Texturen.",
    "tags": [
      "Meinl",
      "Tar",
      "Bendir",
      "Orient",
      "Split-Hand"
    ],
    "percTarget": "frame"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Samba Bahia Surdo 18\" & Wood Surdos (SUB18AB-M, SU20-L-AB-M)",
    "model": "Meinl Samba Surdos 18\", 20\" & 22\"",
    "sounds": "Erdbebenartiger tiefer Basspuls, offene und abgedämpfte Schläge, mächtiges rhythmisches Fundament.",
    "tags": [
      "Meinl",
      "Samba",
      "Surdo",
      "18 Zoll",
      "Tiefbass",
      "Fundament"
    ],
    "percTarget": "surdos"
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Doumbek / Darbuka (HE-3218, HE-3012)",
    "model": "Meinl Aluminium & Copper Hand-Engraved Doumbeks",
    "sounds": "Tief resonierender Doum, metallischer Tek und Ka, rasante Fingerrollen und Split-Finger Ornamentik.",
    "tags": [
      "Meinl",
      "Doumbek",
      "Darbuka",
      "Bellydance",
      "Virtuos"
    ]
  },
  {
    "cat": "world",
    "catLabel": "World Percussion",
    "name": "Meinl Artisan Edition Riq (AERIQ1) & Kanjira (FD7KA)",
    "model": "Meinl Artisan Riq & Kanjira mit Ziegenfell",
    "sounds": "Präzise Schellenartikulation, Rolls, virtuose Finger-Tonbeugungen und dichte orientalische Rhythmen.",
    "tags": [
      "Meinl",
      "Riq",
      "Kanjira",
      "Artisan",
      "Schellen",
      "Jingles"
    ]
  },
  {
    "cat": "tuned",
    "catLabel": "Melodie & Becken",
    "name": "Meinl Sonic Energy Sensory Handpan HPSTL100 D-Kurd (10 Töne)",
    "model": "Meinl Sonic Energy HPSTL100 – Gestimmter Edelstahl in D-Kurd",
    "sounds": "Schwebende harmonische Obertöne, meditative Melodien, glockenreine Zentralnote D3, perkussive Slap-Töne.",
    "tags": [
      "Meinl",
      "Sonic Energy",
      "Handpan",
      "D-Kurd",
      "Meditation",
      "Melodie"
    ],
    "percTarget": "handpan"
  },
  {
    "cat": "tuned",
    "catLabel": "Melodie & Becken",
    "name": "Meinl Sonic Energy Octave Steel Tongue Drum (OSTD1BKE, D-Kurd)",
    "model": "Meinl OSTD1BKE – 8 Zungen mit Oktav-Obertönen",
    "sounds": "Glockenartige Nachklänge, sphärische Akkorde, ruhige meditative Pulsfiguren und mehrstimmiges Spiel.",
    "tags": [
      "Meinl",
      "Steel Tongue Drum",
      "Sonic Energy",
      "Oktaven",
      "Sphäre"
    ],
    "percTarget": "steeltongue"
  },
  {
    "cat": "tuned",
    "catLabel": "Melodie & Becken",
    "name": "Meinl Sonic Energy Kalimbas (KA9-M, KA9WW-BK, KA9P-AB Pickup)",
    "model": "Meinl Sonic Energy – 5 Kalimbas inkl. Wah-Effekt und Tonabnehmer",
    "sounds": "Intime gezupfte Holz- und Metallmelodien, akustischer Wah-Effekt, direktes Signal für Hall- und Delay-Flächen.",
    "tags": [
      "Meinl",
      "Kalimba",
      "Pickup",
      "Wah",
      "Ostinato",
      "Afro"
    ],
    "percTarget": "kalimba"
  },
  {
    "cat": "tuned",
    "catLabel": "Melodie & Becken",
    "name": "Meinl Byzance Cymbals (Dark HiHat B14DAH, Jazz Thin B15JTH, Dual Rides)",
    "model": "Meinl Byzance Handgehämmert – B14DAH, B15JTH, B22VPLR, B19EDTC",
    "sounds": "Erdige dunkle Stockdefinition, seidig rauschende Hi-Hat Figuren, trashige Crashes und dynamische Ride-Kuppen.",
    "tags": [
      "Meinl",
      "Byzance",
      "HiHat",
      "Ride",
      "Crash",
      "B20 Bronze"
    ]
  },
  {
    "cat": "fx",
    "catLabel": "Effekte & Layering",
    "name": "Meinl Percussion Ching Ring (CRING & SCRING)",
    "model": "Meinl CRING / SCRING – 5 Paar Stahlschellen",
    "sounds": "Schellennachklang direkt auf Fell oder Becken. Perfektes Snare-Layering für treibende 70s- und Hip-Hop-Beats.",
    "tags": [
      "Meinl",
      "Ching Ring",
      "Snare Layer",
      "Jingles",
      "Backbeat"
    ]
  },
  {
    "cat": "fx",
    "catLabel": "Effekte & Layering",
    "name": "Meinl Percussion Vintage Smack Stack",
    "model": "Meinl Vintage Smack Stack 3-teilig",
    "sounds": "Trockener schneidender Handclap-Sound, akustischer 808-Clap Ersatz, extrem durchsetzungsstark.",
    "tags": [
      "Meinl",
      "Smack Stack",
      "Clap",
      "Trash",
      "Snare Layer"
    ]
  },
  {
    "cat": "fx",
    "catLabel": "Effekte & Layering",
    "name": "Meinl Sonic Energy Regenmacher & Sea Drums (RA7BK, FD16SD)",
    "model": "Meinl Rainmaker 60cm & Sea Drum 16\" mit feinen Stahlkugeln",
    "sounds": "Natürliches Meeresrauschen, an- und abschwellende Wassergeräusche, langes Regenrieseln für Filmvertonung.",
    "tags": [
      "Meinl",
      "Regenmacher",
      "Sea Drum",
      "Natur",
      "Atmosphäre",
      "Cinematic"
    ],
    "percTarget": "effects"
  },
  {
    "cat": "fx",
    "catLabel": "Effekte & Layering",
    "name": "Meinl Sonic Energy The Night (NI1AM) & The Roar (RO3BK)",
    "model": "Meinl The Night & The Roar Effektinstrumente",
    "sounds": "Grillenähnliche Zirplaute, rasselnde Naturakzente und tiefe dynamische Groll-Effekte.",
    "tags": [
      "Meinl",
      "The Night",
      "The Roar",
      "Naturgeräusche",
      "Foley",
      "Effekt"
    ]
  },
  {
    "cat": "fx",
    "catLabel": "Effekte & Layering",
    "name": "Meinl Percussion Shaker, Caxixis & Guiros (SH16, CAX2, GU7BK)",
    "model": "Meinl Studio Shaker, Studio Maracas, Fiber-Guiro",
    "sounds": "Präzise 16tel-Rasselmuster, weiche Shaker-Teppiche, kratzende Guiro-Akzente für organischen Groove-Flow.",
    "tags": [
      "Meinl",
      "Shaker",
      "Caxixi",
      "Guiro",
      "Groove",
      "Rhythmus"
    ],
    "percTarget": "shakers"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Sequential Prophet-6 (6-stimmig analoger Synthesizer)",
    "model": "Sequential Prophet-6 Polyphonic Synthesizer",
    "sounds": "Warme analoge Brass-Pads, druckvolle polyphone Bässe, lebendige Filtersweeps und epische Synth-Akkorde.",
    "tags": [
      "Sequential",
      "Prophet-6",
      "Analog",
      "Polyphon",
      "Warm",
      "Kult"
    ],
    "hybridTarget": "prophet"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Behringer Model D (Analoger Minimoog Subbass-Klon)",
    "model": "Behringer Model D – 3 VCOs, 24 dB Ladder Filter",
    "sounds": "Legendärer tiefer Minimoog-Subbass, fette analoge Fundamente, drückende Bassdrum-Layering Sounds.",
    "tags": [
      "Behringer",
      "Model D",
      "Minimoog",
      "Subbass",
      "Analog",
      "Mono"
    ],
    "hybridTarget": "prophet"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Behringer DeepMind 12 (12-stimmig analoger Poly-Synth)",
    "model": "Behringer DeepMind 12 mit Klark Teknik FX-Engine",
    "sounds": "Riesige analoge Flächenteppiche, schimmernde Pad-Wolken, spacige Arpeggios und epische Streicher.",
    "tags": [
      "Behringer",
      "DeepMind 12",
      "12-stimmig",
      "Flächen",
      "Ambient"
    ],
    "hybridTarget": "prophet"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Behringer TD-3 (Analoge 303 Acid-Bassline) & Edge Percussion",
    "model": "Behringer TD-3 Acid Bass & Edge Percussion Synthesizer",
    "sounds": "Zwitschernde Resonanz-Bässe, schmutzige Acid-Grooves, treibende perkussive Synthesizer-Loops.",
    "tags": [
      "Behringer",
      "TD-3",
      "303",
      "Acid",
      "Edge",
      "Perkussiv"
    ],
    "hybridTarget": "prophet"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Nord Drum 3P (Modeling Percussion Synthesizer)",
    "model": "Nord Drum 3P mit 6 integrierten Schlagflächen & Delay/Reverb",
    "sounds": "Synthetische Drum-Punches, gestimmte Glocken, FM-Percussion, futuristische Noises und Retro-Electro Beats.",
    "tags": [
      "Nord",
      "Drum 3P",
      "FM Synthese",
      "Glocken",
      "Electro",
      "Dynamic"
    ],
    "hybridTarget": "nord_drum"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Behringer RD-8 (Analoger 808-Drumcomputer)",
    "model": "Behringer RD-8 Rhythm Designer",
    "sounds": "Klassische wummernde 808-Subkicks, zirpende Maracas, analoge Claps und knallige Snare-Doubles.",
    "tags": [
      "Behringer",
      "RD-8",
      "808",
      "Trap",
      "HipHop",
      "Subkick"
    ],
    "hybridTarget": "nord_drum"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Evans Sensory Percussion & Portal Interface",
    "model": "Evans Sensory Percussion – Bis zu 10 Zonen pro Trommel",
    "sounds": "Die weltbeste AI-Schnittstelle: Akustisches Spiel steuert stufenlos Software-Sampler, Synth-Filter und Granular-Sounds.",
    "tags": [
      "Evans",
      "Sensory Percussion",
      "AI Trigger",
      "Multi-Zonen",
      "Hybrid"
    ],
    "hybridTarget": "sensory"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Roland RT-30K & RT-30HR Dual-Triggers & SPD-SX",
    "model": "Roland RT-30 Acoustic Triggers & SPD-SX Sampling Pad",
    "sounds": "Verlässliche Kopplung von akustischen Trommeln mit Studio-Samples, sofortige 808-Subkick-Verdopplung.",
    "tags": [
      "Roland",
      "RT-30",
      "SPD-SX",
      "Hybrid",
      "Sample Layer"
    ],
    "hybridTarget": "sensory"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Empress Effects Reverb & Empress Echosystem",
    "model": "Empress Effects – 32-Bit Dual-Engine Studio-Pedale",
    "sounds": "Gigantische kosmische Hallräume, Shimmer, rhythmische Tape-Delays und endlose Ambient-Texturen.",
    "tags": [
      "Empress",
      "Reverb",
      "Echosystem",
      "Pedale",
      "High-End Hall",
      "Shimmer"
    ],
    "hybridTarget": "reverb"
  },
  {
    "cat": "synths",
    "catLabel": "Synths & Hybrid",
    "name": "Glou-Glou Loupé (Granular-Looper & Pitch-Shifter)",
    "model": "Glou-Glou Loupé Handcrafted in France",
    "sounds": "Granulare Glitch-Loops, vor- und rückwärtslaufende Texturen, experimentelle rhythmische Schichtungen in Echtzeit.",
    "tags": [
      "Glou-Glou",
      "Loupé",
      "Looper",
      "Granular",
      "Glitch",
      "Experimentell"
    ],
    "hybridTarget": "loupe"
  },
  {
    "cat": "preamps",
    "catLabel": "Preamps & Signalkette",
    "name": "SPL GoldMike Mk2 (Diskreter Class-A Röhren-Preamp)",
    "model": "SPL GoldMike Mk2 – Diskrete Class-A Röhrenstufe mit Flair-Schaltung",
    "sounds": "Seidige seidige Röhrenwärme, edle Obertonanreicherung, sanfte Transientenkompression für Becken und Snares.",
    "tags": [
      "SPL",
      "GoldMike Mk2",
      "Röhre",
      "Class-A",
      "Warm",
      "High-End"
    ],
    "preampTarget": "spl_tube"
  },
  {
    "cat": "preamps",
    "catLabel": "Preamps & Signalkette",
    "name": "Warm Audio WA-273 & WA-412 (Neve 1073 & API 312 Preamps)",
    "model": "Warm Audio – Diskrete Carnhill-Übertrager Preamps",
    "sounds": "Massiver analoger Punch, dichter Mitten-Körper, druckvolle Transienten für Kick, Snare und Toms.",
    "tags": [
      "Warm Audio",
      "WA-273",
      "WA-412",
      "Neve",
      "API",
      "Übertrager",
      "Punch"
    ],
    "preampTarget": "warm_audio"
  },
  {
    "cat": "preamps",
    "catLabel": "Preamps & Signalkette",
    "name": "MOTU 828es & Ultralite mk5 (Glasklare AVB Wandler, 32 Spuren)",
    "model": "MOTU 828es – ESS Sabre32 Ultra Wandlertechnologie",
    "sounds": "Glasklare unverfälschte Wandlung, 123 dB Dynamikumfang, 32 diskrete latenzfreie Spuren für Mehrspur-Sessions.",
    "tags": [
      "MOTU",
      "828es",
      "Transparent",
      "32 Spuren",
      "AVB",
      "Mastering Clean"
    ],
    "preampTarget": "clean"
  },
  {
    "cat": "preamps",
    "catLabel": "Preamps & Signalkette",
    "name": "DIY Focal Polyflex 8 Subkick (30–60 Hz Tiefbass-Kapsel)",
    "model": "DIY Focal Polyflex Lautsprecher-Kapsel vor der Bassdrum",
    "sounds": "Extreme spürbare Subbässe (30–60 Hz), die keine herkömmliche Bassdrum-Mikrofonierung allein erfassen kann.",
    "tags": [
      "DIY Focal",
      "Subkick",
      "30Hz",
      "Tiefbass",
      "Kick Layering"
    ],
    "preampTarget": "subkick"
  }
];

function initSoundCatalog() {
  const container = document.getElementById('klangkatalog');
  if (!container) return;

  const searchInput = container.querySelector('#catalog-search-input');
  const tabs = container.querySelectorAll('.catalog-tab');
  const cardsGrid = container.querySelector('#catalog-cards-grid');
  const counterBadge = container.querySelector('#catalog-counter');

  let activeCategory = 'all';
  let searchTerm = '';

  function renderCards() {
    if (!cardsGrid) return;

    const filtered = SOUND_CATALOG_DATA.filter(item => {
      // Category check
      const matchesCat = activeCategory === 'all' || item.cat === activeCategory;
      if (!matchesCat) return false;

      // Search term check
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(term);
      const matchModel = item.model.toLowerCase().includes(term);
      const matchSounds = item.sounds.toLowerCase().includes(term);
      const matchTags = item.tags && item.tags.some(t => t.toLowerCase().includes(term));
      return matchName || matchModel || matchSounds || matchTags;
    });

    if (counterBadge) {
      counterBadge.textContent = `${filtered.length} von ${SOUND_CATALOG_DATA.length} Instrumenten / Sounds`;
    }

    if (!filtered.length) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
          <h4 style="color:#fff; margin-bottom:0.4rem;">Kein passendes Instrument gefunden</h4>
          <p style="font-size:0.9rem;">Versuche einen anderen Suchbegriff wie „Snare“, „Handpan“, „Röhre“, „Funk“ oder klicke auf „Alle Instrumente“.</p>
        </div>
      `;
      return;
    }

    cardsGrid.innerHTML = filtered.map((item, idx) => {
      const tagsHtml = (item.tags || []).map(t => `<span class="sound-tag-mini">#${t}</span>`).join('');
      return `
        <div class="sound-item-card" data-cat="${item.cat}">
          <div class="sound-item-top">
            <span class="sound-item-cat-badge">${item.catLabel}</span>
            <span class="sound-item-model-tag">${item.model}</span>
          </div>
          <h4 class="sound-item-name">${item.name}</h4>
          <p class="sound-item-roles">${item.sounds}</p>
          <div class="sound-item-footer">
            <div class="sound-item-tags">
              ${tagsHtml}
            </div>
            <button class="sound-add-btn" data-catalog-idx="${idx}" title="In das Klang-Setup des Baukastens übernehmen">
              + In Setup
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to "+ In Setup" buttons
    cardsGrid.querySelectorAll('.sound-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = filtered[btn.dataset.catalogIdx];
        if (!item) return;

        // Apply to Sound Architect if mapping exists
        if (item.setTarget) {
          architectState.set = item.setTarget;
        }
        if (item.snareTarget) {
          architectState.snare = item.snareTarget;
        }
        if (item.percTarget && !architectState.percussion.includes(item.percTarget)) {
          architectState.percussion.push(item.percTarget);
        }
        if (item.hybridTarget && !architectState.hybrid.includes(item.hybridTarget)) {
          architectState.hybrid.push(item.hybridTarget);
        }
        if (item.preampTarget) {
          architectState.preamp = item.preampTarget;
        }

        // Sync and update Architect visualizer
        updateArchitectVisualizer();

        // Button feedback
        btn.classList.add('added');
        btn.textContent = '✓ Im Setup!';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.textContent = '+ In Setup';
        }, 2000);

        // Smooth scroll hint to Architect if requested
        const architectSection = document.getElementById('sound-architect');
        if (architectSection && window.innerWidth <= 768) {
          // On mobile, show notification
        }
      });
    });
  }

  // Filter Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.catalogFilter;
      renderCards();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderCards();
    });
  }

  // Initial render
  renderCards();
}
