type Props = { className?: string };

export default function Burger({ className }: Props) {
  return (
    <svg
      viewBox="0 0 520 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chezburgar"
      role="img"
    >
      <defs>
        <linearGradient id="bunTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd07a" />
          <stop offset="0.55" stopColor="#e89343" />
          <stop offset="1" stopColor="#a85a1f" />
        </linearGradient>
        <linearGradient id="bunBot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6822d" />
          <stop offset="1" stopColor="#7b3f12" />
        </linearGradient>
        <linearGradient id="patty" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c2a13" />
          <stop offset="1" stopColor="#2a0e05" />
        </linearGradient>
        <linearGradient id="cheese" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe14a" />
          <stop offset="1" stopColor="#ffb627" />
        </linearGradient>
        <linearGradient id="lettuce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8e063" />
          <stop offset="1" stopColor="#56a64b" />
        </linearGradient>
        <linearGradient id="tomato" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4d4d" />
          <stop offset="1" stopColor="#c81e1e" />
        </linearGradient>
        <radialGradient id="seedGlow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="1" stopColor="#e8b25f" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* shadow */}
      <ellipse cx="260" cy="445" rx="180" ry="14" fill="#000" opacity="0.45" />

      {/* bottom bun */}
      <path
        d="M70 360 Q260 460 450 360 L440 395 Q260 460 80 395 Z"
        fill="url(#bunBot)"
      />
      <path
        d="M70 360 Q260 415 450 360 L450 372 Q260 425 70 372 Z"
        fill="#b8651e"
      />

      {/* lettuce */}
      <path
        d="M50 340 Q90 305 130 340 Q170 305 210 340 Q250 305 300 340 Q340 305 390 340 Q430 305 470 340 L470 365 Q260 405 50 365 Z"
        fill="url(#lettuce)"
      />
      <path
        d="M50 340 Q90 305 130 340 Q170 305 210 340 Q250 305 300 340 Q340 305 390 340 Q430 305 470 340"
        fill="none"
        stroke="#2f6a2a"
        strokeWidth="3"
        opacity="0.45"
      />

      {/* tomato */}
      <ellipse cx="260" cy="305" rx="200" ry="22" fill="url(#tomato)" />
      <ellipse cx="260" cy="298" rx="195" ry="14" fill="#ff7878" opacity="0.7" />
      {/* seeds */}
      {[120, 175, 230, 285, 340, 395].map((x) => (
        <ellipse key={x} cx={x} cy={303} rx="4" ry="2.5" fill="#ffe6a8" />
      ))}

      {/* cheese */}
      <path
        d="M70 245 Q260 230 450 245 L470 290 Q400 280 380 305 Q330 290 280 305 Q240 290 200 305 Q160 290 120 305 Q90 290 50 295 Z"
        fill="url(#cheese)"
      />
      <path
        d="M70 245 Q260 230 450 245"
        fill="none"
        stroke="#fff3a0"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* patty */}
      <ellipse cx="260" cy="225" rx="200" ry="26" fill="url(#patty)" />
      <ellipse cx="260" cy="218" rx="200" ry="20" fill="#3b1808" />
      <ellipse cx="260" cy="215" rx="195" ry="14" fill="#5c2a13" opacity="0.6" />
      {/* sear marks */}
      {[140, 200, 260, 320, 380].map((x) => (
        <ellipse key={x} cx={x} cy={218} rx="14" ry="3" fill="#000" opacity="0.35" />
      ))}

      {/* top bun */}
      <path
        d="M50 200 Q70 70 260 60 Q450 70 470 200 Q260 230 50 200 Z"
        fill="url(#bunTop)"
      />
      <path
        d="M50 200 Q70 70 260 60 Q450 70 470 200"
        fill="none"
        stroke="#7a4019"
        strokeWidth="2"
        opacity="0.4"
      />

      {/* sesame seeds */}
      {[
        [130, 165, -18],
        [180, 130, 10],
        [225, 100, -8],
        [275, 88, 6],
        [320, 102, -14],
        [365, 130, 12],
        [410, 168, -8],
        [160, 195, 5],
        [255, 175, -20],
        [355, 198, 15],
        [220, 160, 22],
        [305, 155, -12],
      ].map(([cx, cy, r], i) => (
        <g key={i} transform={`rotate(${r} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx="8" ry="4.5" fill="url(#seedGlow)" filter="url(#soft)" />
          <ellipse cx={cx as number} cy={(cy as number) - 1.2} rx="4.5" ry="1.6" fill="#fff8d2" opacity="0.9" />
        </g>
      ))}

      {/* highlight on top bun */}
      <path
        d="M120 110 Q200 70 260 75"
        fill="none"
        stroke="#fff1c2"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* sauce drip */}
      <path
        d="M95 252 Q105 282 100 305 L88 305 Q82 280 90 252 Z"
        fill="#ff2d55"
        opacity="0.95"
      />
      <path
        d="M420 248 Q430 285 425 312 L412 312 Q406 285 414 248 Z"
        fill="#ff2d55"
        opacity="0.95"
      />
    </svg>
  );
}
