/* ================================================================
   MAIN.JS v2 — Portfolio Interactions
   Mohamed Bassem Khemissi · DigiBuild Solutions
   Modern SaaS Aesthetic Edition + Multilingual (EN / FR / DE)
   ================================================================ */

'use strict';

/* ══════════════════════════════════
   I18N ENGINE
══════════════════════════════════ */
const I18N = (() => {
  // Typewriter phrases — updated on lang switch
  let _phrases = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.en)
    ? TRANSLATIONS.en.typewriterPhrases
    : ['BIM Manager & Coordinator', 'Founder · DigiBuild Solutions'];

  const LANG_FLAGS = { en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪' };
  const LANG_CODES = { en: 'EN', fr: 'FR', de: 'DE' };

  function applyLang(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (t[k] !== undefined) el.textContent = t[k];
    });

    // Update innerHTML (for elements with <strong> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml;
      if (t[k] !== undefined) el.innerHTML = t[k];
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (t[k] !== undefined) el.placeholder = t[k];
    });

    // Update typewriter
    if (t.typewriterPhrases) _phrases = t.typewriterPhrases;

    // Update html[lang]
    document.documentElement.lang = lang;

    // Persist
    localStorage.setItem('mbk-lang', lang);

    // Update switcher UI
    updateSwitcherUI(lang);
  }

  function updateSwitcherUI(lang) {
    const codeEl = document.getElementById('langCode');
    if (codeEl) codeEl.textContent = LANG_CODES[lang] || lang.toUpperCase();

    document.querySelectorAll('.lang-option').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });
  }

  function getPhrases() { return _phrases; }

  function getSavedLang() {
    const saved = localStorage.getItem('mbk-lang');
    if (saved && TRANSLATIONS[saved]) return saved;
    // Try browser language
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return TRANSLATIONS[browser] ? browser : 'en';
  }

  return { applyLang, getPhrases, getSavedLang };
})();

/* ══════════════════════════════════
   LANGUAGE SWITCHER DROPDOWN
══════════════════════════════════ */
(() => {
  const switcher = document.getElementById('langSwitcher');
  const btn      = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');
  if (!switcher || !btn) return;

  const toggle = () => {
    const open = switcher.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  };
  const close = () => {
    switcher.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });

  dropdown?.addEventListener('click', e => {
    const opt = e.target.closest('.lang-option');
    if (!opt) return;
    I18N.applyLang(opt.dataset.lang);
    close();
  });

  document.addEventListener('click', e => {
    if (!switcher.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Apply saved / browser language on load
  I18N.applyLang(I18N.getSavedLang());
})();

/* ══════════════════════════════════
   PAGE LOADER
══════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600);
  }, 1500);
});

/* ══════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════ */
(() => {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  const raf = () => {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  };
  raf();

  const els = 'a,button,.proj-card,.feature-card,.faq-q,.tab-btn,.filter-btn,.contact-item,.stat-item,.hero-trust-badge';
  document.addEventListener('mouseover', e => { if (e.target.closest(els)) document.body.classList.add('c-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(els)) document.body.classList.remove('c-hover'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
})();

/* ══════════════════════════════════
   NAVIGATION
══════════════════════════════════ */
(() => {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  const navAs  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  burger?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      burger?.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Active section tracking
  const sections = document.querySelectorAll('section[id]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { threshold: 0.25 }).observe ? sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      });
    }, { threshold: 0.25 }).observe(s);
  }) : null;
})();

/* ══════════════════════════════════
   SMOOTH ANCHORS (nav offset)
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = (document.getElementById('nav')?.offsetHeight || 68) + 16;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════
   TYPEWRITER
══════════════════════════════════ */
(() => {
  const el = document.getElementById('typeText');
  if (!el) return;

  const phrases = [
    'BIM Manager & Coordinator',
    'Founder · DigiBuild Solutions',
    'ISO 19650 Specialist',
    'openBIM & IFC Expert',
    'BIM Automation Engineer',
    'Digital Construction Leader',
  ];

  let pi = 0, ci = 0, del = false;
  const TYPE = 65, DEL = 32, PAUSE = 2400, PREPAUSE = 350;

  const tick = () => {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { del = true; return setTimeout(tick, PAUSE); }
    } else {
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, PREPAUSE); }
    }
    setTimeout(tick, del ? DEL : TYPE);
  };
  setTimeout(tick, 900);
})();

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
(() => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════
   STAT COUNTERS
══════════════════════════════════ */
(() => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const suf = el.dataset.suffix || '';
      const dur = 1600;
      const t0  = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const run  = now => {
        const v = Math.round(ease(Math.min((now - t0) / dur, 1)) * end);
        el.textContent = v + suf;
        if (v < end) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════
   HERO DASHBOARD — Clash counter anim
══════════════════════════════════ */
(() => {
  const el = document.getElementById('heroClashes');
  if (!el) return;
  // Count down from 247 to 0 (dramatic effect)
  let v = 247;
  const run = () => {
    el.textContent = v;
    if (v <= 0) { el.textContent = '0'; return; }
    v = Math.max(0, v - Math.ceil(v * 0.08 + 1));
    setTimeout(run, 40);
  };
  setTimeout(run, 1800);
})();

/* ══════════════════════════════════
   PROJECT FILTER
══════════════════════════════════ */
(() => {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');

      cards.forEach(c => {
        const cats = (c.dataset.category || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        c.classList.toggle('hidden', !show);
        if (show) c.style.animation = 'fadeInUp .35s ease both';
      });
    });
  });
})();

