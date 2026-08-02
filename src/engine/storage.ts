import { GameSettings, PlayerStats, SkinId, GhostFrame } from '../types';

const STATS_KEY = 'pixel_dino_runner_stats';
const SETTINGS_KEY = 'pixel_dino_runner_settings';
const GHOST_KEY = 'pixel_dino_runner_ghost';

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  muted: false,
  difficulty: 'NORMAL',
  crtFilter: false,
  showFps: true,
  showGhost: true,
  particlesEnabled: true,
};

export const DEFAULT_STATS: PlayerStats = {
  highScore: 0,
  coins: 0,
  totalDistance: 0,
  totalJumps: 0,
  totalGames: 0,
  unlockedSkins: ['classic'],
  equippedSkin: 'classic',
  achievements: [],
  bestTime: 0,
};

export class StorageEngine {
  public static loadStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback if localStorage fails
    }
    return DEFAULT_STATS;
  }

  public static saveStats(stats: PlayerStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }

  public static loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  public static saveGhostRun(frames: GhostFrame[]) {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify(frames));
    } catch {
      // Ignore
    }
  }

  public static loadGhostRun(): GhostFrame[] {
    try {
      const data = localStorage.getItem(GHOST_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return [];
  }

  public static resetProgress() {
    try {
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem(GHOST_KEY);
    } catch {
      // Ignore
    }
  }
}
