import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PixelCanvas } from './components/PixelCanvas';
import { UIOverlay } from './components/UIOverlay';
import { GameEngine } from './engine/gameLoop';
import { GameState, GameSettings, PlayerStats, Achievement, SkinId } from './types';
import { StorageEngine } from './engine/storage';
import { sound } from './utils/audio';
import { SKINS_DATA } from './utils/sprites';

export default function App() {
  const gameEngineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [distance, setDistance] = useState<number>(0);
  const [fps, setFps] = useState<number>(60);

  const [stats, setStats] = useState<PlayerStats>(() => StorageEngine.loadStats());
  const [settings, setSettings] = useState<GameSettings>(() => StorageEngine.loadSettings());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activePowerups, setActivePowerups] = useState<{ type: string; timeLeft: number; duration: number }[]>([]);
  const [toast, setToast] = useState<{ title: string; desc: string; icon: string } | null>(null);

  // Sync callbacks with Game Engine instance
  useEffect(() => {
    const engine = gameEngineRef.current;
    if (!engine) return;

    engine.onStateChange = (newState) => {
      setGameState(newState);
    };

    engine.onScoreUpdate = (s, c, l, d) => {
      setScore(s);
      setCoins(c);
      setLevel(l);
      setDistance(d);
      setFps(engine.fps);
      setActivePowerups(engine.activePowerups);
    };

    engine.onToast = (title, desc, icon) => {
      setToast({ title, desc, icon });
      setTimeout(() => setToast(null), 4000);
    };

    setAchievements(engine.achievements.achievements);
  }, [gameEngineRef.current]);

  const handleStartGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startGame();
    }
  }, []);

  const handlePauseGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame();
    }
  }, []);

  const handleOpenShop = useCallback(() => {
    setGameState('SHOP');
  }, []);

  const handleOpenAchievements = useCallback(() => {
    if (gameEngineRef.current) {
      setAchievements([...gameEngineRef.current.achievements.achievements]);
    }
    setGameState('ACHIEVEMENTS');
  }, []);

  const handleOpenSettings = useCallback(() => {
    setGameState('SETTINGS');
  }, []);

  const handleOpenHelp = useCallback(() => {
    setGameState('HELP');
  }, []);

  const handleCloseModal = useCallback(() => {
    setGameState('MENU');
    sound.playMusic('menu');
  }, []);

  const handleEquipSkin = useCallback((skinId: SkinId) => {
    const newStats = { ...stats, equippedSkin: skinId };
    setStats(newStats);
    StorageEngine.saveStats(newStats);

    if (gameEngineRef.current) {
      gameEngineRef.current.stats = newStats;
    }
    sound.playSound('click');
  }, [stats]);

  const handleBuySkin = useCallback((skinId: SkinId) => {
    const skin = SKINS_DATA.find((s) => s.id === skinId);
    if (!skin) return;

    if (stats.coins >= skin.price && !stats.unlockedSkins.includes(skinId)) {
      const newCoins = stats.coins - skin.price;
      const newUnlocked = [...stats.unlockedSkins, skinId];
      const newStats: PlayerStats = {
        ...stats,
        coins: newCoins,
        unlockedSkins: newUnlocked,
        equippedSkin: skinId,
      };

      setStats(newStats);
      StorageEngine.saveStats(newStats);

      if (gameEngineRef.current) {
        gameEngineRef.current.stats = newStats;
      }

      sound.playSound('powerup');
    }
  }, [stats]);

  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    StorageEngine.saveSettings(newSettings);
    sound.setVolumes(newSettings.sfxVolume, newSettings.musicVolume, newSettings.muted);

    if (gameEngineRef.current) {
      gameEngineRef.current.settings = newSettings;
    }
  }, []);

  const handleResetProgress = useCallback(() => {
    StorageEngine.resetProgress();
    const defaultStats = StorageEngine.loadStats();
    setStats(defaultStats);
    if (gameEngineRef.current) {
      gameEngineRef.current.stats = defaultStats;
    }
    sound.playSound('click');
  }, []);

  const handleTakeScreenshot = useCallback(() => {
    if (gameEngineRef.current) {
      const dataUrl = gameEngineRef.current.getScreenshotDataUrl();
      const link = document.createElement('a');
      link.download = `pixel-dino-score-${score}.png`;
      link.href = dataUrl;
      link.click();
    }
  }, [score]);

  const handleShareScore = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🦖 I just scored ${score} points in Pixel Dino Runner! Can you beat my high score of ${stats.highScore}?`
      );
      setToast({ title: 'COPIED!', desc: 'Score copied to clipboard', icon: '📋' });
      setTimeout(() => setToast(null), 3000);
    }
  }, [score, stats.highScore]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-0 sm:p-2 select-none overflow-hidden font-['Courier_Prime',monospace]">
      <div className="relative w-full max-w-[1024px] h-[768px] max-h-screen bg-zinc-950 overflow-hidden flex flex-col justify-between border-2 border-zinc-800 rounded shadow-2xl">
        {/* Immersive CRT & Vignette layers */}
        {settings.crtFilter && <div className="absolute inset-0 crt-overlay pointer-events-none z-50" />}
        <div className="absolute inset-0 vignette pointer-events-none z-40" />

        {/* Canvas & Interactive UI Engine */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
          <PixelCanvas gameEngineRef={gameEngineRef} crtFilter={settings.crtFilter} />

          <UIOverlay
            gameState={gameState}
            score={score}
            coins={coins}
            level={level}
            distance={distance}
            fps={fps}
            stats={stats}
            settings={settings}
            achievements={achievements}
            activePowerups={activePowerups}
            toast={toast}
            onStartGame={handleStartGame}
            onPauseGame={handlePauseGame}
            onOpenShop={handleOpenShop}
            onOpenAchievements={handleOpenAchievements}
            onOpenSettings={handleOpenSettings}
            onOpenHelp={handleOpenHelp}
            onCloseModal={handleCloseModal}
            onEquipSkin={handleEquipSkin}
            onBuySkin={handleBuySkin}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onJump={() => gameEngineRef.current?.handleJump()}
            onDuck={(ducking) => gameEngineRef.current?.handleDuck(ducking)}
            onTakeScreenshot={handleTakeScreenshot}
            onShareScore={handleShareScore}
          />
        </div>

        {/* Immersive HUD Bottom Status Bar */}
        <div className="bg-white text-black p-3 sm:p-4 px-4 sm:px-8 flex justify-between items-center z-30 font-mono border-t border-zinc-300 pointer-events-auto">
          <div className="flex gap-4 sm:gap-8 items-center text-xs">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase opacity-60 tracking-widest">Input</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight">[SPACE] JUMP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase opacity-60 tracking-widest">Duck</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight">[ARROW DOWN]</span>
            </div>
            <div className="flex flex-col hidden xs:flex">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase opacity-60 tracking-widest">Pause</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight">[P]</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black font-bold text-xs sm:text-sm">$</div>
              <div className="text-lg sm:text-2xl font-bold tracking-tighter">x {coins.toString().padStart(3, '0')}</div>
            </div>
            <div className="h-7 w-[1px] bg-black opacity-20 hidden sm:block"></div>
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Engine State</span>
              <span className="text-sm font-bold">{fps > 0 ? fps.toFixed(1) : '60.0'} FPS // STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
