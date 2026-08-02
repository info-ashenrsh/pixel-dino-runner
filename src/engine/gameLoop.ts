import {
  GameState,
  Obstacle,
  CoinEntity,
  PowerupEntity,
  ActivePowerup,
  PowerupType,
  EnemyType,
  GhostFrame,
  PlayerStats,
  GameSettings,
} from '../types';

import { sound } from '../utils/audio';
import {
  drawDinoSprite,
  drawCactus,
  drawBird,
  drawRock,
  drawRobot,
  drawMeteor,
  drawCoin,
  drawPowerupBadge,
  SKINS_DATA,
} from '../utils/sprites';

import { checkPaddedCollision, calculateMagneticPull } from './physics';
import { ParticleSystem } from './particles';
import { DayNightCycle } from './daynight';
import { WeatherSystem } from './weather';
import { StorageEngine } from './storage';
import { AchievementSystem } from './achievements';

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public state: GameState = 'MENU';

  // Game Dimensions
  public readonly V_WIDTH = 800;
  public readonly V_HEIGHT = 400;
  public readonly GROUND_Y = 320;

  // Player State
  public dinoX = 60;
  public dinoY = 260;
  public dinoW = 44;
  public dinoH = 48;
  public vy = 0;
  public gravity = 0.8;
  public jumpStrength = -13.5;
  public isGrounded = true;
  public isDucking = false;
  public isJumping = false;
  public animFrame = 0;
  public animTimer = 0;

  // Game Progress
  public score = 0;
  public coinsEarned = 0;
  public baseSpeed = 6.0;
  public currentSpeed = 6.0;
  public level = 1;
  public distance = 0;
  public timeSurvived = 0;
  public hitCount = 0;
  public experiencedWeathers: Set<string> = new Set(['SUNNY']);

  // Active Powerups
  public activePowerups: ActivePowerup[] = [];

  // Entities & Pooling
  public obstacles: Obstacle[] = [];
  public coins: CoinEntity[] = [];
  public powerups: PowerupEntity[] = [];
  public spawnTimer = 0;
  public coinSpawnTimer = 0;
  public powerupSpawnTimer = 0;

  // Sub-systems
  public particles = new ParticleSystem();
  public dayNight = new DayNightCycle();
  public weather = new WeatherSystem();
  public stats: PlayerStats;
  public settings: GameSettings;
  public achievements: AchievementSystem;

  // Ghost Telemetry
  public currentGhostFrames: GhostFrame[] = [];
  public highScoresGhostFrames: GhostFrame[] = [];

  // Performance & Loop
  private lastTime = 0;
  public fps = 60;
  private frameCount = 0;
  private fpsTimer = 0;
  private reqId: number | null = null;

  // Callback for React state updates
  public onStateChange?: (state: GameState) => void;
  public onScoreUpdate?: (score: number, coins: number, level: number, distance: number) => void;
  public onToast?: (title: string, desc: string, icon: string) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.stats = StorageEngine.loadStats();
    this.settings = StorageEngine.loadSettings();
    this.achievements = new AchievementSystem(this.stats.achievements);
    this.highScoresGhostFrames = StorageEngine.loadGhostRun();

    sound.setVolumes(this.settings.sfxVolume, this.settings.musicVolume, this.settings.muted);
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    sound.playMusic('menu');
  }

  public stop() {
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
      this.reqId = null;
    }
  }

  private loop = (now: number) => {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1.0) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();

    this.reqId = requestAnimationFrame(this.loop);
  };

  public startGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.coinsEarned = 0;
    this.distance = 0;
    this.timeSurvived = 0;
    this.hitCount = 0;
    this.level = 1;

    // Difficulty Speed Modifiers
    const diffMap = { EASY: 5.0, NORMAL: 6.5, HARDCORE: 8.5 };
    this.baseSpeed = diffMap[this.settings.difficulty] || 6.5;
    this.currentSpeed = this.baseSpeed;

    this.dinoY = this.GROUND_Y - this.dinoH;
    this.vy = 0;
    this.isGrounded = true;
    this.isDucking = false;

    this.obstacles = [];
    this.coins = [];
    this.powerups = [];
    this.activePowerups = [];
    this.particles.clear();
    this.currentGhostFrames = [];

    this.dayNight.reset();
    this.weather.setWeather('SUNNY');

    sound.playMusic('gameplay');
    if (this.onStateChange) this.onStateChange('PLAYING');
  }

  public pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      sound.playSound('pause');
      if (this.onStateChange) this.onStateChange('PAUSED');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      if (this.onStateChange) this.onStateChange('PLAYING');
    }
  }

  public handleJump() {
    if (this.state === 'MENU' || this.state === 'GAMEOVER') {
      this.startGame();
      return;
    }

    if (this.state === 'PLAYING' && this.isGrounded) {
      const superJumpActive = this.hasPowerup('SUPERJUMP');
      this.vy = superJumpActive ? this.jumpStrength * 1.35 : this.jumpStrength;
      this.isGrounded = false;
      this.isJumping = true;

      sound.playSound('jump');
      this.stats.totalJumps++;
      this.particles.createDust(this.dinoX + 10, this.dinoY + this.dinoH, 6);
    }
  }

  public handleDuck(ducking: boolean) {
    if (this.state === 'PLAYING') {
      this.isDucking = ducking;
      if (ducking && !this.isGrounded) {
        // Fast drop when ducking in air
        this.vy += 4.0;
        sound.playSound('duck');
      }
    }
  }

  public hasPowerup(type: PowerupType): boolean {
    return this.activePowerups.some((p) => p.type === type && p.timeLeft > 0);
  }

  private update(dt: number) {
    this.timeSurvived += dt;

    // Slow Mo Powerup check
    const slowMoActive = this.hasPowerup('SLOWMO');
    const speedMultiplier = slowMoActive ? 0.6 : 1.0;
    const effectiveSpeed = this.currentSpeed * speedMultiplier;

    // Update Distance & Score
    const scoreMult = this.hasPowerup('SCORE2X') ? 2 : 1;
    this.distance += effectiveSpeed * dt * 3;
    this.score = Math.floor(this.distance * scoreMult);

    // Calculate Level (Level 1 to 5 + Endless)
    const prevLevel = this.level;
    if (this.score < 200) this.level = 1;
    else if (this.score < 500) this.level = 2;
    else if (this.score < 1000) this.level = 3;
    else if (this.score < 2000) this.level = 4;
    else if (this.score < 3500) this.level = 5;
    else this.level = 5 + Math.floor((this.score - 3500) / 2000);

    if (this.level > prevLevel) {
      sound.playSound('levelup');
      this.currentSpeed += 0.8;
      if (this.level === 5) {
        sound.playMusic('boss');
      }
    }

    // Update Active Powerups
    for (let i = this.activePowerups.length - 1; i >= 0; i--) {
      const p = this.activePowerups[i];
      p.timeLeft -= dt;
      if (p.timeLeft <= 0) {
        this.activePowerups.splice(i, 1);
      }
    }

    // Player Physics & Animation
    this.vy += this.gravity;
    this.dinoY += this.vy;

    const currentH = this.isDucking ? 32 : 48;
    const targetGroundY = this.GROUND_Y - currentH;

    if (this.dinoY >= targetGroundY) {
      if (!this.isGrounded) {
        this.particles.createDust(this.dinoX + 15, this.GROUND_Y, 8);
        sound.playSound('land');
      }
      this.dinoY = targetGroundY;
      this.vy = 0;
      this.isGrounded = true;
      this.isJumping = false;
    }

    this.animTimer += dt;
    if (this.animTimer > 0.08) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }

    // Record Ghost Telemetry
    if (this.settings.showGhost) {
      this.currentGhostFrames.push({
        time: this.timeSurvived,
        x: this.dinoX,
        y: this.dinoY,
        state: this.isJumping ? 'JUMP' : this.isDucking ? 'DUCK' : 'RUN',
        ducking: this.isDucking,
      });
    }

    // Update Sub-Systems
    this.dayNight.update(dt);
    this.weather.update(dt, this.particles, this.V_WIDTH);
    this.experiencedWeathers.add(this.weather.currentWeather);
    this.particles.update(dt);

    // Spawning Logic
    this.spawnTimer += dt;
    const minSpawnDelay = Math.max(1.2, 2.5 - this.level * 0.2);
    if (this.spawnTimer > minSpawnDelay + Math.random() * 1.5) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    this.coinSpawnTimer += dt;
    if (this.coinSpawnTimer > 3.0 + Math.random() * 2) {
      this.coinSpawnTimer = 0;
      this.spawnCoinGroup();
    }

    this.powerupSpawnTimer += dt;
    if (this.powerupSpawnTimer > 12.0 + Math.random() * 8) {
      this.powerupSpawnTimer = 0;
      this.spawnPowerup();
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= effectiveSpeed;

      if (obs.enemyType === 'ROCK') {
        obs.rotation = (obs.rotation || 0) - 0.1;
      }

      if (obs.enemyType === 'BIRD_LOW' || obs.enemyType === 'BIRD_MID' || obs.enemyType === 'BIRD_HIGH') {
        obs.animTimer += dt;
        if (obs.animTimer > 0.15) {
          obs.animTimer = 0;
          obs.animFrame = (obs.animFrame + 1) % 2;
        }
      }

      // Check Collision with Dino
      const dinoBox = {
        x: this.dinoX,
        y: this.dinoY,
        width: this.dinoW,
        height: currentH,
      };

      const obsBox = {
        x: obs.x,
        y: obs.y,
        width: obs.width,
        height: obs.height,
      };

      if (checkPaddedCollision(dinoBox, obsBox, 4, 4)) {
        if (this.hasPowerup('INVINCIBLE')) {
          // Destroy obstacle
          this.particles.createExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2);
          sound.playSound('explosion');
          this.obstacles.splice(i, 1);
          continue;
        } else if (this.hasPowerup('SHIELD')) {
          // Remove shield
          const sIdx = this.activePowerups.findIndex((p) => p.type === 'SHIELD');
          if (sIdx !== -1) this.activePowerups.splice(sIdx, 1);

          this.particles.createExplosion(this.dinoX + this.dinoW / 2, this.dinoY + currentH / 2, '#38bdf8', 15);
          sound.playSound('hit');
          this.obstacles.splice(i, 1);
          continue;
        } else {
          // Game Over!
          this.gameOver();
          return;
        }
      }

      if (obs.x + obs.width < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // Update Coins
    const magnetActive = this.hasPowerup('MAGNET');
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];

      if (magnetActive && !coin.collected) {
        const pull = calculateMagneticPull(coin.x, coin.y, this.dinoX + 20, this.dinoY + 20, 14);
        coin.x += pull.vx;
        coin.y += pull.vy;
      } else {
        coin.x -= effectiveSpeed;
      }

      coin.animFrame = Math.floor(Date.now() / 150) % 4;

      const dinoBox = { x: this.dinoX, y: this.dinoY, width: this.dinoW, height: currentH };
      const coinBox = { x: coin.x, y: coin.y, width: coin.width, height: coin.height };

      if (!coin.collected && checkPaddedCollision(dinoBox, coinBox, 2, 2)) {
        coin.collected = true;
        const coinMult = this.hasPowerup('COIN2X') ? 2 : 1;
        const amount = coin.value * coinMult;
        this.coinsEarned += amount;

        sound.playSound('coin');
        this.particles.createSparkles(coin.x, coin.y, '#facc15', 8);
        this.coins.splice(i, 1);
        continue;
      }

      if (coin.x < -40) {
        this.coins.splice(i, 1);
      }
    }

    // Update Powerup Items
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.x -= effectiveSpeed;

      const dinoBox = { x: this.dinoX, y: this.dinoY, width: this.dinoW, height: currentH };
      const pBox = { x: p.x, y: p.y, width: p.width, height: p.height };

      if (!p.collected && checkPaddedCollision(dinoBox, pBox, 2, 2)) {
        p.collected = true;
        this.activePowerups.push({
          type: p.powerupType,
          duration: 10,
          timeLeft: 10,
        });

        sound.playSound('powerup');
        this.particles.createSparkles(p.x, p.y, '#38bdf8', 12);
        this.powerups.splice(i, 1);
        continue;
      }

      if (p.x < -40) {
        this.powerups.splice(i, 1);
      }
    }

    // Check Achievements & React callback
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.coinsEarned, this.level, Math.floor(this.distance));
    }

    const newlyUnlocked = this.achievements.checkAchievements(
      this.stats,
      this.score,
      this.level,
      this.dayNight.timeOfDay === 'NIGHT',
      this.hitCount,
      this.experiencedWeathers.size
    );

    if (newlyUnlocked.length > 0) {
      this.stats.achievements = [...new Set([...this.stats.achievements, ...newlyUnlocked])];
      StorageEngine.saveStats(this.stats);

      const pop = this.achievements.popUnlocked();
      if (pop && this.onToast) {
        this.onToast(pop.title, pop.description, pop.icon);
      }
    }
  }

  private spawnObstacle() {
    // Determine available obstacle types based on current level
    const availableTypes: EnemyType[] = ['CACTUS_SMALL', 'CACTUS_LARGE', 'CACTUS_DOUBLE'];
    if (this.level >= 2) availableTypes.push('BIRD_LOW', 'BIRD_MID', 'BIRD_HIGH', 'CACTUS_TRIPLE');
    if (this.level >= 3) availableTypes.push('ROCK');
    if (this.level >= 4) availableTypes.push('ROBOT');
    if (this.level >= 5) availableTypes.push('METEOR');

    const choice = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    let obs: Obstacle = {
      id: Math.random().toString(),
      x: this.V_WIDTH + 20,
      y: this.GROUND_Y - 40,
      width: 30,
      height: 40,
      vx: 0,
      vy: 0,
      type: 'OBSTACLE',
      enemyType: choice,
      animFrame: 0,
      animTimer: 0,
    };

    if (choice === 'CACTUS_SMALL') {
      obs.width = 24;
      obs.height = 36;
      obs.y = this.GROUND_Y - 36;
    } else if (choice === 'CACTUS_LARGE') {
      obs.width = 32;
      obs.height = 50;
      obs.y = this.GROUND_Y - 50;
    } else if (choice === 'CACTUS_DOUBLE') {
      obs.width = 44;
      obs.height = 42;
      obs.y = this.GROUND_Y - 42;
    } else if (choice === 'CACTUS_TRIPLE') {
      obs.width = 62;
      obs.height = 46;
      obs.y = this.GROUND_Y - 46;
    } else if (choice === 'BIRD_LOW') {
      obs.width = 42;
      obs.height = 32;
      obs.y = this.GROUND_Y - 40; // Needs duck or jump
      obs.isFlyer = true;
    } else if (choice === 'BIRD_MID') {
      obs.width = 42;
      obs.height = 32;
      obs.y = this.GROUND_Y - 70; // Jump or duck depending
      obs.isFlyer = true;
    } else if (choice === 'BIRD_HIGH') {
      obs.width = 42;
      obs.height = 32;
      obs.y = this.GROUND_Y - 100; // Stand under easily
      obs.isFlyer = true;
    } else if (choice === 'ROCK') {
      obs.width = 36;
      obs.height = 36;
      obs.y = this.GROUND_Y - 36;
      obs.rotation = 0;
    } else if (choice === 'ROBOT') {
      obs.width = 34;
      obs.height = 48;
      obs.y = this.GROUND_Y - 48;
    } else if (choice === 'METEOR') {
      obs.width = 30;
      obs.height = 30;
      obs.y = 20 + Math.random() * 80;
      obs.x = this.V_WIDTH + 100;
    }

    this.obstacles.push(obs);
  }

  private spawnCoinGroup() {
    const count = Math.floor(Math.random() * 4) + 2;
    const startX = this.V_WIDTH + 40;
    const startY = this.GROUND_Y - (Math.random() > 0.5 ? 40 : 80);

    for (let i = 0; i < count; i++) {
      const coin: CoinEntity = {
        id: Math.random().toString(),
        x: startX + i * 28,
        y: startY,
        width: 20,
        height: 20,
        vx: 0,
        vy: 0,
        type: 'COIN',
        collected: false,
        animFrame: 0,
        value: 1,
      };
      this.coins.push(coin);
    }
  }

  private spawnPowerup() {
    const types: PowerupType[] = ['SHIELD', 'MAGNET', 'SLOWMO', 'SCORE2X', 'COIN2X', 'SUPERJUMP', 'INVINCIBLE'];
    const pType = types[Math.floor(Math.random() * types.length)];

    const powerup: PowerupEntity = {
      id: Math.random().toString(),
      x: this.V_WIDTH + 40,
      y: this.GROUND_Y - 70,
      width: 28,
      height: 28,
      vx: 0,
      vy: 0,
      type: 'POWERUP',
      powerupType: pType,
      collected: false,
      pulseTimer: 0,
    };
    this.powerups.push(powerup);
  }

  private gameOver() {
    this.state = 'GAMEOVER';
    sound.playSound('gameover');
    sound.stopMusic();

    this.particles.createExplosion(this.dinoX + 20, this.dinoY + 20, '#ef4444', 30);

    // Update Persistent Stats
    this.stats.totalGames++;
    this.stats.totalDistance += Math.floor(this.distance);
    this.stats.coins += this.coinsEarned;

    let isNewHigh = false;
    if (this.score > this.stats.highScore) {
      this.stats.highScore = this.score;
      this.stats.bestTime = Math.floor(this.timeSurvived);
      isNewHigh = true;

      // Save Ghost Run
      StorageEngine.saveGhostRun(this.currentGhostFrames);
      this.highScoresGhostFrames = [...this.currentGhostFrames];
    }

    StorageEngine.saveStats(this.stats);

    if (this.onStateChange) this.onStateChange('GAMEOVER');
  }

  private render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.V_WIDTH, this.V_HEIGHT);

    // 1. Draw Day/Night Background Sky, Sun/Moon, Stars
    this.dayNight.draw(ctx, this.V_WIDTH, this.V_HEIGHT);

    // 2. Parallax Scenery (Mountains & Trees)
    this.drawScenery(ctx);

    // 3. Ground Line
    ctx.fillStyle = this.dayNight.groundColor;
    ctx.fillRect(0, this.GROUND_Y, this.V_WIDTH, 4);

    // Ground texture dots
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    const offset = Math.floor(this.distance * 2) % 40;
    for (let x = -offset; x < this.V_WIDTH; x += 40) {
      ctx.fillRect(x, this.GROUND_Y + 10, 8, 2);
      ctx.fillRect(x + 20, this.GROUND_Y + 22, 12, 2);
    }

    // 4. Ghost Dino (High Score Run)
    if (this.settings.showGhost && this.state === 'PLAYING' && this.highScoresGhostFrames.length > 0) {
      const matchFrame = this.highScoresGhostFrames.find((f) => f.time >= this.timeSurvived);
      if (matchFrame) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        drawDinoSprite(
          ctx,
          matchFrame.state === 'JUMP' ? 'JUMP' : matchFrame.ducking ? 'DUCK1' : 'RUN1',
          'ghost',
          matchFrame.x,
          matchFrame.y,
          this.dinoW,
          matchFrame.ducking ? 32 : 48
        );
        ctx.restore();
      }
    }

    // 5. Player Dino
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'GAMEOVER') {
      let stateName: 'RUN1' | 'RUN2' | 'DUCK1' | 'DUCK2' | 'JUMP' | 'DEAD' = 'RUN1';
      if (this.state === 'GAMEOVER') {
        stateName = 'DEAD';
      } else if (!this.isGrounded) {
        stateName = 'JUMP';
      } else if (this.isDucking) {
        stateName = this.animFrame === 0 ? 'DUCK1' : 'DUCK2';
      } else {
        stateName = this.animFrame === 0 ? 'RUN1' : 'RUN2';
      }

      drawDinoSprite(
        ctx,
        stateName,
        this.stats.equippedSkin,
        this.dinoX,
        this.dinoY,
        this.dinoW,
        this.isDucking ? 32 : 48,
        this.hasPowerup('SHIELD'),
        this.hasPowerup('INVINCIBLE')
      );
    }

    // 6. Obstacles
    for (const obs of this.obstacles) {
      if (obs.enemyType.startsWith('CACTUS')) {
        drawCactus(ctx, obs.x, obs.y, obs.width, obs.height, obs.enemyType as any);
      } else if (obs.enemyType.startsWith('BIRD')) {
        drawBird(ctx, obs.x, obs.y, obs.width, obs.height, obs.animFrame === 0);
      } else if (obs.enemyType === 'ROCK') {
        drawRock(ctx, obs.x, obs.y, obs.width, obs.height, obs.rotation || 0);
      } else if (obs.enemyType === 'ROBOT') {
        drawRobot(ctx, obs.x, obs.y, obs.width, obs.height, this.animTimer);
      } else if (obs.enemyType === 'METEOR') {
        drawMeteor(ctx, obs.x, obs.y, obs.width, obs.height);
      }
    }

    // 7. Coins
    for (const coin of this.coins) {
      if (!coin.collected) {
        drawCoin(ctx, coin.x, coin.y, coin.width, coin.height, coin.animFrame);
      }
    }

    // 8. Powerup Badges
    for (const p of this.powerups) {
      if (!p.collected) {
        drawPowerupBadge(ctx, p.powerupType, p.x, p.y, p.width);
      }
    }

    // 9. Weather Effects & Particles
    this.particles.draw(ctx);
    this.weather.draw(ctx, this.V_WIDTH, this.V_HEIGHT);

    ctx.restore();
  }

  private drawScenery(ctx: CanvasRenderingContext2D) {
    // Parallax Mountain Range
    ctx.save();
    ctx.fillStyle = this.dayNight.timeOfDay === 'NIGHT' ? '#1e293b' : '#cbd5e1';

    const mountainOffset = (this.distance * 0.2) % 300;
    for (let x = -mountainOffset; x < this.V_WIDTH + 300; x += 300) {
      ctx.beginPath();
      ctx.moveTo(x, this.GROUND_Y);
      ctx.lineTo(x + 100, this.GROUND_Y - 90);
      ctx.lineTo(x + 180, this.GROUND_Y - 40);
      ctx.lineTo(x + 300, this.GROUND_Y);
      ctx.fill();
    }

    // Distant Trees & Bushes
    ctx.fillStyle = this.dayNight.timeOfDay === 'NIGHT' ? '#334155' : '#94a3b8';
    const treeOffset = (this.distance * 0.6) % 150;
    for (let x = -treeOffset; x < this.V_WIDTH + 150; x += 150) {
      ctx.fillRect(x, this.GROUND_Y - 24, 8, 24);
      ctx.beginPath();
      ctx.arc(x + 4, this.GROUND_Y - 28, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public getScreenshotDataUrl(): string {
    return this.canvas.toDataURL('image/png');
  }
}
