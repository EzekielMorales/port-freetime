import React, { useState, useEffect, useRef, Suspense } from 'react';
import { PassengerData } from '../types';
import { CabinWindow } from './CabinWindow';
import { ErrorBoundary } from './ErrorBoundary';
import { sound } from '../utils/audio';
import { asset } from '../utils/assets';

const PandaExperience = React.lazy(() => import('./PandaExperience/Experience'));

interface NextPageProps {
  passenger: PassengerData;
  onBack: () => void;
}

interface CaseStudy {
  title: string;
  desc: string;
  href?: string;
  shots: string[];
}

interface TimelineItem {
  year: string;
  route: string;
  dateRange?: {
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
  };
  company: string;
  href?: string;
  role: string;
  desc: string;
  current?: boolean;
  logos: Array<{ src: string; name?: string; url?: string; bg?: string }>;
  cases?: CaseStudy[];
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2026',
    route: 'CBI',
    company: 'MyMarket',
    href: '#',
    role: 'Software Development Engineer in Test (SDET) - Internship',
    desc: 'Designed comprehensive test cases and scenarios across the application. Implemented automated Unit tests (Jest), API testing (Bruno), and End-to-End (E2E) test suites with Playwright to ensure robust software quality.',
    current: true,
    logos: [
      { src: '/folio/logo-mymarket-box.png', name: 'Company', url: '#' },
      { src: '/folio/logo-mymarket-basket.png', name: 'MyMarket', url: '#' },
    ],
    cases: [
      {
        title: 'Test Automation Suite',
        desc: 'Unit, API, and End-to-End testing with Jest, Bruno & Playwright',
        href: '#',
        shots: [
          '/folio/shot-jest.svg',
          '/folio/shot-playwright.svg',
          '/folio/shot-bruno.png',
        ],
      },
    ],
  },
  {
    year: '2026',
    route: 'CBI',
    company: 'MyShelf',
    href: '#',
    role: 'Software Development Engineer in Test (SDET) - Internship',
    desc: 'Internal book borrowing and returning management system. Designed comprehensive test cases and scenarios across the application, implementing automated Unit tests with Jest and API testing with Bruno to ensure system reliability and data accuracy.',
    logos: [
      { src: '/folio/logo-mymarket-box.png', name: 'Company', url: '#' },
      { src: '/folio/logo-myshelf.png', name: 'MyShelf', url: '#' },
    ],
    cases: [
      {
        title: 'Test Automation Suite',
        desc: 'Unit and API testing with Jest & Bruno',
        href: '#',
        shots: [
          '/folio/shot-jest.svg',
          '/folio/shot-bruno.png',
        ],
      },
    ],
  },
  {
    year: '2025',
    route: 'BKK',
    dateRange: {
      startMonth: 'Jul',
      startYear: '2025',
      endMonth: 'Apr',
      endYear: '2026',
    },
    company: 'Cultura',
    href: '#',
    role: 'Full-Stack Developer & QA Engineer | Collaborated with NECTEC',
    desc: 'Tourism Community Management System developed in collaboration with NECTEC. Built full-stack features using React, TypeScript & Express.js, and implemented automated End-to-End (E2E) testing with Playwright to ensure software reliability.',
    logos: [
      { src: '/folio/logo-nectec.png', name: 'NECTEC', url: '#', bg: '#ffffff' },
      { src: '/folio/logo-cultura.png', name: 'Cultura', url: '#', bg: '#0b0f14' },
    ],
    cases: [
      {
        title: 'Full-Stack Web Architecture',
        desc: 'Built with React, TypeScript & Tailwind CSS with Playwright automated E2E testing',
        href: '#',
        shots: [
          '/folio/shot-react.svg',
          '/folio/shot-typescript.svg',
          '/folio/shot-tailwind.svg',
        ],
      },
    ],
  },
  {
    year: '2024',
    route: 'BKK',
    dateRange: {
      startMonth: 'Nov',
      startYear: '2024',
      endMonth: 'Mar',
      endYear: '2025',
    },
    company: 'Work Request System',
    href: '#',
    role: 'Web Application Developer | Collaborated with ClickNext Bangkok',
    desc: 'Internal work request management system developed to streamline task assignments and tracking. Utilized Laravel Framework (PHP) to build a robust web application architecture, collaborating with team Cluster 3 to ensure system reliability.',
    logos: [
      { src: '/folio/logo-clicknext.png', name: 'ClickNext Bangkok', url: '#', bg: '#ffffff' },
      { src: '/folio/logo-wrs.png', name: 'Work Request System (WRS)', url: '#', bg: '#ffffff' },
    ],
    cases: [
      {
        title: 'Task & Workflow Architecture',
        desc: 'Built with Laravel Framework (PHP) & MySQL database management',
        href: '#',
        shots: [
          '/folio/shot-php.svg',
          '/folio/shot-laravel.svg',
          '/folio/shot-mysql.svg',
        ],
      },
    ],
  },
];

