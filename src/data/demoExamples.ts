import { DemoExample } from '../types';

// Crisp SVG data URLs representing the 3 demo scenarios
const floodedRoadSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="flood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <!-- Background & Overcast Sky -->
  <rect width="600" height="380" fill="url(#sky)"/>
  <!-- Distant bridge/underpass concrete wall -->
  <rect x="0" y="100" width="600" height="110" fill="#334155"/>
  <rect x="140" y="120" width="320" height="90" rx="6" fill="#1e293b"/>
  <rect x="160" y="130" width="280" height="80" fill="#0f172a"/>
  <!-- Road pavement -->
  <polygon points="0,210 600,210 600,380 0,380" fill="#1e293b"/>
  <!-- Guardrails / Curb -->
  <rect x="20" y="195" width="560" height="15" fill="#94a3b8"/>
  <line x1="60" y1="202" x2="540" y2="202" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="10 15"/>
  <!-- Flood Water Layer -->
  <polygon points="0,215 600,215 600,380 0,380" fill="url(#flood)"/>
  <!-- Water ripples -->
  <ellipse cx="280" cy="270" rx="190" ry="14" fill="#38bdf8" opacity="0.35"/>
  <ellipse cx="400" cy="310" rx="140" ry="10" fill="#7dd3fc" opacity="0.25"/>
  <ellipse cx="160" cy="330" rx="110" ry="8" fill="#bae6fd" opacity="0.2"/>
  <!-- Stalled Silver Sedan partially submerged -->
  <g transform="translate(190, 195)">
    <!-- Cabin and roof -->
    <path d="M 50 35 L 85 10 L 165 10 L 195 35 Z" fill="#94a3b8"/>
    <!-- Windows -->
    <path d="M 88 14 L 125 14 L 125 32 L 62 32 Z" fill="#0f172a" opacity="0.85"/>
    <path d="M 132 14 L 162 14 L 188 32 L 132 32 Z" fill="#0f172a" opacity="0.85"/>
    <!-- Car body -->
    <path d="M 30 35 L 220 35 Q 230 45 225 58 L 25 58 Q 20 45 30 35 Z" fill="#cbd5e1"/>
    <!-- Blinking hazard lights (amber) -->
    <circle cx="28" cy="46" r="6" fill="#f59e0b"/>
    <circle cx="28" cy="46" r="14" fill="#fbbf24" opacity="0.35"/>
    <circle cx="222" cy="46" r="6" fill="#f59e0b"/>
    <circle cx="222" cy="46" r="14" fill="#fbbf24" opacity="0.35"/>
    <!-- Submerged wheels - water line cuts across them -->
    <ellipse cx="70" cy="62" rx="18" ry="10" fill="#0f172a"/>
    <ellipse cx="180" cy="62" rx="18" ry="10" fill="#0f172a"/>
    <!-- Water wake around car -->
    <path d="M 10 56 Q 70 50 130 56 T 240 56" stroke="#e0f2fe" stroke-width="3" fill="none" opacity="0.8"/>
  </g>
  <!-- Warning / Danger floating marker or sign -->
  <g transform="translate(480, 210)">
    <rect x="18" y="0" width="4" height="60" fill="#64748b"/>
    <polygon points="20,0 42,35 -2,35" fill="#ef4444"/>
    <text x="20" y="27" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">!</text>
  </g>
</svg>
`)}`;

const roadAccidentSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="asphalt" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Intersection Ground -->
  <rect width="600" height="380" fill="url(#asphalt)"/>
  <!-- Crosswalk / lane stripes -->
  <rect x="30" y="180" width="80" height="16" fill="#f8fafc" opacity="0.7"/>
  <rect x="150" y="180" width="80" height="16" fill="#f8fafc" opacity="0.7"/>
  <rect x="270" y="180" width="80" height="16" fill="#f8fafc" opacity="0.7"/>
  <rect x="390" y="180" width="80" height="16" fill="#f8fafc" opacity="0.7"/>
  <rect x="510" y="180" width="80" height="16" fill="#f8fafc" opacity="0.7"/>
  <line x1="295" y1="0" x2="295" y2="380" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="16 16" opacity="0.5"/>
  <!-- Sidewalk curb -->
  <rect x="0" y="0" width="600" height="50" fill="#475569"/>
  <line x1="0" y1="50" x2="600" y2="50" stroke="#94a3b8" stroke-width="4"/>
  <!-- Fluid spill pool on road (greenish coolant + oil sheen) -->
  <ellipse cx="280" cy="245" rx="75" ry="32" fill="#065f46" opacity="0.7"/>
  <ellipse cx="295" cy="250" rx="40" ry="18" fill="#047857" opacity="0.8"/>
  <path d="M 230 250 Q 260 270 320 260 Q 360 275 290 280 Z" fill="#15803d" opacity="0.6"/>
  <!-- Car 1: Silver SUV with smashed front bumper -->
  <g transform="translate(140, 190) rotate(15)">
    <!-- Body -->
    <rect x="0" y="0" width="130" height="70" rx="8" fill="#94a3b8"/>
    <!-- Windshield -->
    <polygon points="35,10 80,10 75,60 35,60" fill="#334155"/>
    <!-- Crushed crumple zone on front -->
    <path d="M 120 5 L 142 22 L 128 35 L 140 48 L 118 65 Z" fill="#64748b"/>
    <!-- Headlights (one smashed, one flickering) -->
    <rect x="125" y="8" width="8" height="12" fill="#ef4444"/>
    <rect x="123" y="50" width="10" height="14" fill="#fbbf24"/>
    <circle cx="130" cy="57" r="16" fill="#fef08a" opacity="0.3"/>
  </g>
  <!-- Car 2: Blue hatchback spun onto the curb -->
  <g transform="translate(260, 100) rotate(-35)">
    <rect x="0" y="0" width="115" height="62" rx="10" fill="#1e40af"/>
    <!-- Windows -->
    <polygon points="30,8 70,8 65,54 30,54" fill="#0f172a"/>
    <!-- Airbag deployed visible in window -->
    <circle cx="45" cy="30" r="14" fill="#f8fafc" opacity="0.9"/>
    <!-- Dented driver door side -->
    <path d="M 30 0 Q 55 18 80 0 Z" fill="#1e3a8a"/>
    <!-- Rear bumper -->
    <rect x="-5" y="6" width="8" height="50" fill="#172554"/>
  </g>
  <!-- Skid marks on asphalt -->
  <path d="M 80 280 Q 150 250 220 230" stroke="#020617" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.75"/>
  <path d="M 95 300 Q 165 270 235 250" stroke="#020617" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.75"/>
  <!-- Warning debris particles -->
  <polygon points="270,225 275,229 268,232" fill="#e2e8f0"/>
  <polygon points="290,215 294,218 288,222" fill="#ef4444"/>
  <polygon points="255,240 260,244 252,246" fill="#cbd5e1"/>
</svg>
`)}`;

const fallenTreeWiresSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="stormSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <radialGradient id="electricSpark" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#67e8f9"/>
      <stop offset="70%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Stormy Background -->
  <rect width="600" height="380" fill="url(#stormSky)"/>
  <!-- Street Roadway -->
  <polygon points="0,220 600,220 600,380 0,380" fill="#1e293b"/>
  <line x1="0" y1="300" x2="600" y2="300" stroke="#eab308" stroke-width="4" stroke-dasharray="25 20"/>
  <!-- Chain link fence in background -->
  <rect x="0" y="160" width="600" height="60" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- Utility Pole #1 (Snapped at mid-height) -->
  <rect x="70" y="160" width="16" height="70" fill="#78350f"/>
  <polygon points="70,160 86,160 76,145 66,155" fill="#92400e"/>
  <!-- Fallen upper trunk of utility pole on ground -->
  <rect x="80" y="225" width="90" height="14" rx="2" transform="rotate(25 80 225)" fill="#78350f"/>
  <!-- Utility Pole #2 in distance leaning -->
  <line x1="530" y1="90" x2="515" y2="225" stroke="#78350f" stroke-width="14" stroke-linecap="round"/>
  <!-- Massive Fallen Oak Tree -->
  <!-- Exposed roots ball -->
  <ellipse cx="490" cy="245" rx="35" ry="30" fill="#451a03"/>
  <path d="M 470 240 Q 450 255 435 240 Q 440 270 470 270" stroke="#78350f" stroke-width="6" fill="none"/>
  <!-- Main Trunk stretched across road -->
  <path d="M 480 235 L 160 275 L 155 295 L 485 260 Z" fill="#713f12"/>
  <!-- Tree Branches and dense foliage -->
  <ellipse cx="220" cy="265" rx="90" ry="45" fill="#14532d"/>
  <ellipse cx="280" cy="250" rx="75" ry="40" fill="#166534"/>
  <ellipse cx="170" cy="285" rx="60" ry="35" fill="#15803d"/>
  <ellipse cx="320" cy="240" rx="65" ry="30" fill="#14532d"/>
  <!-- Downed Electrical Power Lines (Black cables) -->
  <path d="M 0 110 Q 150 180 240 265" stroke="#09090b" stroke-width="4.5" fill="none"/>
  <path d="M 525 95 Q 400 160 260 275" stroke="#09090b" stroke-width="4.5" fill="none"/>
  <!-- Active Arcing / Live wire touching metal fence & asphalt -->
  <path d="M 240 265 Q 310 280 370 315" stroke="#0f172a" stroke-width="4" fill="none"/>
  <!-- Electrical Arcs & Sparks -->
  <circle cx="370" cy="315" r="28" fill="url(#electricSpark)"/>
  <path d="M 360 305 L 372 315 L 366 318 L 380 330" stroke="#38bdf8" stroke-width="3" fill="none"/>
  <path d="M 370 310 L 385 305 L 376 322 L 392 325" stroke="#f8fafc" stroke-width="2.5" fill="none"/>
  <!-- Smoke / sizzle wisps -->
  <path d="M 372 300 Q 375 285 370 275" stroke="#cbd5e1" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M 378 305 Q 385 290 382 280" stroke="#cbd5e1" stroke-width="2" fill="none" opacity="0.5"/>
