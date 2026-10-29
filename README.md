# ✈️ Aviation Portfolio — S. MEEDECHA

> An interactive, flight-inspired personal portfolio crafted with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
> Inspired by the award-winning design of [mikes.cv](https://www.mikes.cv/).

---

## 🌟 Highlights & Features

### 1. 🎫 Interactive 3D Boarding Pass (Gate Page)
- **Authentic Airline Ticket**: Designed in the style of *Northern Air* with vector topography lines, barcode, validation seals, and detachable stub.
- **Natural Physics & 3D Movement**: Card supports free dragging, velocity tossing, 3D tilt, and realistic desk dropping.
- **Card Reading Slot Alignment**: Clamped within machine bounds so the card never pokes through the scanner housing.

### 2. 📠 Optical Mag-Stripe Scanner (Servo Mk-IV)
- **Retro Vintage Machine**: 3D-molded beige chassis featuring ventilation slits, screw fixtures, and LED display.
- **Horizontal Swipe Detection**: Swipe the boarding pass horizontally from left to right through the slot to board the flight.
- **Dynamic Feedback**: Machine status displays `READY` (amber backlight) $\rightarrow$ `READING` (scanning laser) $\rightarrow$ `SUCCESS` (green beacon chime) before smoothly transitioning to the flight cabin.

### 3. 🪟 Molded Airplane Cabin Window
- **Pixel-Perfect Window Frame**: High-resolution airplane cabin window bezel, recessed inner rim, and shutter track matching the exact geometry of the original site.
- **60FPS Continuous Moving Sky & Clouds**:
  - Stratospheric blue sky gradient.
  - Procedural volumetric cloud particles rendered via 2D Canvas.
  - Drifting cumulus cloud puffs moving smoothly from right to left.
  - Soft horizon atmospheric fog wash.

### 4. 🌓 Interactive Pull-Down Shade (Dark Mode Toggle)
- **Accordion Shutter**: Pull the shade handle down or click/tap to toggle between open and closed.
- **Theme Synchronized**: Pulling the shade down turns the entire website into **Cabin Dark Mode** (`#191817`), illuminating night-time text contrast and darkening the cabin window frame.

### 5. 🗺️ Flight Plan Career Timeline
- **Top-Left Flight Coordinates**: Real-time monospace metadata (`S. MEEDECHA`, `BANGKOK, TH`, `13.7563° N, 100.5018° E`, `GMT+7`) with authentic dot-matrix rail.
- **Flight Path Navigation**: Curved dashed flight route line leading into career waypoints.
- **Career Waypoints**: Interactive company avatar cards (`Studio`, `Fahlo`, `Matter`, `Contact`) with hover lift animations and `Current` badge.
- **Footer Navigation**: Quick-access pill buttons for `Return to Gate`, `X`, `LinkedIn`, and `Email`.

### 6. 🔊 Zero-Dependency Web Audio Synthesizer
- Built entirely on the native **Web Audio API** (no external audio files required).
- Synthesizes tactile sounds for card sliding, barcode optical chirps, success bells, desk drops, and shutter clicks.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Typography**: Custom fonts (`MB Sans`, `MB Mono`, `MB LCD`)
- **Graphics**: HTML5 2D Canvas + Responsive Vector SVG
- **Audio**: Native Web Audio API Synthesizer

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **pnpm** (or `npm` / `yarn`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/port-freetime.git
cd port-freetime

# Install dependencies
pnpm install
```

### 3. Development Server
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
# Type check and build optimized bundle
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📂 Project Structure

```text
port-freetime/
├── public/
│   ├── fonts/                   # MB Sans, MB Mono & MB LCD fonts
│   ├── folio/                   # Company avatar logos (Studio, Fahlo, etc.)
│   ├── cloud.png                # High-res cloud puff overlay
│   ├── window-front.webp        # Cabin window outer bezel
│   ├── window-back.webp         # Window recessed rim
│   ├── window-shutter.webp      # Pull-down window shade
│   └── waternormals.jpg         # Normal map texture
├── src/
│   ├── components/
│   │   ├── BoardingPass.tsx     # Front side of Northern Air ticket
│   │   ├── BoardingPassBack.tsx # Blue back side with globe typography
│   │   ├── CabinWindow.tsx      # Molded window + drifting cloud canvas + shade drag
│   │   ├── NextPage.tsx         # Flight portfolio page (Window, Bio, Flight Plan)
│   │   └── ScannerMachine.tsx   # Vintage Servo Mk-IV optical card reader
│   ├── utils/
│   │   └── audio.ts             # Web Audio API procedural sound engine
│   ├── types.ts                 # Passenger & flight data types
│   ├── App.tsx                  # Main stage, physics orchestrator & swipe logic
│   ├── index.css                # Tailwind base, typography & theme tokens
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML entry point with font preloads
├── package.json                 # Project configuration & dependencies
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## ⚙️ Customization

### Modifying Passenger Data & Title
Open [`src/types.ts`](file:///src/types.ts) to customize your name, role, flight number, and dates:

```typescript
export const DEFAULT_PASSENGER: PassengerData = {
  name: 'S. MEEDECHA',
  role: 'SOFTWARE DEVELOPMENT ENGINEER IN TEST',
  flightNumber: 'TD1887',
  from: 'MAN',
  fromCity: 'MANCHESTER, UK',
  to: 'REM',
  toCity: 'REMOTE, GLOBAL',
  seat: '18A',
  gate: 'A12',
  classType: 'BUSINESS',
  classCode: 'J',
  boardingTime: '08:45',
  date: '2 AUG 2026',
  sequence: '0029',
};
```

### Modifying the Flight Plan Timeline
Open [`src/components/NextPage.tsx`](file:///src/components/NextPage.tsx) to edit or add career milestones in `TIMELINE_DATA`:

```typescript
const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2025',
    route: 'NYC>MAN',
    company: 'Studio',
    role: 'Lead Product Designer',
    desc: 'New York based product agency...',
    current: true,
    logos: [
      { src: '/folio/logo-studio.png', name: 'Studio', url: 'https://buildwithstudio.com/' },
    ],
  },
  // Add more waypoints here...
];
```

---

## 💡 Acknowledgments

- Design and concept heavily inspired by the creative brilliance of **Mike Barton** ([mikes.cv](https://www.mikes.cv/)).
- All product names, logos, and brands belong to their respective owners.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