// Helper to identify tech tool name for tooltips
const getShotName = (shotUrl: string) => {
  if (shotUrl.includes('jest')) return 'Jest';
  if (shotUrl.includes('playwright')) return 'Playwright';
  if (shotUrl.includes('bruno')) return 'Bruno';
  if (shotUrl.includes('react')) return 'React';
  if (shotUrl.includes('typescript')) return 'TypeScript';
  if (shotUrl.includes('tailwind')) return 'Tailwind CSS';
  if (shotUrl.includes('laravel')) return 'Laravel';
  if (shotUrl.includes('php')) return 'PHP';
  if (shotUrl.includes('mysql')) return 'MySQL';
  return '';
};

// Exact SVG path for the curve connecting the plane to the rail
const So = 'M43 0V7.3A39 39 0 0 1 21.71 42.05A39 39 0 0 0 0.5 76.75V110';

// In-flight memories between takeoff and landing
const MEMORY_CARDS = [
  { id: 1, src: '/folio/memories/mem-1.png', label: 'CHERUB ANGELS', tilt: -14, x: -70, y: 3, fit: 'contain' as const },
  { id: 2, src: '/folio/memories/mem-2.png', label: 'FERRARI LEGO', tilt: -7, x: -35, y: -2, fit: 'contain' as const },
  { id: 3, src: '/folio/memories/mem-3.png', label: 'PINK LILY', tilt: 0, x: 0, y: -4, fit: 'contain' as const },
  { id: 4, src: '/folio/memories/mem-4.png', label: 'RODEO COWBOY', tilt: 7, x: 35, y: -2, fit: 'contain' as const },
  { id: 5, src: '/folio/memories/mem-5.jpg', label: 'SUPER VEGITO', tilt: 14, x: 70, y: 3, fit: 'cover' as const, position: '72% 25%' },
];