/* ══════════════════════════════════
   PROJECT DETAIL MODAL
══════════════════════════════════ */
(() => {
  const modal   = document.getElementById('projModal');
  const panel   = document.getElementById('projModalPanel');
  const bg      = document.getElementById('projModalBg');
  if (!modal || !panel) return;

  const data = {
    1: {
      title: 'Lusail Mixed-Use Supertall Tower', location: 'Lusail, Qatar',
      tag: 'Architecture · BIM Coordination', tagClass: 'badge-blue',
      img: 'assets/images/project_tower.jpg',
      desc: `<p>A landmark 68-floor mixed-use supertall in Lusail Marina District, Qatar — comprising premium residential floors (F04–F55), a 5-star hotel (F56–F65), and a multi-level commercial podium. Delivered under full ISO 19650 protocols with BIM 360 as the Common Data Environment.</p><p>Responsibilities included BIM Execution Plan authorship, LOD 400 architecture + coordination modeling, multidisciplinary federated model management, and client-facing BIM deliverables. All 2,400+ coordination clashes resolved to zero prior to construction commencement.</p>`,
      deliverables: ['LOD 400 Architecture Model (Revit 2024)','Multidisciplinary Federated Model','BIM Execution Plan (BEP) + CDE Setup','Clash Detection & Resolution Reports','4D Construction Sequencing Model','IFC 4 Export Package for Client Authority'],
      tools: ['Autodesk Revit 2024','Navisworks Manage','BIM 360 / ACC','Dynamo BIM','Bluebeam Revu','IFC 4'],
      metrics: [{ v:'68', l:'Floors'}, {v:'0', l:'Unresolved Clashes'}, {v:'LOD 400', l:'Model Level'}],
    },
    2: {
      title: 'King Abdulaziz Medical City Expansion', location: 'Riyadh, Saudi Arabia',
      tag: 'Structural · MEP · ISO 19650', tagClass: 'badge-violet',
      img: 'assets/images/project_hospital.jpg',
      desc: `<p>350-bed hospital campus expansion delivered under strict Saudi MOH BIM requirements and full ISO 19650 governance. The project required highly detailed structural and MEP BIM models suitable for fabrication-level coordination.</p><p>Python-based QA scripts automated daily model auditing across 14 disciplines. COBie data structured for direct FM system integration, enabling the facility management team to accept digital handover with zero manual data entry.</p>`,
      deliverables: ['ISO 19650-compliant BIM Execution Plan','Full Structural BIM (Concrete + Steel)','MEP Coordination Model (HVAC, Plumbing, Electrical)','Navisworks Clash Reports & Resolution Log','COBie 2.4 Data Package for FM Handover','Python QA/QC Automation Scripts'],
      tools: ['Revit Structure','Revit MEP','Robot Structural Analysis','Navisworks','Solibri','Python 3','IFC 4'],
      metrics: [{v:'350', l:'Beds'}, {v:'14', l:'Disciplines Coordinated'}, {v:'100%', l:'COBie Coverage'}],
    },
    3: {
      title: 'Tunis–Carthage Airport — Terminal 3', location: 'Tunis, Tunisia',
      tag: 'Architecture · openBIM · IFC 4', tagClass: 'badge-blue',
      img: 'assets/images/project_airport.jpg',
      desc: `<p>New 65,000 m² international terminal designed to serve 12 million passengers per year. The project adopted a full openBIM methodology — IFC 4 as the primary exchange format and Solibri for model checking, enabling seamless collaboration with French, Tunisian, and Italian design teams.</p><p>Parametric façade system modeled with Dynamo generating 2,400+ unitized panels. Complex curved roof structure coordinated with structural engineers using linked IFC models, achieving zero hard clashes in the structure-architecture interface.</p>`,
      deliverables: ['LOD 350 Architecture BIM (Revit)','Parametric Façade Library (Dynamo)','IFC 4 Exchange Package (openBIM compliant)','Solibri Model Checker Reports','Room Data Sheets (1,200+ spaces)','Quantity Take-off Schedules'],
      tools: ['Revit Architecture','Dynamo BIM','Solibri Model Checker','IFC 4','AutoCAD','BIM Collaborate Pro'],
      metrics: [{v:'65K', l:'m² Floor Area'}, {v:'2,400+', l:'Façade Panels'}, {v:'IFC 4', l:'Exchange Format'}],
    },
    4: {
      title: 'Oran Smart Eco-District Masterplan', location: 'Oran, Algeria',
      tag: 'Multi-Discipline · BIM Automation', tagClass: 'badge-green',
      img: 'assets/images/project_ecodistrict.jpg',
      desc: `<p>12-block sustainable mixed-use urban district spanning 280,000 m² of built area. The project scale demanded a highly automated BIM workflow — custom pyRevit scripts handled model QA/QC, sheet generation, naming compliance, and data export across 8 Revit models.</p><p>Dynamo scripts automated the layout of 4,000+ parking spaces, MEP space analysis, and solar shading study geometry. The automation suite reduced QA/QC time from 40 hours/week to under 12 hours, freeing the team for coordination problem-solving.</p>`,
      deliverables: ['Master BIM Coordination Protocol','Multidisciplinary Revit Model Suite (12 blocks)','pyRevit QA/QC Automation Suite','Dynamo Generative Design Scripts','Federated Navisworks Coordination Model','ISO 19650 CDE Setup (BIM 360)'],
      tools: ['Revit 2024','pyRevit','Python 3.11','Dynamo 2.18','Navisworks','BIM 360','Excel API'],
      metrics: [{v:'280K', l:'m² Built Area'}, {v:'70%', l:'QA/QC Time Saved'}, {v:'12', l:'Coordinated Blocks'}],
    },
    5: {
      title: 'NEOM Industrial Utility Complex', location: 'NEOM, Saudi Arabia',
      tag: 'MEP · Clash Coordination · Python', tagClass: 'badge-amber',
      img: 'assets/images/project_industrial.jpg',
      desc: `<p>Mission-critical industrial utility complex for the NEOM Gigaproject — 4,200+ tagged equipment items, 87 km of process piping, and 38 km of HVAC ductwork across 6 buildings.</p><p>A Python-based automated clash reporting engine ran nightly Navisworks batch exports, categorizing and assigning clashes to discipline leads with priority scoring. This reduced weekly coordination meetings from 4 hours to 45 minutes. Achieved 100% clash-free milestone certification at LOD 400.</p>`,
      deliverables: ['LOD 400 MEP BIM Models (6 buildings)','P&ID to BIM Integration Workflow','Python Automated Clash Reporting Engine','Equipment Tag Database & Schedule','Installation Sequencing Model (4D)','ACC-hosted CDE with full audit trail'],
      tools: ['Revit MEP 2024','Navisworks Manage','Python 3','Autodesk Construction Cloud (ACC)','Plant 3D','SmartPlant'],
      metrics: [{v:'87km', l:'Piping Modeled'}, {v:'4,200+', l:'Equipment Tags'}, {v:'100%', l:'Clash-Free'}],
    },
    6: {
      title: 'Grand Tunis Beachfront Residential', location: 'La Marsa, Tunisia',
      tag: 'Architecture · Structure · Digital Twin', tagClass: 'badge-violet',
      img: 'assets/images/project_residential.jpg',
      desc: `<p>Three luxury residential towers (B+G+18 each), 420 units total, on the La Marsa seafront. Full architecture and structural BIM at LOD 500 — construction-ready with embedded asset data for digital twin handover.</p><p>Automated quantity take-offs via Revit API schedules and Excel integration saved 3 weeks of manual estimation. Digital twin data model structured for Autodesk Tandem handover, enabling post-occupancy FM integration.</p>`,
      deliverables: ['LOD 500 Architecture & Structure BIM','Digital Twin Data Model (Autodesk Tandem)','Automated QTO Package','Construction Documentation Package','Apartment Unit Type Library (28 variants)','FM-ready Asset Data Schedule'],
      tools: ['Revit Architecture & Structure','Robot Structural Analysis','Autodesk Tandem','Bluebeam Revu','Excel (Revit API)','IFC 4'],
      metrics: [{v:'420', l:'Residential Units'}, {v:'LOD 500', l:'Model Level'}, {v:'3 Weeks', l:'Estimation Saved'}],
    },
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openModal = id => {
    const p = data[id]; if (!p) return;

    const delivs  = p.deliverables.map(d => `<li>${d}</li>`).join('');
    const tools   = p.tools.map(t => `<li>${t}</li>`).join('');
    const metrics = p.metrics.map(m => `<div class="md-metric"><div class="md-metric-val">${m.v}</div><div class="md-metric-lbl">${m.l}</div></div>`).join('');

    panel.innerHTML = `
      <button class="modal-close" id="projClose" aria-label="Close">✕</button>
      <div class="md-img"><img src="${p.img}" alt="${p.title}" /></div>
      <div class="md-body">
        <div class="md-meta">
          <span class="badge ${p.tagClass}">${p.tag}</span>
          <span style="font-family:var(--font-mono);font-size:.7rem;color:var(--text-muted);display:flex;align-items:center;gap:4px;">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${p.location}
          </span>
        </div>
        <h2 class="md-title">${p.title}</h2>
        <div class="md-desc">${p.desc}</div>
        <div class="md-grid">
          <div class="md-section"><h4>Key Deliverables</h4><ul>${delivs}</ul></div>
          <div class="md-section"><h4>Technology Stack</h4><ul>${tools}</ul></div>
        </div>
        <div class="md-metrics">${metrics}</div>
      </div>`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('projClose')?.addEventListener('click', closeModal);
    document.getElementById('projClose')?.focus();
  };

  document.getElementById('projectsGrid')?.addEventListener('click', e => {
    const card = e.target.closest('.proj-card');
    if (card) openModal(parseInt(card.dataset.id, 10));
  });
  document.getElementById('projectsGrid')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.proj-card');
      if (card) { e.preventDefault(); openModal(parseInt(card.dataset.id, 10)); }
    }
  });
  bg?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
})();

