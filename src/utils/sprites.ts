import { Skin, SkinId, PowerupType } from '../types';

export const SKINS_DATA: Skin[] = [
  {
    id: 'classic',
    name: 'Classic Dino',
    price: 0,
    unlocked: true,
    description: 'The iconic retro monochrome runner dino.',
    colorPrimary: '#333333',
    colorSecondary: '#555555',
    colorAccent: '#111111',
    eyeColor: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Shadow Runner',
    price: 50,
    unlocked: false,
    description: 'Stealthy dark obsidian skin with crimson eyes.',
    colorPrimary: '#1a1a24',
    colorSecondary: '#2d2d3f',
    colorAccent: '#ef4444',
    eyeColor: '#ef4444',
  },
  {
    id: 'neon',
    name: 'Neon Cyber',
    price: 150,
    unlocked: false,
    description: 'Cyberpunk grid skin with glowing cyan accents.',
    colorPrimary: '#06b6d4',
    colorSecondary: '#3b82f6',
    colorAccent: '#ec4899',
    eyeColor: '#00ffff',
    hasGlow: true,
  },
  {
    id: 'golden',
    name: 'Golden Rex',
    price: 300,
    unlocked: false,
    description: 'Pure 24K pixel gold for elite runners.',
    colorPrimary: '#eab308',
    colorSecondary: '#facc15',
    colorAccent: '#b45309',
    eyeColor: '#ffffff',
    hasGlow: true,
  },
  {
    id: 'robot',
    name: 'Robo-Dino 3000',
    price: 500,
    unlocked: false,
    description: 'Mechanical alloy frame with blue visor LED.',
    colorPrimary: '#64748b',
    colorSecondary: '#94a3b8',
    colorAccent: '#38bdf8',
    eyeColor: '#38bdf8',
  },
  {
    id: 'skeleton',
    name: 'Skelly Dino',
    price: 750,
    unlocked: false,
    description: 'Spooky undead dino bone framework.',
    colorPrimary: '#f8fafc',
    colorSecondary: '#cbd5e1',
    colorAccent: '#020617',
    eyeColor: '#020617',
  },
  {
    id: 'ghost',
    name: 'Pixel Phantom',
    price: 1000,
    unlocked: false,
    description: 'Ethereal translucent ghost dino.',
    colorPrimary: 'rgba(167, 243, 208, 0.85)',
    colorSecondary: 'rgba(110, 231, 183, 0.6)',
    colorAccent: '#047857',
    eyeColor: '#ec4899',
    hasGlow: true,
  },
];

// Pixel Art Grid Maps for Dino (24x24 grid resolution)
// 1: Primary, 2: Secondary, 3: Accent/Detail, 4: Eye, 0: Transparent
type PixelGrid = number[][];

const DINO_RUN_1: PixelGrid = [
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,4,4,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const DINO_RUN_2: PixelGrid = [
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,4,4,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const DINO_DUCK_1: PixelGrid = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0],
  [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,1,0],
  [1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const DINO_DEAD: PixelGrid = [
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,3,0,3,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,0,3,0,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,3,0,3,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export function renderPixelGridToCanvas(
  grid: PixelGrid,
  skin: Skin,
  pixelSize: number = 2
): HTMLCanvasElement {
  const height = grid.length;
  const width = grid[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = width * pixelSize;
  canvas.height = height * pixelSize;
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = false;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const val = grid[r][c];
      if (val === 0) continue;

      let color = skin.colorPrimary;
      if (val === 2) color = skin.colorSecondary;
      if (val === 3) color = skin.colorAccent;
      if (val === 4) color = skin.eyeColor;

      ctx.fillStyle = color;
      ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }
  }

  return canvas;
}

export function drawDinoSprite(
  ctx: CanvasRenderingContext2D,
  state: 'RUN1' | 'RUN2' | 'DUCK1' | 'DUCK2' | 'JUMP' | 'DEAD',
  skinId: SkinId,
  x: number,
  y: number,
  width: number,
  height: number,
  isShielded: boolean = false,
  isInvincible: boolean = false
) {
  const skin = SKINS_DATA.find((s) => s.id === skinId) || SKINS_DATA[0];

  let grid = DINO_RUN_1;
  if (state === 'RUN2') grid = DINO_RUN_2;
  if (state === 'DUCK1' || state === 'DUCK2') grid = DINO_DUCK_1;
  if (state === 'DEAD') grid = DINO_DEAD;

  const spriteCanvas = renderPixelGridToCanvas(grid, skin, 2);

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  if (skin.hasGlow) {
    ctx.shadowColor = skin.colorPrimary;
    ctx.shadowBlur = 10;
  }

  ctx.drawImage(spriteCanvas, x, y, width, height);

  // Render Powerup Overlays
  if (isShielded) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, Math.max(width, height) / 1.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fill();
  }

  if (isInvincible) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, Math.max(width, height) / 1.3, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.stroke();
  }

  ctx.restore();
}