export const NextPage: React.FC<NextPageProps> = ({ passenger, onBack }) => {
  // Shade level: 0 = fully open (Light theme), 1 = fully closed (Dark theme)
  const [shade, setShade] = useState(0);
  const isDarkMode = shade > 0.45;

  // Track expanded state for 3D card stacks
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({});

  // Hovered memory card index
  const [hoveredMemory, setHoveredMemory] = useState<number | null>(null);

  // Track if user has scrolled down into the cloud descent or 3D Papercraft World
  const [isInsidePaperWorld, setIsInsidePaperWorld] = useState(false);
  const descentRef = useRef<HTMLElement | null>(null);
  const paperWorldRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const descentEl = descentRef.current;
    const paperEl = paperWorldRef.current;

    const visibleElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleElements.add(entry.target);
          } else {
            visibleElements.delete(entry.target);
          }
        });
        setIsInsidePaperWorld(visibleElements.size > 0);
      },
      { threshold: 0.05 }
    );

    if (descentEl) observer.observe(descentEl);
    if (paperEl) observer.observe(paperEl);

    return () => observer.disconnect();
  }, []);

  const toggleCase = (key: string) => {
    sound.playSlide(0.35);
    setExpandedCases((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const trackRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  // Sync theme with html root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.dataset.theme = 'dark';
    } else {
      delete root.dataset.theme;
    }
  }, [isDarkMode]);

  // Scroll-driven flight path animation (Blue line flows down as user scrolls)
  useEffect(() => {
    const track = trackRef.current;
    const pathEl = pathRef.current;
    const railEl = railRef.current;
    if (!track || !pathEl || !railEl) return;

    const curveLength = 118;
    const curveHeight = 110;
    let railHeight = railEl.offsetHeight || 500;
    let startY = pathEl.getBoundingClientRect().top + window.scrollY;

    let currentP = 0;
    let targetP = 0;
    let rafId = 0;

    const updateMeasurements = () => {
      if (!pathEl || !railEl) return;
      railHeight = railEl.offsetHeight || 500;
      startY = pathEl.getBoundingClientRect().top + window.scrollY;
    };

    const onScroll = () => {
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start line flow when the track scrolls into view (~75% from top)
      const startOffset = windowH * 0.75;
      const totalTrackH = track.offsetHeight || 600;

      const scrolledDistance = startOffset - trackRect.top;
      const p = Math.min(1, Math.max(0, scrolledDistance / (totalTrackH * 0.82)));
      targetP = p;

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      rafId = 0;
      const diff = targetP - currentP;
      currentP = Math.abs(diff) < 0.0004 ? targetP : currentP + diff * 0.14;

      const totalDistance = curveLength + railHeight;
      const currentDistance = currentP * totalDistance;

      const curveP = Math.min(1, Math.max(0, currentDistance / curveLength));
      const railP = railHeight ? Math.min(1, Math.max(0, (currentDistance - curveLength) / railHeight)) : 0;

      pathEl.style.setProperty('--curve-p', curveP.toFixed(4));
      pathEl.style.setProperty('--rail-p', railP.toFixed(4));

      // Calculate current absolute Y position of the advancing line tip
      const tipY = startY + curveHeight * curveP + railHeight * railP;

      // Light up dots as the blue line flows past them
      const dots = track.querySelectorAll<HTMLElement>('.tl-dot');
      dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const dotY = rect.top + rect.height / 2 + window.scrollY;
        const isLit = dotY <= tipY + 6;
        dot.classList.toggle('is-lit', isLit);
      });

      if (Math.abs(targetP - currentP) > 0.0004) {
        rafId = requestAnimationFrame(animate);
      }
    };

    updateMeasurements();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateMeasurements();
      onScroll();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="folio min-h-screen relative overflow-x-hidden selection:bg-[#2c6fff] selection:text-white">
      
      {/* ========================================================================= */}
      {/* TOP LEFT METADATA BLOCK (DOT MATRIX RAIL & LOCATION COORDINATES)          */}
      {/* Exact match to mikes.cv & media_1793267119310_ac854b38.png               */}
      {/* ========================================================================= */}
      <div className={`folio-sticky ${isInsidePaperWorld ? 'is-hidden' : ''}`} aria-hidden="true">
        <div className="fs-rail" />
        <div className="fs-lines">
          <div className="fs-name">{passenger.name || 'S.Meedecha'}</div>
          <div>BANGKOK, TH</div>
          <div>13.7563° N, 100.5018° E</div>
          <div>GMT+7</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT COLUMN                                                       */}
      {/* ========================================================================= */}
      <main className="folio-col">
        
        {/* ================= 1. THE AIRPLANE CABIN WINDOW ================= */}
        <div className="folio-window">
          <CabinWindow
            isDarkMode={isDarkMode}
            shade={shade}
            onShadeChange={setShade}
          />
        </div>

        {/* ================= 2. HERO INTRO ================= */}
        <div className="folio-intro">
          <h1 className="folio-tagline">
            Supasit Meedecha
          </h1>
          <p className="folio-sub">
            Fourth-year Software Engineering student at Burapha University.
            <br />
            Passionate about QA, BA & AI — exploring the full SDLC to drive quality and team success.
          </p>
        </div>

        {/* ================= 3. FLIGHT PLAN & TIMELINE ================= */}
        <div className="folio-track" ref={trackRef}>
          
          {/* Top Flight Plan Indicator */}
          <div className="plan-head" aria-hidden="true">
            <span className="plan-label">Flight plan</span>
            <svg className="plan-plane text-[#2C6FFF]" viewBox="0 0 16 15" fill="none">
              <path
                d="M8 0c.73 0 1.32 1.05 1.32 2.35v2.2l6.13 3.54c.25.14.4.4.4.69v1.1a.44.44 0 0 1-.56.42L9.32 8.5v3.06l1.9 1.33c.15.11.24.28.24.47v.79a.44.44 0 0 1-.56.42L8 13.79l-2.9.78a.44.44 0 0 1-.56-.42v-.79c0-.19.09-.36.24-.47l1.9-1.33V8.5L.71 10.3a.44.44 0 0 1-.56-.42v-1.1c0-.29.15-.55.4-.69l6.13-3.54v-2.2C6.68 1.05 7.27 0 8 0z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Curved Route Path & Vertical Rail (Flows down with scroll) */}
          <div className="folio-path" ref={pathRef} aria-hidden="true">
            <svg className="path-curve" viewBox="0 0 44 110" fill="none">
              <path d={So} className="pc-dots" />
              <path d={So} className="pc-lit" pathLength="1" />
            </svg>
            <div className="path-rail" ref={railRef}>
              <div className="path-lit" />
            </div>
            <svg className="path-tip" viewBox="0 0 7 3" fill="none">
              <path d="M0.5 0.5 3.5 2.5 6.5 0.5" />
            </svg>
          </div>

          {/* Timeline Waypoints */}
          <ol className="folio-timeline">
            {TIMELINE_DATA.map((item, index) => (
              <li key={index} className="tl-entry">
                
                {/* Connected Company Logos */}
                <div className="tl-logos">
                  {item.logos.map((logo, lIdx) => (
                    <span key={lIdx} className="tl-avatar">
                      <a
                        className="tl-logo"
                        href={logo.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={logo.name || item.company}
                        style={logo.bg ? { background: logo.bg } : undefined}
                      >
                        <img src={asset(logo.src)} alt={logo.name || item.company} />
                      </a>
                    </span>
                  ))}
                </div>

                {/* Waypoint Header */}
                <div className="tl-head relative">
                  <div className="tl-year">
                    {item.route && <span className="tl-route">{item.route}</span>}
                    {item.dateRange ? (
                      <div className="tl-daterange">
                        <div className="tl-dr-months">
                          <span className="tl-dr-m">{item.dateRange.startMonth}</span>
                          <span className="tl-dr-m">{item.dateRange.endMonth}</span>
                        </div>
                        <div className="tl-dr-years">
                          <span className="tl-dr-y">{item.dateRange.startYear}</span>
                          <span className="tl-dr-sep">–</span>
                          <span className="tl-dr-y">{item.dateRange.endYear}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="tl-yearnum">{item.year}</span>
                    )}
                  </div>

                  {/* Route Dot (Lights up blue when flow reaches it) */}
                  <span
                    className={`tl-dot ${item.current ? 'tl-dot-now' : 'tl-dot-past'}`}
                    aria-hidden="true"
                  />

                  {/* Company Name */}
                  <a
                    className="tl-company"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.company}
                  </a>

                  {/* CURRENT Badge */}
                  {item.current && <span className="tl-badge">Current</span>}
                </div>

                {/* Role & Description */}
                <div className="tl-body">
                  <p className="tl-role">{item.role}</p>
                  <p className="tl-desc">{item.desc}</p>
                </div>

                {/* Case Studies with interactive separating cards */}
                {item.cases && item.cases.length > 0 && (
                  <ul className="tl-cases">
                    {item.cases.map((cStudy, cIdx) => {
                      const caseKey = `${item.company}-${cIdx}`;
                      const isExpanded = !!expandedCases[caseKey];

                      return (
                        <li key={cIdx} className="tl-case">
                          <div
                            role="button"
                            tabIndex={0}
                            className={`case ${isExpanded ? 'is-expanded' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleCase(caseKey);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleCase(caseKey);
                              }
                            }}
                            aria-expanded={isExpanded}
                            title={isExpanded ? 'คลิกเพื่อเก็บไพ่' : 'คลิกเพื่อแยกไพ่'}
                          >
                            {/* Dot on the rail */}
                            <span className="tl-dot tl-dot-case" aria-hidden="true" />

                            {/* 3D Stacked / Separated Case Shots */}
                            <span className={`case-shots cs-count-${cStudy.shots.length}`}>
                              {cStudy.shots.map((shot, sIdx) => {
                                const toolName = getShotName(shot);
                                return (
                                  <span
                                    key={sIdx}
                                    className="cs-shot"
                                    title={toolName}
                                  >
                                    <img src={asset(shot)} alt={toolName} />
                                  </span>
                                );
                              })}
                            </span>

                            {/* Case Title & Desc */}
                            <span className="case-text">
                              <span className="case-title">{cStudy.title}</span>
                              <span className="case-desc">{cStudy.desc}</span>
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

              </li>
            ))}
          </ol>

          {/* ========================================================================= */}
          {/* OUTRO: Memories Section ("Thank you for flying. See you again soon.")     */}
          {/* ========================================================================= */}
          <div className="folio-outro">
            <div className="outro-text">
              <h2 className="outro-title">Thank you for flying. See you again soon.</h2>
              <p className="outro-sub">Here are a few memories between takeoff and landing.</p>
            </div>

            <div className="outro-memories">
              {/* Floating pill badge when hovering a memory card */}
              <div
                className={`memory-badge ${hoveredMemory !== null ? 'is-visible' : ''}`}
                style={{
                  left: hoveredMemory !== null ? `calc(50% + ${MEMORY_CARDS[hoveredMemory].x}px)` : '50%',
                }}
              >
                {hoveredMemory !== null ? MEMORY_CARDS[hoveredMemory].label : ''}
              </div>

              <div className="memories-fan">
                {MEMORY_CARDS.map((mem, mIdx) => {
                  const isHovered = hoveredMemory === mIdx;
                  return (
                    <div
                      key={mem.id}
                      className={`memory-card ${isHovered ? 'is-active' : ''}`}
                      style={{
                        '--tilt': `${mem.tilt}deg`,
                        '--mx': `${mem.x}px`,
                        '--my': `${mem.y}px`,
                        zIndex: isHovered ? 15 : mIdx + 1,
                      } as React.CSSProperties}
                      onMouseEnter={() => {
                        sound.playSlide(0.2);
                        setHoveredMemory(mIdx);
                      }}
                      onMouseLeave={() => setHoveredMemory(null)}
                    >
                      <img
                        src={asset(mem.src)}
                        alt={mem.label}
                        style={{
                          objectFit: mem.fit,
                          objectPosition: mem.position || 'center',
                          padding: mem.fit === 'contain' ? '4.5px' : '0',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. CLOUD DESCENT TRANSITION LAYER                                         */}
      {/* "มีเมฆตรงปลายๆ อันล่าสุด แล้วลงไป หาไปกระดาษ ๆ แบบเต็มจออ่ะ"             */}
      {/* ========================================================================= */}
      <section ref={descentRef} className="folio-cloud-descent" id="cloud-descent">
        {/* Background Floating Cloud Layers (asset('/cloud.png')) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 92%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 92%)',
          }}
        >
          {/* Cloud 1 - Top Left Drift */}
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -top-10 -left-20 w-[420px] md:w-[540px] opacity-60 cloud-drift-1 pointer-events-none select-none"
            draggable="false"
          />
          {/* Cloud 2 - Top Right Drift */}
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute top-4 -right-24 w-[480px] md:w-[600px] opacity-55 cloud-drift-2 pointer-events-none select-none"
            draggable="false"
          />
          {/* Cloud 3 - Mid Left Drift */}
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute top-44 -left-12 w-[380px] opacity-70 cloud-drift-3 pointer-events-none select-none"
            draggable="false"
          />
          {/* Cloud 4 - Mid Right Floating */}
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute top-48 right-12 w-[440px] opacity-65 cloud-drift-1 pointer-events-none select-none"
            draggable="false"
          />
          {/* Cloud 5, 6, 7 - Bottom Cloud Bank Merging into Paper Notebook */}
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -bottom-16 left-[5%] w-[580px] opacity-85 cloud-drift-2 pointer-events-none select-none"
            draggable="false"
          />
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -bottom-24 right-[8%] w-[640px] opacity-90 cloud-drift-3 pointer-events-none select-none"
            draggable="false"
          />
          <img
            src={asset('/cloud.png')}
            alt=""
            className="absolute -bottom-28 left-[38%] w-[520px] opacity-95 cloud-drift-1 pointer-events-none select-none"
            draggable="false"
          />
        </div>

        {/* Seamless bottom fade overlay into 3D Papercraft Notebook (#dceae3) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-b from-transparent via-[#dceae3]/65 to-[#dceae3] z-[5]" />

        {/* Cloud Descent Content & CTA */}
        <div className="cloud-descent-content">
          <span className="pencil-handwriting-kicker">
            Illustrated Field Notebook
          </span>
          <h2 className="cloud-descent-title">
            Descending Below Cloud Deck
          </h2>
          <p className="cloud-descent-sub">
            Touchdown into Mr. Panda&apos;s 3D hand-drawn papercraft world.
            Scroll down or click below to unfold the illustrated field notebook.
          </p>
          <button
            type="button"
            onClick={() => {
              document.getElementById('papercraft-world')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cloud-descent-action group cursor-pointer"
          >
            <span>Explore 3D Notebook</span>
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FULL-SCREEN 3D PAPERCRAFT NOTEBOOK WORLD (100vw, 100vh)                */}
      {/* ========================================================================= */}
      <section
        ref={paperWorldRef}
        className="folio-paper-world"
        id="papercraft-world"
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="w-full h-full bg-[#dceae3] flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mb-3" />
                <span className="font-mono text-xs text-emerald-900 font-bold tracking-wider">
                  Unfolding 3D Papercraft Notebook...
                </span>
              </div>
            }
          >
            <PandaExperience
              onReturnToLog={() => {
                document.getElementById('cloud-descent')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onReturnToGate={onBack}
            />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM FOOTER NAVIGATION                                                  */}
      {/* ========================================================================= */}
      <footer className={`folio-footer ${isInsidePaperWorld ? 'is-in-paper' : ''}`}>
        <div className="folio-footer-inner">
          <nav className="ff-links">
            <button className="ff-link" onClick={onBack} type="button">
              <span className="ff-link-label">Return to Gate</span>
            </button>
            <a
              className="ff-link"
              href="https://x.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="ff-link-label">X</span>
            </a>
            <a
              className="ff-link"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="ff-link-label">LinkedIn</span>
            </a>
            <a
              className="ff-link"
              href="mailto:supasit@example.com"
            >
              <span className="ff-link-label">Email</span>
            </a>
          </nav>
        </div>
      </footer>

    </div>
  );
};
