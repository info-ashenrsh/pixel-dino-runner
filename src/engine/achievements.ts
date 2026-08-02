import { Achievement, PlayerStats } from '../types';
import { sound } from '../utils/audio';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_jump',
    title: 'First Hop',
    description: 'Perform your first jump in Pixel Dino Runner.',
    icon: '🦘',
    unlocked: false,
  },
  {
    id: 'score_100',
    title: 'Century Runner',
    description: 'Reach a score of 100 points.',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'score_500',
    title: 'Half Grand',
    description: 'Reach a score of 500 points.',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'score_1000',
    title: 'Speed Demon',
    description: 'Reach a score of 1000 points.',
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'score_5000',
    title: 'Dino Legend',
    description: 'Reach an epic score of 5000 points!',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'coins_100',
    title: 'Coin Collector',
    description: 'Collect 100 coins in total.',
    icon: '🪙',
    unlocked: false,
  },
  {
    id: 'coins_500',
    title: 'Treasure Hoarder',
    description: 'Collect 500 coins in total.',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'night_survivor',
    title: 'Night Survivor',
    description: 'Survive through a full night cycle.',
    icon: '🌙',
    unlocked: false,
  },
  {
    id: 'perfect_run',
    title: 'Flawless Dash',
    description: 'Reach Level 3 without taking any damage or losing a shield.',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'weather_master',
    title: 'Weather Master',
    description: 'Experience all 7 weather conditions.',
    icon: '🌩️',
    unlocked: false,
  },
];

export class AchievementSystem {
  public achievements: Achievement[];
  public newlyUnlocked: Achievement[] = [];

  constructor(unlockedIds: string[]) {
    this.achievements = INITIAL_ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: unlockedIds.includes(a.id),
    }));
  }

  public checkAchievements(
    stats: PlayerStats,
    currentScore: number,
    level: number,
    isNight: boolean,
    hitCount: number,
    weatherCount: number
  ): string[] {
    const newlyUnlockedIds: string[] = [];

    const unlock = (id: string) => {
      const ach = this.achievements.find((a) => a.id === id);
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toLocaleDateString();
        this.newlyUnlocked.push(ach);
        newlyUnlockedIds.push(id);
        sound.playSound('victory');
      }
    };

    if (stats.totalJumps >= 1) unlock('first_jump');
    if (currentScore >= 100) unlock('score_100');
    if (currentScore >= 500) unlock('score_500');
    if (currentScore >= 1000) unlock('score_1000');
    if (currentScore >= 5000) unlock('score_5000');
    if (stats.coins >= 100) unlock('coins_100');
    if (stats.coins >= 500) unlock('coins_500');
    if (isNight && currentScore > 300) unlock('night_survivor');
    if (level >= 3 && hitCount === 0) unlock('perfect_run');
    if (weatherCount >= 7) unlock('weather_master');

    return newlyUnlockedIds;
  }

  public popUnlocked(): Achievement | undefined {
    return this.newlyUnlocked.shift();
  }
}