// Draw Cactus Obstacles
export function drawCactus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  variant: 'CACTUS_SMALL' | 'CACTUS_LARGE' | 'CACTUS_DOUBLE' | 'CACTUS_TRIPLE',
  color: string = '#22c55e'
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.imageSmoothingEnabled = false;

  const count = variant === 'CACTUS_DOUBLE' ? 2 : variant === 'CACTUS_TRIPLE' ? 3 : 1;
  const stemWidth = Math.floor(width / (count * 1.5));

  for (let i = 0; i < count; i++) {
    const offsetX = x + i * (stemWidth * 1.4);

    // Main Stem
    ctx.fillRect(offsetX + stemWidth * 0.3, y, stemWidth * 0.5, height);

    // Arms
    const armY = y + height * 0.3;
    const armH = height * 0.3;

    // Left arm
    ctx.fillRect(offsetX, armY, stemWidth * 0.3, armH);
    ctx.fillRect(offsetX, armY, stemWidth * 0.5, stemWidth * 0.2);

    // Right arm
    ctx.fillRect(offsetX + stemWidth * 0.7, armY + armH * 0.2, stemWidth * 0.3, armH * 0.8);
    ctx.fillRect(offsetX + stemWidth * 0.5, armY + armH * 0.2, stemWidth * 0.5, stemWidth * 0.2);

    // Top rounded pixel spikes
    ctx.fillRect(offsetX + stemWidth * 0.3, y - 2, stemWidth * 0.5, 2);
  }

  ctx.restore();
}

// Draw Bird / Pterodactyl
export function drawBird(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  wingUp: boolean
) {
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.imageSmoothingEnabled = false;

  // Body
  ctx.fillRect(x + 10, y + 10, width - 20, height - 15);
  // Head & Beak
  ctx.fillRect(x, y + 8, 12, 10);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x - 6, y + 12, 8, 4);

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 4, y + 10, 3, 3);

  // Wings
  ctx.fillStyle = '#475569';
  if (wingUp) {
    ctx.fillRect(x + 15, y - 8, 12, 18);
    ctx.fillRect(x + 20, y - 14, 8, 8);
  } else {
    ctx.fillRect(x + 15, y + 15, 12, 18);
    ctx.fillRect(x + 20, y + 25, 8, 8);
  }

  ctx.restore();
}

// Draw Rolling Rock
export function drawRock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation);

  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#44403c';
  ctx.fillRect(-width * 0.2, -height * 0.2, width * 0.4, height * 0.4);
  ctx.fillRect(width * 0.1, height * 0.1, width * 0.2, height * 0.2);

  ctx.restore();
}

// Draw Robot Hazard
export function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  animTimer: number
) {
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y + 5, width, height - 10);

  // Head
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 4, y, width - 8, 12);

  // Glowing Eye
  const eyeColor = Math.floor(animTimer * 10) % 2 === 0 ? '#ef4444' : '#dc2626';
  ctx.fillStyle = eyeColor;
  ctx.fillRect(x + 8, y + 4, width - 16, 4);

  // Legs motion
  ctx.fillStyle = '#0f172a';
  if (Math.floor(animTimer * 10) % 2 === 0) {
    ctx.fillRect(x + 4, y + height - 5, 6, 5);
    ctx.fillRect(x + width - 10, y + height - 8, 6, 5);
  } else {
    ctx.fillRect(x + 4, y + height - 8, 6, 5);
    ctx.fillRect(x + width - 10, y + height - 5, 6, 5);
  }

  ctx.restore();
}

// Draw Meteor
export function drawMeteor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();
  // Fire Trail
  const grad = ctx.createLinearGradient(x + width, y - height, x, y + height);
  grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
  grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
  grad.addColorStop(1, 'rgba(239, 68, 68, 1)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + height / 2);
  ctx.lineTo(x + width * 2, y - height * 1.5);
  ctx.lineTo(x + width * 1.5, y - height * 2);
  ctx.closePath();
  ctx.fill();

  // Meteor Core
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + width / 2 - 2, y + height / 2 - 2, width / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Animated Coin
export function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: number
) {
  ctx.save();
  const scaleX = [1, 0.6, 0.2, 0.6][frame % 4];

  ctx.translate(x + width / 2, y + height / 2);
  ctx.scale(scaleX, 1);

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(-1, -1, width / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(-2, -width / 4, 4, width / 2);

  ctx.restore();
}

// Draw Powerup Badge
export function drawPowerupBadge(
  ctx: CanvasRenderingContext2D,
  type: PowerupType,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y, size, size);

  ctx.lineWidth = 2;
  const colors: Record<PowerupType, string> = {
    SHIELD: '#38bdf8',
    MAGNET: '#ec4899',
    SLOWMO: '#a855f7',
    SCORE2X: '#22c55e',
    COIN2X: '#eab308',
    SUPERJUMP: '#f97316',
    INVINCIBLE: '#ef4444',
  };

  ctx.strokeStyle = colors[type];
  ctx.strokeRect(x, y, size, size);

  // Icon symbol
  ctx.fillStyle = colors[type];
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const labels: Record<PowerupType, string> = {
    SHIELD: 'S',
    MAGNET: 'M',
    SLOWMO: 'SL',
    SCORE2X: '2X',
    COIN2X: 'C$',
    SUPERJUMP: 'JP',
    INVINCIBLE: 'STAR',
  };

  ctx.fillText(labels[type], x + size / 2, y + size / 2);

  ctx.restore();
}
