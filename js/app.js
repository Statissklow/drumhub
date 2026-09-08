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

  // Section to background slide mapping (8 Sections -> 8 Completely Unique Images):
  // Slide 0: drumset.jpg
  // Slide 1: splitset.jpg
  // Slide 2: studio.jpg
  // Slide 3: stuhl.JPG
  // Slide 4: preamps.jpg
  // Slide 5: mikrofon.jpg
  // Slide 6: eingangII.JPG
  // Slide 7: hinten.jpg
  const sectionSlideMap = {
    'hero': 0,        // Schlagzeug Start
    'showcase': 1,    // Snare & Becken Session
    'studio': 2,      // Aufnahmeraum Gesamteindruck
    'services': 3,    // Regieplatz & Leistungen
    'calculator': 4,  // Analoge Röhren-Preamps & Rechner
    'equipment': 5,   // Audix Mikrofonie & High-End Technik
    'gallery': 6,     // Studio Lounge & Einblicke
    'contact': 7      // Akustikwand & Kontakt
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



