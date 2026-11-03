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
    name: 'Cinematic & Tribal Filmscore',
    set: 'large',
    snare: 'signature',
    percussion: ['frame', 'surdos', 'effects'],
    hybrid: ['reverb'],
    preamp: 'spl_tube',
    desc: 'Wuchtiges 24" Kessel-Fundament, breite 16" Signature Snare, tiefe Rahmentrommeln und atmosphärischer Reverb für filmische Grooves.'
  },
  funk: {
    name: '70s Vintage Soul & Funk',
    set: 'medium',
    snare: 'vintage',
    percussion: ['congas', 'pandeiro'],
    hybrid: [],
    preamp: 'warm_audio',
    desc: 'Knackige 20" Kick, 14×7 Tama Superstar Vintage Snare mit Neve-Style Preamps und warmen Holz-Congas.'
  },
  pop: {
    name: 'Modern High-End Pop & Rock',
    set: 'studio',
    snare: 'bronze',
    percussion: ['shakers'],
    hybrid: ['prophet'],
    preamp: 'spl_tube',
    desc: 'Universelles 22" Studioset, durchsetzungsstarke Bronze-Snare, SPL Röhrenwärme und dezente analoge Synth-Bässe.'
  },
  world: {
    name: 'Sphärische Weltmusik & Handpan',
    set: 'compact',
    snare: 'timbale_jingle',
    percussion: ['handpan', 'steeltongue', 'kalimba', 'cajon'],
    hybrid: ['reverb'],
    preamp: 'clean',
    desc: 'Meditation & Rhythmus: 10-Ton D-Kurd Handpan, Steel Tongue Drum, afrikanische Kalimbas und perkussive Timbale-Snare.'
  },
  hybrid: {
    name: 'Hybrid Electro-Acoustic Lab',
    set: 'compact',
    snare: 'piccolo',
    percussion: ['shakers'],
    hybrid: ['sensory', 'nord_drum', 'prophet', 'loupe'],
    preamp: 'warm_audio',
    desc: 'Die Verschmelzung zweier Welten: Sensory Percussion Trigger, Nord Drum 3P, analoger Prophet-6 Bass und Live-Loops.'
  }
};

let architectState = {
  set: 'studio',
  snare: 'bronze',
  percussion: ['congas', 'shakers'],
  hybrid: ['prophet'],
  preamp: 'spl_tube'
};

function initSoundArchitect() {
  const container = document.getElementById('sound-architect');
  if (!container) return;

  // Preset Buttons
  const presetBtns = container.querySelectorAll('.architect-preset-btn');
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
  const setChips = container.querySelectorAll('[data-architect-set]');
  setChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      architectState.set = chip.dataset.architectSet;
      updateArchitectVisualizer();
    });
  });

  // Snare Chips (Single Select)
  const snareChips = container.querySelectorAll('[data-architect-snare]');
  snareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      snareChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      architectState.snare = chip.dataset.architectSnare;
      updateArchitectVisualizer();
    });
  });

  // Percussion Multi-select Pills
  const percPills = container.querySelectorAll('[data-architect-perc]');
  percPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.dataset.architectPerc;
      const idx = architectState.percussion.indexOf(val);
      if (idx > -1) {
        architectState.percussion.splice(idx, 1);
        pill.classList.remove('selected');
      } else {
        architectState.percussion.push(val);
        pill.classList.add('selected');
      }
      updateArchitectVisualizer();
    });
  });

  // Hybrid Multi-select Pills
  const hybridPills = container.querySelectorAll('[data-architect-hybrid]');
  hybridPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.dataset.architectHybrid;
      const idx = architectState.hybrid.indexOf(val);
      if (idx > -1) {
        architectState.hybrid.splice(idx, 1);
        pill.classList.remove('selected');
      } else {
        architectState.hybrid.push(val);
        pill.classList.add('selected');
      }
      updateArchitectVisualizer();
    });
  });

  // Preamp Chips (Single Select)
  const preampChips = container.querySelectorAll('[data-architect-preamp]');
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

  // Initial draw
  updateArchitectVisualizer();
}