/* ══════════════════════════════════
   VIDEO MODAL
══════════════════════════════════ */
(() => {
  const modal  = document.getElementById('videoModal');
  const openB  = document.getElementById('watchIntroBtn');
  const closeB = document.getElementById('videoClose');
  const bg     = document.getElementById('videoBg');
  const video  = document.getElementById('introVideo');
  if (!modal || !openB) return;

  const open  = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    if (video) {
      if (video.ended) video.currentTime = 0;
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    }
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if (video) video.pause();
  };

  openB.addEventListener('click', open);
  closeB?.addEventListener('click', close);
  bg?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key==='Escape' && modal.classList.contains('open')) close(); });
})();

/* ══════════════════════════════════
   EXPERTISE TABS
══════════════════════════════════ */
(() => {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      document.getElementById(`tab-${target}`)?.classList.add('active');

      // Re-trigger reveal animations in active tab
      document.querySelectorAll(`#tab-${target} .reveal`).forEach(el => {
        el.classList.remove('in');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
      });
    });
  });

  // Init first panel reveals
  document.querySelectorAll('#tab-arch .reveal').forEach(el => el.classList.add('in'));
})();

/* ══════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════ */
(() => {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      ans.setAttribute('aria-hidden', !open);
    });
  });
})();

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
(() => {
  const form     = document.getElementById('contactForm');
  const submit   = document.getElementById('fSubmit');
  const btnText  = document.getElementById('fBtnText');
  const success  = document.getElementById('fSuccess');
  const resetBtn = document.getElementById('fResetBtn');
  if (!form) return;

  const TARGET_EMAIL = 'bassem@digibuild-solutions.com';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('fName')?.value.trim();
    const email   = document.getElementById('fEmail')?.value.trim();
    const company = document.getElementById('fCompany')?.value.trim() || 'Not specified';
    const subj    = document.getElementById('fSubject')?.value.trim();
    const msg     = document.getElementById('fMsg')?.value.trim();

    if (!name || !email || !subj || !msg) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('fEmail')?.focus();
      return;
    }

    submit.disabled = true;
    const origText = btnText.textContent;
    btnText.textContent = 'Sending…';

    const payload = {
      name: name,
      email: email,
      company: company,
      subject: subj,
      message: msg,
      _subject: `New Inquiry from ${name} [${company}] — DigiBuild Solutions`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      form.reset();
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } catch (err) {
      console.warn('FormSubmit endpoint notice, opening direct mail client:', err);
      // Fallback: opens mail client prefilled to bassem@digibuild-solutions.com
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${msg}`
      )}`;
      window.location.href = mailtoUrl;

      form.reset();
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } finally {
      submit.disabled = false;
      btnText.textContent = origText;
    }
  });

  resetBtn?.addEventListener('click', () => {
    if (success) success.style.display = 'none';
    form.style.display = 'block';
  });
})();
