export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'SHOP' | 'ACHIEVEMENTS' | 'SETTINGS' | 'HELP';

export type WeatherType = 'SUNNY' | 'CLOUDY' | 'RAIN' | 'STORM' | 'SNOW' | 'FOG' | 'WIND';

export type TimeOfDay = 'DAY' | 'SUNSET' | 'NIGHT' | 'SUNRISE';

export type SkinId = 'classic' | 'dark' | 'neon' | 'golden' | 'robot' | 'skeleton' | 'ghost';

export interface Skin {
  id: SkinId;
  name: string;
  price: number;
  unlocked: boolean;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  eyeColor: string;
  hasGlow?: boolean;
}

export type PowerupType = 'SHIELD' | 'MAGNET' | 'SLOWMO' | 'SCORE2X' | 'COIN2X' | 'SUPERJUMP' | 'INVINCIBLE';

export interface ActivePowerup {
  type: PowerupType;
  duration: number; // in seconds
  timeLeft: number; // in seconds
}

export type EnemyType = 
  | 'CACTUS_SMALL' 
  | 'CACTUS_LARGE' 
  | 'CACTUS_DOUBLE' 
  | 'CACTUS_TRIPLE' 
  | 'BIRD_LOW' 
  | 'BIRD_MID' 
  | 'BIRD_HIGH' 
  | 'ROCK' 
  | 'ROBOT' 
  | 'METEOR';

export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: string;
}

export interface Obstacle extends Entity {
  enemyType: EnemyType;
  animFrame: number;
  animTimer: number;
  isFlyer?: boolean;
  grounded?: boolean;
  rotation?: number;
}

export interface CoinEntity extends Entity {
  collected: boolean;
  animFrame: number;
  value: number;
}

export interface PowerupEntity extends Entity {
  powerupType: PowerupType;
  collected: boolean;
  pulseTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'pixel' | 'circle' | 'line' | 'star';
}

export interface GhostFrame {
  time: number;
  x: number;
  y: number;
  state: 'RUN' | 'JUMP' | 'DUCK' | 'DEAD';
  ducking: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARDCORE';

export interface GameSettings {
  musicVolume: number; // 0 to 1
  sfxVolume: number;   // 0 to 1
  muted: boolean;
  difficulty: Difficulty;
  crtFilter: boolean;
  showFps: boolean;
  showGhost: boolean;
  particlesEnabled: boolean;
}

export interface PlayerStats {
  highScore: number;
  coins: number;
  totalDistance: number;
  totalJumps: number;
  totalGames: number;
  unlockedSkins: SkinId[];
  equippedSkin: SkinId;
  achievements: string[];
  bestTime: number;
}