function applyArchitectPreset(key) {
  const p = SOUND_PRESETS[key];
  if (!p) return;

  architectState.set = p.set;
  architectState.snare = p.snare;
  architectState.percussion = [...p.percussion];
  architectState.hybrid = [...p.hybrid];
  architectState.preamp = p.preamp;

  // Sync UI elements
  const container = document.getElementById('sound-architect');
  if (!container) return;

  container.querySelectorAll('[data-architect-set]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectSet === p.set);
  });
  container.querySelectorAll('[data-architect-snare]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectSnare === p.snare);
  });
  container.querySelectorAll('[data-architect-perc]').forEach(pill => {
    pill.classList.toggle('selected', p.percussion.includes(pill.dataset.architectPerc));
  });
  container.querySelectorAll('[data-architect-hybrid]').forEach(pill => {
    pill.classList.toggle('selected', p.hybrid.includes(pill.dataset.architectHybrid));
  });
  container.querySelectorAll('[data-architect-preamp]').forEach(c => {
    c.classList.toggle('selected', c.dataset.architectPreamp === p.preamp);
  });

  updateArchitectVisualizer();
}

function updateArchitectVisualizer() {
  const container = document.getElementById('sound-architect');
  if (!container) return;

  // 1. Kick Diameter & Label based on Set
  const kickRadiusMap = {
    compact: { r: 38, label: '18" Jazz Kick', sub: 'Trocken & Resonant' },
    medium: { r: 44, label: '20" Funk Kick', sub: 'Knackig & Fokussiert' },
    studio: { r: 50, label: '22" Studio Kick', sub: 'Punchy Allrounder' },
    large: { r: 56, label: '24" Deep Kick', sub: 'Massives Fundament' }
  };
  const kickData = kickRadiusMap[architectState.set] || kickRadiusMap.studio;

  // 2. Snare color & label
  const snareMap = {
    alu: { color: '#cbd5e1', label: '14" Aluminium (Trocken)' },
    bronze: { color: '#f59e0b', label: '14" Bronze (Voller Rimshot)' },
    vintage: { color: '#d97706', label: '14" Tama Superstar (Vintage)' },
    piccolo: { color: '#fbbf24', label: '13" Piccolo (Scharfer Funk)' },
    timbale_jingle: { color: '#a855f7', label: '10" Holz Timbale w/ Jingles' },
    signature: { color: '#ec4899', label: '16" Signature Snare (Deep)' }
  };
  const snareData = snareMap[architectState.snare] || snareMap.bronze;

  // 3. Preamp color & label
  const preampMap = {
    clean: { label: 'MOTU 828es (Präzise & Transparent)', meter: 60 },
    spl_tube: { label: 'SPL GoldMike Mk2 (Röhren-Wärme)', meter: 88 },
    warm_audio: { label: 'Warm Audio Neve/API (Übertrager-Druck)', meter: 95 },
    subkick: { label: 'Subkick & Röhren (Subbass-Fundament)', meter: 92 }
  };
  const preampData = preampMap[architectState.preamp] || preampMap.spl_tube;

  // 4. Update SVG Graphic elements
  const svg = document.getElementById('stage-svg');
  if (svg) {
    const kickCircle = svg.querySelector('#svg-kick-circle');
    const kickText = svg.querySelector('#svg-kick-text');
    const snareCircle = svg.querySelector('#svg-snare-circle');
    const snareText = svg.querySelector('#svg-snare-text');

    if (kickCircle) {
      kickCircle.setAttribute('r', kickData.r);
    }
    if (kickText) {
      kickText.textContent = kickData.label;
    }
    if (snareCircle) {
      snareCircle.setAttribute('stroke', snareData.color);
      snareCircle.setAttribute('fill', snareData.color + '22');
    }
    if (snareText) {
      snareText.textContent = snareData.label;
    }

    // Toggle Percussion Satellite visual nodes
    const percNodes = svg.querySelectorAll('[data-svg-perc]');
    percNodes.forEach(node => {
      const pId = node.dataset.svgPerc;
      const isActive = architectState.percussion.includes(pId);
      node.style.opacity = isActive ? '1' : '0.2';
      node.classList.toggle('svg-active-glow', isActive);
    });

    // Toggle Hybrid Satellite visual nodes
    const hybridNodes = svg.querySelectorAll('[data-svg-hybrid]');
    hybridNodes.forEach(node => {
      const hId = node.dataset.svgHybrid;
      const isActive = architectState.hybrid.includes(hId);
      node.style.opacity = isActive ? '1' : '0.2';
      node.classList.toggle('svg-active-glow', isActive);
    });

    // Preamp Node
    const preampNode = svg.querySelector('#svg-preamp-node');
    if (preampNode) {
      preampNode.classList.add('svg-active-glow');
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
    hybridScore += 45;
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
  const pBar = container.querySelector('#radar-punch-fill');
  const pVal = container.querySelector('#radar-punch-val');
  const wBar = container.querySelector('#radar-warmth-fill');
  const wVal = container.querySelector('#radar-warmth-val');
  const rBar = container.querySelector('#radar-room-fill');
  const rVal = container.querySelector('#radar-room-val');
  const hBar = container.querySelector('#radar-hybrid-fill');
  const hVal = container.querySelector('#radar-hybrid-val');

  if (pBar) pBar.style.width = punch + '%';
  if (pVal) pVal.textContent = punch + '%';
  if (wBar) wBar.style.width = warmth + '%';
  if (wVal) wVal.textContent = warmth + '%';
  if (rBar) rBar.style.width = room + '%';
  if (rVal) rVal.textContent = room + '%';
  if (hBar) hBar.style.width = hybridScore + '%';
  if (hVal) hVal.textContent = hybridScore + '%';

  // 6. Generate Recipe Text
  const percLabels = {
    congas: 'Congas & Bongos',
    frame: 'Rahmentrommeln & Tars',
    handpan: 'Handpan D-Kurd',
    steeltongue: 'Octave Tongue Drum',
    shakers: 'Shaker & Caxixis',
    cajon: 'Artisan Cajon & Bass Box',
    surdos: 'Surdos & Djembes',
    effects: 'Naturklänge (Rainmaker, Sea Drum)'
  };
  const hybridLabels = {
    prophet: 'Prophet-6 Analog Bass/Chords',
    nord_drum: 'Nord Drum 3P Synths',
    sensory: 'Sensory Percussion Portal',
    reverb: 'Empress Reverb & Delay',
    loupe: 'Glou-Glou Loupé Granular-Looper'
  };

  const activePercList = architectState.percussion.map(k => percLabels[k] || k);
  const activeHybridList = architectState.hybrid.map(k => hybridLabels[k] || k);

  let recipeParts = [];
  recipeParts.push(`Set: ${kickData.label} + ${snareData.label}`);
  if (activePercList.length) recipeParts.push(`Percussion: ${activePercList.join(', ')}`);
  if (activeHybridList.length) recipeParts.push(`Hybride Elektronik: ${activeHybridList.join(', ')}`);
  recipeParts.push(`Preamp-Färbung: ${preampData.label}`);

  const recipeBox = container.querySelector('#sound-recipe-text');
  if (recipeBox) {
    recipeBox.innerHTML = `<strong>Klang-Rezept:</strong> ${recipeParts.join(' • ')}`;
  }
}

function transferSoundRecipeToForm() {
  const container = document.getElementById('sound-architect');
  const recipeBox = container ? container.querySelector('#sound-recipe-text') : null;
  const messageField = document.getElementById('form-message');

  if (recipeBox && messageField) {
    const text = recipeBox.innerText;
    messageField.value = `[Gewünschtes Sound-Setup aus dem Klang-Architekten]:\n${text}\n\nMeine Projekt-Details: `;
    
    // Smooth scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    messageField.focus();
  }
}

/* ==========================================================================
   14. Klangkatalog - Das umfassende DrumHub Instrumentarium & Sound Vault
   ========================================================================== */
const SOUND_CATALOG_DATA = [
  // 1. Akustische Drumsets
  {
    cat: 'drumsets',
    catLabel: 'Drumsets',
    name: 'Kompaktes Akustik-Set (18 × 14, 12, 14)',
    model: '18" Kick, 12" Tom, 14" Floor Tom',
    sounds: 'Offene Jazzsounds, kleine trockene Kick, resonante Toms, Besengrooves, leise feindynamische Begleitung.',
    tags: ['Jazz', 'Trocken', 'Besen', 'Akustisch', 'Dynamisch'],
    setTarget: 'compact'
  },
  {
    cat: 'drumsets',
    catLabel: 'Drumsets',
    name: 'Mittleres Funk- & Pop-Set (20 × 16, 10, 12, 14)',
    model: '20" Kick, 10", 12" & 14" Toms',
    sounds: 'Kurze Funkkick, direkte Popsounds, knackige Toms, gedämpfte Retro-Grooves mit schnellem Punch.',
    tags: ['Funk', 'Pop', 'Knackig', 'Retro', 'Fokussiert'],
    setTarget: 'medium'
  },
  {
    cat: 'drumsets',
    catLabel: 'Drumsets',
    name: 'Studioset Allrounder (22 × 18, 10, 12, 14, 16)',
    model: '22" Kick, 10", 12", 14" & 16" Toms',
    sounds: 'Vielseitige Pop- und Rockdrums, trockene tiefe Grooves, offene Fills, breite Raumaufnahmen für Alben.',
    tags: ['Rock', 'Pop', 'Universell', 'Mehrspur', 'Punch'],
    setTarget: 'studio'
  },
  {
    cat: 'drumsets',
    catLabel: 'Drumsets',
    name: 'Großes Kessel-Set (24 × 20, 13, 14, 16)',
    model: '24" Kick, 13", 14" & 16" Floor Toms',
    sounds: 'Tiefe Bassdrum, schwere Akzente, große Tomfiguren, langsame druckvolle Grooves, filmische Trommelschläge.',
    tags: ['Cinematic', 'Heavy', 'Tiefe', 'Rock', 'Filmscore'],
    setTarget: 'large'
  },
  {
    cat: 'drumsets',
    catLabel: 'Drumsets',
    name: 'Resonierende Kessel & Spannreifen',
    model: 'Akustische Holz- & Metallkessel',
    sounds: 'Mitschwingende Texturen, Nachklänge anderer Instrumente, holzige Klicks, metallische Rim-Akzente, trockene Nebengeräusche.',
    tags: ['Textur', 'Obertöne', 'Resonanz', 'Rimclick']
  },

  // 2. 16 Master Snares
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Aluminium Snare 14 × 5,5',
    model: '14 × 5.5 Seamless Alu Shell',
    sounds: 'Trockener Backbeat, feine Ghostnotes, kurze Akzente, Besen, kontrollierte offene Schläge ohne störendes Nachhallen.',
    tags: ['Trocken', 'Ghostnotes', 'Funk', 'Besen'],
    snareTarget: 'alu'
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Bronze Snare 14 × 6,5',
    model: '14 × 6.5 Heavy Bronze',
    sounds: 'Voller Backbeat, kräftige Rimshots, singende Obertöne, tiefe breite Schläge mit enormer Durchsetzungskraft.',
    tags: ['Voller Körper', 'Rimshot', 'Rock', 'Obertöne'],
    snareTarget: 'bronze'
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Tama Vintage Superstar 14 × 7',
    model: '14 × 7 Parallelabhebung Classic',
    sounds: 'Warmer Vintage-Backbeat, sensible dynamische Teppichansprache, charakterstarke offene oder gedämpfte 70s-Sounds.',
    tags: ['Vintage', '70s', 'Warm', 'Parallelabhebung'],
    snareTarget: 'vintage'
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Kirsche Snare 14 × 5,5',
    model: '14 × 5.5 Cherry Wood',
    sounds: 'Holziger Backbeat, angenehm mittige Akzente, sensible Ghostnotes, wunderbarer organischer Cross Stick.',
    tags: ['Holzig', 'Mitten', 'Cross Stick', 'Organisch']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Tama Stahl Snare 14 × 5,5',
    model: '14 × 5.5 Steel Shell',
    sounds: 'Präsenter Anschlag, metallisches Klingeln, messerscharfe Rimshots, kurzer gedämpfter Funkklang.',
    tags: ['Stahl', 'Scharf', 'Funk', 'Crack']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Tama Stahl Snare 14 × 8',
    model: '14 × 8 Deep Steel',
    sounds: 'Tiefer Körper, gewaltige Balladen-Backbeats, offene Ringeffekte, schwere dramatische Akzente.',
    tags: ['Tiefer Kessel', 'Heavy', 'Ballade', 'Power']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Maple Snare 14 × 6,5',
    model: '14 × 6.5 Classic Maple',
    sounds: 'Vielseitiger Hauptsnaresound, voller Backbeat, Besen, Cross Stick, tiefe gedämpfte Varianten.',
    tags: ['Allround', 'Maple', 'Ahorn', 'Dynamisch']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: '„Nickel“ Snare 13 × 7',
    model: '13 × 7 Deep Small-Diameter',
    sounds: 'Kompakter Anschlag mit tieferem Kesselvolumen; prägnanter Mittenkörper bei schneller Ansprache.',
    tags: ['Kompakt', '13 Zoll', 'Mitten']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Maple Piccolo Snare 13 × 3,5',
    model: '13 × 3.5 Piccolo Maple',
    sounds: 'Kurzer Piccoloklang, hohe Akzente, blitzschnelle Ghostnotes, scharfe Sidesnare für Hip-Hop & Drum’n’Bass.',
    tags: ['Piccolo', 'Hip-Hop', 'Sidesnare', 'High Pitch'],
    snareTarget: 'piccolo'
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Birke Mini-Snare 10 × 2',
    model: '10 × 2 Pancake Birch',
    sounds: 'Sehr kurze hohe Effekte, kleine Snareimpulse, ideale organische Layer für elektronische Beat-Produktionen.',
    tags: ['Effekt', 'Elektronik-Layer', 'Ultra-Kurz']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Birke Sidesnare 10 × 3,5',
    model: '10 × 3.5 Birch Shell',
    sounds: 'Knackige Sidesnare, hohe Funkakzente, perkussive Wirbel und moderne Pop-Fills.',
    tags: ['Funk', 'Sidesnare', 'Knackig']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Stahl Timbale Snare 10 × 3,5',
    model: '10 × 3.5 Steel Timbale Hybrid',
    sounds: 'Metallischer Randklang, helle Fellschläge, direkter Wechsel zwischen Snare- und Latin-Timbale-Charakter.',
    tags: ['Latin', 'Timbale', 'Metallisch']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Holz Timbale Snare mit Jingles 10 × 3,5',
    model: '10 × 3.5 Wood w/ Jingles',
    sounds: 'Kurzer Holzanschlag kombiniert mit Schellennachklang, rasselnde Akzente, kompakte Percussion-Grooves.',
    tags: ['Schellen', 'Jingles', 'Percussiv', 'Hybrid'],
    snareTarget: 'timbale_jingle'
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Pappel Snare 14 × 4,5',
    model: '14 × 4.5 Poplar Wood',
    sounds: 'Flacher Backbeat, gedämpfte kurze Schläge, perfekt für sanfte Besenbegleitung und Singer-Songwriter.',
    tags: ['Sanft', 'Akustisch', 'Besen', 'Unaufdringlich']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Birke Snare 14 × 4,5',
    model: '14 × 4.5 Birch Shell',
    sounds: 'Kompakter Backbeat, direkte Akzente, crispe Ghostnotes, kurze punchige Fills.',
    tags: ['Direkt', 'Präzise', 'Birke']
  },
  {
    cat: 'snares',
    catLabel: '16 Snares',
    name: 'Santino Signature Snare 16 × 3',
    model: '16 × 3 Custom Flat Large-Diameter',
    sounds: 'Breite flache Trommeltextur, tieffrequente Obertöne, riesige Besenflächen, außergewöhnliche Cinematic-Backbeats.',
    tags: ['Custom', 'Signature', '16 Zoll', 'Cinematic', 'Besen'],
    snareTarget: 'signature'
  },

  // 3. World Percussion, Handdrums & Kisten
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Meinl Bass Box & Snare Box',
    model: 'PBASSBOX & PSNAREBOX',
    sounds: 'Fußgespielter akustischer Kickimpuls, trockenes tiefes Pochen, weicher Basspuls und rasselnder Backbeat.',
    tags: ['Fußperkussion', 'Acoustic Kick', 'Busker'],
    percTarget: 'cajon'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Artisan & Pickup Cajons',
    model: 'AEFLIH, AESELIH, PWCP100MB, Slaptop PTOPCAJ2WN',
    sounds: 'Trockene Slaps, tiefe Bassschläge, Fingerrollen, direkte Pickup-Abnahme für Reverb & Delay.',
    tags: ['Cajon', 'Slap', 'Handspiel', 'Flamenco'],
    percTarget: 'cajon'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Meinl Artist & Woodcraft Congas',
    model: 'MSA11, MSA1134, MSA1212 & WCO Serie',
    sounds: 'Tiefe bis hohe offene Töne, Slaps, Touches, mehrstimmige Congafiguren, tonale Bass-Ostinati.',
    tags: ['Latin', 'Afro-Cuban', 'Melodisch', 'Slap'],
    percTarget: 'congas'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Bongos Meinl Marathon & Woodcraft',
    model: 'MB400EBP, WB400VBK-M',
    sounds: 'Knackig-hohe offene Töne, trockene Fingerschläge, perlende Martillo-Muster, melodische Akzente.',
    tags: ['Bongos', 'High Pitch', 'Fingerspiel'],
    percTarget: 'congas'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Meinl Djembe Ensemble',
    model: 'HDJ4-XL, ADJ7-XL, PROADJ1-L, PROADJ3-XXL',
    sounds: 'Tiefer erdiger Bass, offener Ton, scharfer Slap, schnelle dynamische Steigerungen und Solo-Patterns.',
    tags: ['Djembe', 'Afro', 'Bass', 'Slap'],
    percTarget: 'surdos'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Darbuka / Doumbek & Ibo Drums',
    model: 'HE-3218, HE-3012, Ibo ID3GO, ID7RB & Davul',
    sounds: 'Doum, Tek, Ka, schnelle Fingerornamente; hohle ploppende Töne der Ibo; mächtiger Davul-Puls.',
    tags: ['Orient', 'Split-Hand', 'Udu', 'Davul']
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Rahmentrommeln, Tars & Mizhars',
    model: 'HD16AB, HD22AB, Tars FD22T/FD18T, Artisan Mizhars',
    sounds: 'Resonante tiefe Basstöne, filigrane Split-Hand-Texturen, modulierbare Fellspannung für orientalische & filmische Musik.',
    tags: ['Tar', 'Mizhar', 'Rahmentrommel', 'Cinematic', 'Meditation'],
    percTarget: 'frame'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Bendirs, Daf, Kanjira & Artisan Riq',
    model: 'FD16BE Schnarr-Bendir, FD20D Daf, FD7KA, AERIQ1',
    sounds: 'Fellton mit charakteristischem Schnarren, rollende Ringgeräusche des Daf, präzise Schellenwirbel des Riq.',
    tags: ['Bendir', 'Schnarren', 'Riq', 'Kanjira'],
    percTarget: 'frame'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Brasilien: Pandeiros, Bahia Surdo & Timbas',
    model: 'PA12/PA10, Surdo SUB18AB-M, SU22, TIM1435, Rebolo',
    sounds: 'Samba-Grooves mit Daumen, Fingerspitzen und Schellen; tiefer 18"/22" Surdo-Herzschlag, crispe Timba-Slaps.',
    tags: ['Brasilien', 'Samba', 'Pandeiro', 'Surdo', 'Batucada'],
    percTarget: 'surdos'
  },
  {
    cat: 'world',
    catLabel: 'World Percussion',
    name: 'Timbales & Attack Timbales',
    model: 'MTT1415BK, HYT1314, LC1BRASS, MDST8BK',
    sounds: 'Helle Kaskaden, schneidende Kessel-Cascara, Rimshots und lateinamerikanische Fills.',
    tags: ['Timbales', 'Cascara', 'Salsa']
  },

  // 4. Melodische Perkussion & Tuned
  {
    cat: 'tuned',
    catLabel: 'Melodie & Handpan',
    name: 'Meinl Handpan HPSTL100 (D-Kurd, 10 Töne)',
    model: 'HPSTL100 Edelstahl D-Kurd (D3/ A Bb C D E F G A C)',
    sounds: 'Schwebende metallische Melodien, tiefer Zentral-Ding, perkussive Zwischenanschläge, beruhigende Ambient-Klangflächen.',
    tags: ['Handpan', 'D-Kurd', 'Melodisch', 'Meditation', 'Atmosphäre'],
    percTarget: 'handpan'
  },
  {
    cat: 'tuned',
    catLabel: 'Melodie & Handpan',
    name: 'Octave Steel Tongue Drum (D-Kurd)',
    model: 'OSTD1BKE Octave Steel Tongue Drum',
    sounds: 'Glockenähnliche Melodielinien, langes Sustain, ruhige Pulsfiguren, mehrstimmige Obertöne.',
    tags: ['Tongue Drum', 'Glockig', 'Obertöne', 'Melodie'],
    percTarget: 'steeltongue'
  },
  {
    cat: 'tuned',
    catLabel: 'Melodie & Handpan',
    name: 'Kalimba-Kollektion (inkl. Wah & Pickup)',
    model: 'KA9-M, KA9WW-BK, KA5-S, KA7-M-BK, KA9P-AB',
    sounds: 'Intime gezupfte Holz- und Metallmelodien, akustische Resonanz-Wah-Effekte, direktes Tonabnehmersignal für Reverb & Delay.',
    tags: ['Kalimba', 'Zupfklang', 'Wah-Effekt', 'Pickup'],
    percTarget: 'kalimba'
  },

  // 5. Effekte, Natur & Cymbals
  {
    cat: 'fx',
    catLabel: 'Effekte & Natur',
    name: 'Naturgeräusche: Birds, The Night & The Roar',
    model: 'BI7RY/BI1NT Vögel, NI1AM Grillen, RO3BK Roar',
    sounds: 'Verblüffend echte Vogelrufe, mediterranes Grillenzirpen, raue rasselnde Geräuscheffekte für Soundtracks.',
    tags: ['Naturklänge', 'Foley', 'Filmmusik', 'Vögel', 'Grillen'],
    percTarget: 'effects'
  },
  {
    cat: 'fx',
    catLabel: 'Effekte & Natur',
    name: 'Rainmaker & Sea Drums',
    model: 'RA7BK Regenmacher, FD16SD & FD18SD-TF Meereswellen',
    sounds: 'Dichtes Regenrieseln, langes weißes Rauschen, an- und abschwellende Meeresbrandung für meditative Texturen.',
    tags: ['Regen', 'Meer', 'Rauschen', 'Atmosphäre'],
    percTarget: 'effects'
  },
  {
    cat: 'fx',
    catLabel: 'Effekte & Natur',
    name: 'Bill Saragosa Cone Stack & Metall-Effekte',
    model: 'CONE Bill Saragosa Series, Bowl, Galaxy, Crasher',
    sounds: 'Experimentelle metallische Resonanzen, industrielles Scheppern, futuristische Akzente und Trash-Percussion.',
    tags: ['Experimental', 'Industrie', 'Metall', 'Trash']
  },
  {
    cat: 'fx',
    catLabel: 'Effekte & Natur',
    name: 'Shaker & Caxixi Arsenal',
    model: 'Studio Shaker SH16, SH22, SH88BK, CAX1/2/3',
    sounds: 'Feinst artikulierte Rhythmusteppiche, kurze Ghost-Shakes, schwere rollende Caxixi-Akzente.',
    tags: ['Shaker', 'Caxixi', 'Rhythmus', 'Puls'],
    percTarget: 'shakers'
  },
  {
    cat: 'fx',
    catLabel: 'Effekte & Natur',
    name: 'Meinl Byzance Cymbals & Stacks',
    model: '14" Dark HiHat, 15" Jazz Thin, 22" Rides (Vintage Pure/Monophonic/Extra Dry), Smack Stack, Gen X',
    sounds: 'Dunkle erdige Beckentexturen, feine Stockdefinition, explosive Trash-Stacks und Handclap-artige Backbeats.',
    tags: ['Byzance', 'HiHat', 'Ride', 'Smack Stack', 'Trash']
  },

  // 6. Synthesizer, Sampler & Hybrid
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Sequential Prophet-6',
    model: '6-stimmiger analoger Flaggschiff-Synthesizer',
    sounds: 'Opulente warme Pads, analoge Bässe, polyphone Synth-Brass-Akkorde, rhythmische Zupfsequenzen.',
    tags: ['Prophet-6', 'Analog', 'Polyphon', 'Warm', 'Bass'],
    hybridTarget: 'prophet'
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Behringer DeepMind 12 & Model D',
    model: 'DeepMind 12 Analog & Model D Minimoog-Klon',
    sounds: 'Gigantische 12-stimmige Modulationsflächen; monophone drückende Subbässe und aggressive Leads.',
    tags: ['DeepMind', 'Model D', 'Minimoog', 'Subbass'],
    hybridTarget: 'prophet'
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Behringer TD-3 & Edge Synthesizer',
    model: 'TD-3 Acid Bassline & Edge Percussion Synth',
    sounds: 'Zwitschernde resonante 303-Acid-Linien, perkussive Synthesizer-Sequenzen, metallische DSI-Klicks.',
    tags: ['Acid', 'TD-3', 'Edge', 'Sequencer']
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Nord Drum 3P Synthesizer',
    model: 'Modellierter Drum- & Percussion-Synthesizer',
    sounds: 'Futuristische analoge Drums, gestimmte Glocken, synthetische Toms, weißes Rauschen und FM-Pings.',
    tags: ['Nord Drum', 'Elektronisch', 'Tuned Synth', 'FM'],
    hybridTarget: 'nord_drum'
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Korg Wavedrum Dynamic Synthesizer',
    model: 'Physical Modeling Percussion Synthesizer',
    sounds: 'Verformbare Trommeltexturen, physikalisch reagierende Schläge, dynamisches Schaben und Hybridklänge.',
    tags: ['Wavedrum', 'Physical Modeling', 'Hybrid']
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Evans Sensory Percussion & Portal',
    model: 'Multizonen Drum-Sensoren mit Machine-Learning Software',
    sounds: 'Akustisches Schlagzeugspiel steuert komplexe Software-Instrumente, Sample-Schichten und Filterbewegungen.',
    tags: ['Sensory Percussion', 'AI', 'Trigger', 'Zukunft'],
    hybridTarget: 'sensory'
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Akai MPC One & Akai Force',
    model: 'Stand-alone Sampler & Groove Workstations',
    sounds: 'Mehrspurige Samplearrangements, zerhackte Drum-Loops, live abgefeuerte Gesangs- und Percussion-Samples.',
    tags: ['MPC', 'Sampling', 'Beats', 'Looping']
  },
  {
    cat: 'synths',
    catLabel: 'Synths & Hybrid',
    name: 'Teenage Engineering OP-1',
    model: 'Mobiler Synthesizer, Sampler & 4-Track Recorder',
    sounds: 'Lo-Fi Synthesizerklänge, experimentell geschnittene Tonfragmente, Tape-Stopps und verspielte FM-Melodien.',
    tags: ['OP-1', 'Lo-Fi', 'Tape', 'Experimental']
  },

  // 7. Preamps, Mikrofone & Effekte
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'Warm Audio WA273 & WA412 Preamps',
    model: 'Neve 1073- & API 312-Style mit Carnhill-Übertragern',
    sounds: 'Diskrete Class-A Vorverstärkung mit sattem, dickem Mittenpunch auf Kick, Snare und Toms.',
    tags: ['Neve', 'API', 'Übertrager', 'Sättigung', 'Punch'],
    preampTarget: 'warm_audio'
  },
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'SPL GoldMike Mk2 Röhren-Preamp',
    model: 'Diskreter Röhrenvorverstärker mit Flair-Schaltung',
    sounds: 'Warme Röhrenobertöne, seidige Höhenglättung für Becken, Overheads, Vocals und Handpan.',
    tags: ['Röhre', 'SPL', 'Seidig', 'Wärme'],
    preampTarget: 'spl_tube'
  },
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'Empress Echosystem & Empress Reverb',
    model: 'High-End Dual Engine Studio Pedale',
    sounds: 'Rhythmische Tape-Echos, gigantische Kirchen- und Ambient-Hallräume, schwebende Shimmer-Pads.',
    tags: ['Empress', 'Reverb', 'Delay', 'Ambient'],
    hybridTarget: 'reverb'
  },
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'Neon Egg Planetarium 3 & Glou-Glou Loupé',
    model: 'Moduliertes Reverb/Kompressor & Granular Looper',
    sounds: 'Atmosphärisches rhythmisch pumpendes Reverb; verfremdete Granularschleifen und Vintage Tape-Wärme.',
    tags: ['Planetarium', 'Looper', 'Granular', 'Modulation'],
    hybridTarget: 'loupe'
  },
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'Audix Studio Elite Drumcase & Microtech Gefell M930',
    model: 'Audix D6, i5, SCX25A Lollipops, A231, Gefell M930',
    sounds: 'Glasklare Transienten, tiefer Kickbass, seidige Becken und detailreiche Raumabbildung.',
    tags: ['Audix', 'Gefell', 'Mikrofone', 'Overheads']
  },
  {
    cat: 'preamps',
    catLabel: 'Preamps & Effekte',
    name: 'DIY Focal Polyflex Subkick & Telefonmikrofon',
    model: 'Tieffrequenz-Wandler & Lo-Fi Spezialkapsel',
    sounds: 'Ergänzender 30–60 Hz Subbass unter der Kickdrum; schmalbandige Retro-Telefon-Sounds für Breaks.',
    tags: ['Subkick', 'Subbass', 'Telefon', 'Lo-Fi'],
    preampTarget: 'subkick'
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