</svg>
`)}`;

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'flooded-road',
    title: 'Flooded Road & Stalled Vehicle',
    category: 'Severe Weather / Roadway Inundation',
    shortDesc: 'Flash flooding under railway pass with sedan submerged past wheel arches.',
    text: `Severe water buildup on Elmwood Avenue near the creek underpass. Water is at least 2.5 to 3 feet deep, completely covering both lanes for about 70 yards. 

A silver four-door sedan is stalled midway through the flooded zone with water reaching well above the tire rims. Hazard warning flashers are blinking. Through the windshield, at least one occupant appears seated inside and has not exited. 

Rain has subsided 15 minutes ago, but the water depth is still creeping upwards due to creek runoff. Strong swirling current observed around a submerged storm drain on the eastbound curb. Multiple oncoming cars are turning around abruptly.`,
    imageData: {
      dataUrl: floodedRoadSvg,
      mimeType: 'image/svg+xml',
      filename: 'flooded_elmwood_underpass.svg'
    }
  },
  {
    id: 'road-accident',
    title: 'Multi-Vehicle Collision with Fluid Leak',
    category: 'Traffic Incident / Entrapment Hazard',
    shortDesc: 'Two vehicles collided at busy intersection; fluid leak and jammed passenger door.',
    text: `Two-car collision occurred at the intersection of 4th Street and Grand Avenue. 

A silver SUV suffered severe front-end impact with crushed radiator grille; greenish coolant and a dark oily fluid are actively pooling underneath across a 10-foot radius of the road. A dark blue hatchback spun off into the pedestrian curb with driver and curtain airbags deployed.

The hatchback driver is sitting upright on the sidewalk curb holding their left wrist, conscious and talking. However, the passenger in the front seat of the silver SUV remains inside with the passenger-side door visibly jammed shut and buckled inward. No flames or open smoke, but a pungent chemical odor of hot engine fluids is strong. Traffic is completely stalled in both directions with pedestrians gathering nearby.`,
    imageData: {
      dataUrl: roadAccidentSvg,
      mimeType: 'image/svg+xml',
      filename: '4th_grand_collision.svg'
    }
  },
  {
    id: 'fallen-tree-wires',
    title: 'Fallen Tree with Downed Live Power Lines',
    category: 'Electrical & Structural Hazard',
    shortDesc: 'Oak tree collapsed across roadway snapping utility poles with active electrical arcing.',
    text: `A massive 50-foot oak tree has uprooted and collapsed completely across Westwood Road directly in front of residence #412 following gusty wind conditions. 

The falling tree snapped one wooden utility pole in half and bent a secondary pole. At least three thick black overhead utility cables and two electrical transmission lines are torn down across both lanes. One severed high-voltage line is resting directly on a residential galvanized chain-link fence and the wet asphalt. 

The wire is actively arcing with loud buzzing, popping noises, and bright blue electrical sparks occurring intermittently every few seconds. No vehicles or pedestrians are trapped underneath the trunk, but the entire street is impassable. Several curious neighbors are standing on open porches less than 30 feet away.`,
    imageData: {
      dataUrl: fallenTreeWiresSvg,
      mimeType: 'image/svg+xml',
      filename: 'westwood_downed_powerline.svg'
    }
  }
];
