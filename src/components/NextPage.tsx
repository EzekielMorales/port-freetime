import React, { useState, useEffect } from 'react';
import { PassengerData } from '../types';
import { CabinWindow } from './CabinWindow';

interface NextPageProps {
  passenger: PassengerData;
  onBack: () => void;
}

interface TimelineItem {
  year: string;
  route: string;
  company: string;
  role: string;
  desc: string;
  current?: boolean;
  logos: Array<{ src: string; name?: string; url?: string }>;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2025',
    route: 'NYC>MAN',
    company: 'Studio',
    role: 'Lead Product Designer',
    desc: 'New York based product agency. Led several end-to-end client product and branding engagements across mobile and web, shipping to millions of users.',
    current: true,
    logos: [
      { src: '/folio/logo-studio.png', name: 'Studio', url: 'https://buildwithstudio.com/' },
      { src: '/folio/logo-fahlo.png', name: 'Fahlo', url: 'https://myfahlo.com/' },
    ],
  },
  {
    year: '2024',
    route: 'DEN>MAN',
    company: 'Matter Neuroscience',
    role: 'Senior Product Designer',
    desc: "Colorado biotech start-up investing in longevity through frontline neuroscience. Played a critical role in helping shape Matter's visual language and user experience 0-1.",
    logos: [
      { src: '/folio/logo-matter-dark.png', name: 'Matter', url: 'https://matter.xyz/' },
      { src: '/folio/logo-matter-blue.png', name: 'Matter App', url: 'https://matter.xyz/app' },
    ],
  },
  {
    year: '2022',
    route: 'LON',
    company: 'Contact',
    role: 'Senior Product Designer',
    desc: 'London based marketplace start-up. Led design and a bold rebrand for a vertical shift in a fast-moving creative gig industry.',
    logos: [{ src: '/folio/logo-contact.png', name: 'Contact', url: 'https://contact.xyz/' }],
  },
];

export const NextPage: React.FC<NextPageProps> = ({ passenger, onBack }) => {
  // Shade level: 0 = fully open (Light theme), 1 = fully closed (Dark theme)
  const [shade, setShade] = useState(0);
  const isDarkMode = shade > 0.45;

  // Sync theme with html root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.dataset.theme = 'dark';
    } else {
      delete root.dataset.theme;
    }
  }, [isDarkMode]);

  return (
    <div className="folio min-h-screen relative overflow-x-hidden selection:bg-[#2c6fff] selection:text-white">
      
      {/* ========================================================================= */}
      {/* TOP LEFT METADATA BLOCK (DOT MATRIX RAIL & LOCATION COORDINATES)          */}
      {/* Exact match to mikes.cv & media_1793267119310_ac854b38.png               */}
      {/* ========================================================================= */}
      <div className="folio-sticky" aria-hidden="true">
        <div className="fs-rail" />
        <div className="fs-lines">
          <div className="fs-name">{passenger.name || 'S. MEEDECHA'}</div>
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
            {passenger.role || 'Software Development Engineer in Test'}
          </h1>
          <p className="folio-sub">
            Pushing pixels for 8 years with an engineering mindset,{' '}
            <br className="hidden sm:inline" />
            obsessing over the details and the why behind great products.
          </p>
        </div>

        {/* ================= 3. FLIGHT PLAN & TIMELINE ================= */}
        <div className="folio-track">
          
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

          {/* Curved Route Path & Vertical Rail */}
          <div className="folio-path" aria-hidden="true">
            <svg className="path-curve" viewBox="0 0 44 110" fill="none">
              <path
                d="M 22 0 C 22 55, 0 55, 0 110"
                className="pc-dots"
              />
            </svg>
            <div className="path-rail" />
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
                      >
                        <img src={logo.src} alt={logo.name || item.company} />
                      </a>
                    </span>
                  ))}
                </div>

                {/* Waypoint Header */}
                <div className="tl-head">
                  <div className="tl-year">
                    <span className="tl-route">{item.route}</span>
                    <span className="tl-yearnum">{item.year}</span>
                  </div>

                  {/* Route Dot */}
                  <div className={`tl-dot ${item.current ? 'now' : ''}`} />

                  {/* Company Name */}
                  <span className="tl-company">{item.company}</span>

                  {/* CURRENT Badge */}
                  {item.current && <span className="tl-badge">Current</span>}
                </div>

                {/* Role & Description */}
                <div className="tl-body">
                  <p className="tl-role">{item.role}</p>
                  <p className="tl-desc">{item.desc}</p>
                </div>

              </li>
            ))}
          </ol>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* BOTTOM FOOTER NAVIGATION                                                  */}
      {/* Exact match to mikes.cv & media_1793267119310_ac854b38.png               */}
      {/* ========================================================================= */}
      <footer className="folio-footer">
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
