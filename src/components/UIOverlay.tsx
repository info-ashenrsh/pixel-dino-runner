import React, { useState } from 'react';
import { GameState, GameSettings, PlayerStats, Achievement, SkinId } from '../types';
import { SKINS_DATA } from '../utils/sprites';
import { StorageEngine } from '../engine/storage';
import { sound } from '../utils/audio';
import {
  Trophy,
  ShoppingBag,
  Settings,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Camera,
  Share2,
  HelpCircle,
  Shield,
  Zap,
  CheckCircle,
  Sparkles,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

interface UIOverlayProps {
  gameState: GameState;
  score: number;
  coins: number;
  level: number;
  distance: number;
  fps: number;
  stats: PlayerStats;
  settings: GameSettings;
  achievements: Achievement[];
  activePowerups: { type: string; timeLeft: number; duration: number }[];
  toast: { title: string; desc: string; icon: string } | null;
  onStartGame: () => void;
  onPauseGame: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onCloseModal: () => void;
  onEquipSkin: (skinId: SkinId) => void;
  onBuySkin: (skinId: SkinId) => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onJump: () => void;
  onDuck: (ducking: boolean) => void;
  onTakeScreenshot: () => void;
  onShareScore: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  gameState,
  score,
  coins,
  level,
  distance,
  fps,
  stats,
  settings,
  achievements,
  activePowerups,
  toast,
  onStartGame,
  onPauseGame,
  onOpenShop,
  onOpenAchievements,
  onOpenSettings,
  onOpenHelp,
  onCloseModal,
  onEquipSkin,
  onBuySkin,
  onUpdateSettings,
  onResetProgress,
  onJump,
  onDuck,
  onTakeScreenshot,
  onShareScore,
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-20 select-none font-['Courier_Prime',monospace]">
      {/* 1. HUD OVERLAY (Active during PLAYING or PAUSED) */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="flex justify-between items-start w-full p-2 sm:p-4">
          {/* Top Left: Level & Active Statuses */}
          <div className="flex flex-col gap-1">
            <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">Level</div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tighter text-white">
              {level.toString().padStart(2, '0')} <span className="text-zinc-700">/ 05</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-300">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="uppercase opacity-80">{distance}m DISTANCE</span>
              </div>
              {activePowerups.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-700 px-2 py-0.5 rounded text-[10px] text-white"
                >
                  <div className="w-2 h-2 bg-zinc-400"></div>
                  <span className="uppercase opacity-90">{p.type}: {p.timeLeft.toFixed(0)}s</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Right: High Score & Current Score & Pause */}
          <div className="flex flex-col items-end gap-1 text-right pointer-events-auto">
            <div>
              <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">High Score</div>
              <div className="text-base sm:text-xl font-bold text-zinc-300 tracking-tight">HI {stats.highScore.toString().padStart(6, '0')}</div>
            </div>
            <div className="mt-0.5">
              <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">Current</div>
              <div className="text-3xl sm:text-5xl font-bold tracking-tighter dino-glow text-white">
                {score.toString().padStart(6, '0')}
              </div>
            </div>
            <button
              onClick={() => {
                sound.playSound('click');
                onPauseGame();
              }}
              className="mt-2 bg-zinc-900 hover:bg-zinc-800 active:scale-95 border border-zinc-600 px-3 py-1 rounded text-xs text-white font-bold transition uppercase tracking-wider shadow-md"
            >
              {gameState === 'PAUSED' ? '[RESUME]' : '[PAUSE]'}
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN MENU OVERLAY */}
      {gameState === 'MENU' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="mb-6 space-y-2">
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">RETRO MONOCHROME RUNNER</div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white dino-glow">
              PIXEL DINO RUNNER
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">Procedural Audio • Dynamic Weather • Unlockable Skins</p>
          </div>

          {/* Menu Action Grid */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={() => {
                sound.playSound('click');
                onStartGame();
              }}
              className="w-full sm:w-auto flex-1 bg-white hover:bg-zinc-200 text-black font-bold px-8 py-3.5 rounded border-2 border-white shadow-xl active:scale-95 transition flex items-center justify-center space-x-2 text-sm uppercase tracking-widest"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START RUN</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-md mt-4">
            <button
              onClick={() => {
                sound.playSound('click');
                onOpenShop();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded text-xs text-white flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300" />
              <span className="uppercase font-bold tracking-wider">SKINS</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onOpenAchievements();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded text-xs text-white flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
            >
              <Trophy className="w-4 h-4 text-zinc-300" />
              <span className="uppercase font-bold tracking-wider">AWARDS</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onOpenSettings();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded text-xs text-white flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
            >
              <Settings className="w-4 h-4 text-zinc-300" />
              <span className="uppercase font-bold tracking-wider">SETTINGS</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onOpenHelp();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded text-xs text-white flex flex-col items-center justify-center space-y-1.5 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-zinc-300" />
              <span className="uppercase font-bold tracking-wider">CONTROLS</span>
            </button>
          </div>

          <div className="mt-6 text-xs text-zinc-500 flex items-center space-x-6 uppercase tracking-widest">
            <span>HIGH SCORE: {stats.highScore}</span>
            <span>COINS: x{stats.coins}</span>
          </div>
        </div>
      )}

      {/* 3. PAUSE MENU */}
      {gameState === 'PAUSED' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-widest">SYSTEM PAUSED</h2>

          <div className="flex flex-col space-y-3 w-52">
            <button
              onClick={() => {
                sound.playSound('click');
                onPauseGame();
              }}
              className="bg-white hover:bg-zinc-200 text-black py-2.5 rounded border border-white text-xs font-bold transition active:scale-95 uppercase tracking-wider"
            >
              RESUME
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onStartGame();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded border border-zinc-700 text-xs font-bold transition active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onOpenSettings();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded border border-zinc-700 text-xs font-bold transition active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <Settings className="w-4 h-4" />
              <span>SETTINGS</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onCloseModal();
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded border border-zinc-600 text-xs font-bold transition active:scale-95 uppercase tracking-wider"
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* 4. GAME OVER SCREEN */}
      {gameState === 'GAMEOVER' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">RUN TERMINATED</div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight dino-glow">GAME OVER</h2>

          <div className="bg-zinc-900 border border-zinc-700 rounded p-4 w-full max-w-xs mb-6 space-y-2.5 text-xs text-left">
            <div className="flex justify-between text-zinc-400">
              <span className="uppercase tracking-wider">SCORE:</span>
              <span className="font-bold text-white">{score}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span className="uppercase tracking-wider">HIGH SCORE:</span>
              <span className="font-bold text-zinc-200">{stats.highScore}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span className="uppercase tracking-wider">COINS EARNED:</span>
              <span className="font-bold text-white">+${coins}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span className="uppercase tracking-wider">DISTANCE:</span>
              <span className="font-bold text-zinc-200">{distance}m</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={() => {
                sound.playSound('click');
                onStartGame();
              }}
              className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 rounded border border-white text-xs font-bold transition active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-widest"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                onCloseModal();
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white py-3 px-4 rounded border border-zinc-700 text-xs font-bold transition active:scale-95 uppercase tracking-wider"
            >
              MENU
            </button>
          </div>

          {/* Quick Tools */}
          <div className="flex space-x-3 mt-4">
            <button
              onClick={onTakeScreenshot}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-[10px] text-zinc-300 flex items-center space-x-1.5 uppercase font-bold tracking-wider"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>SCREENSHOT</span>
            </button>

            <button
              onClick={onShareScore}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-[10px] text-zinc-300 flex items-center space-x-1.5 uppercase font-bold tracking-wider"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. SKINS SHOP MODAL */}
      {gameState === 'SHOP' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center z-30">
          <div className="flex justify-between items-center w-full max-w-lg mb-4 border-b border-zinc-800 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              <span>DINO SKINS SHOP</span>
            </h2>
            <span className="text-xs text-zinc-300 font-bold">🪙 x{stats.coins} COINS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg overflow-y-auto max-h-[260px] p-1">
            {SKINS_DATA.map((skin) => {
              const isUnlocked = stats.unlockedSkins.includes(skin.id);
              const isEquipped = stats.equippedSkin === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition ${
                    isEquipped
                      ? 'bg-zinc-900 border-white'
                      : isUnlocked
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600'
                      : 'bg-zinc-950 border-zinc-900 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white uppercase">{skin.name}</span>
                      <div
                        className="w-4 h-4 rounded border border-zinc-600"
                        style={{ backgroundColor: skin.colorPrimary }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400 mb-2">{skin.description}</p>
                  </div>

                  {isEquipped ? (
                    <span className="text-[10px] text-zinc-200 font-bold flex items-center space-x-1 uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span>EQUIPPED</span>
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onEquipSkin(skin.id)}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-xs text-white py-1 rounded border border-zinc-600 transition uppercase font-bold tracking-wider"
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={() => onBuySkin(skin.id)}
                      disabled={stats.coins < skin.price}
                      className={`w-full py-1 rounded text-xs font-bold transition flex items-center justify-center space-x-1 uppercase tracking-wider ${
                        stats.coins >= skin.price
                          ? 'bg-white hover:bg-zinc-200 text-black'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <span>BUY 🪙 {skin.price}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onCloseModal}
            className="mt-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2 rounded text-xs font-bold border border-zinc-700 uppercase tracking-wider"
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {/* 6. ACHIEVEMENTS MODAL */}
      {gameState === 'ACHIEVEMENTS' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center z-30">
          <div className="flex justify-between items-center w-full max-w-lg mb-4 border-b border-zinc-800 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-zinc-400" />
              <span>ACHIEVEMENTS</span>
            </h2>
            <span className="text-xs text-zinc-400 uppercase tracking-wider">
              {achievements.filter((a) => a.unlocked).length} / {achievements.length} UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg overflow-y-auto max-h-[260px] p-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-2.5 rounded border text-left flex items-start space-x-3 transition ${
                  ach.unlocked
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60'
                }`}
              >
                <div className="text-xl">{ach.icon}</div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide">{ach.title}</div>
                  <div className="text-[10px] text-zinc-400">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onCloseModal}
            className="mt-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2 rounded text-xs font-bold border border-zinc-700 uppercase tracking-wider"
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {/* 7. SETTINGS MODAL */}
      {gameState === 'SETTINGS' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center z-30">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center space-x-2 border-b border-zinc-800 pb-2 w-full max-w-md uppercase tracking-widest">
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>GAME SETTINGS</span>
          </h2>

          <div className="space-y-3 w-full max-w-md text-xs text-zinc-300 overflow-y-auto max-h-[240px] pr-2">
            {/* Audio Controls */}
            <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="uppercase tracking-wider">SOUND EFFECTS</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, sfxVolume: parseFloat(e.target.value) })
                }
                className="w-24 accent-white"
              />
            </div>

            <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="uppercase tracking-wider">MUSIC VOLUME</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, musicVolume: parseFloat(e.target.value) })
                }
                className="w-24 accent-white"
              />
            </div>

            {/* Difficulty */}
            <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="uppercase tracking-wider">DIFFICULTY</span>
              <select
                value={settings.difficulty}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, difficulty: e.target.value as any })
                }
                className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 rounded uppercase"
              >
                <option value="EASY">EASY</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HARDCORE">HARDCORE</option>
              </select>
            </div>

            {/* CRT Filter Toggle */}
            <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="uppercase tracking-wider">CRT SCANLINES</span>
              <button
                onClick={() => onUpdateSettings({ ...settings, crtFilter: !settings.crtFilter })}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  settings.crtFilter ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {settings.crtFilter ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Show Ghost Toggle */}
            <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="uppercase tracking-wider">SHOW HIGH SCORE GHOST</span>
              <button
                onClick={() => onUpdateSettings({ ...settings, showGhost: !settings.showGhost })}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  settings.showGhost ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {settings.showGhost ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Reset Progress */}
            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
              {resetConfirm ? (
                <div className="flex justify-between items-center text-zinc-300 text-[10px]">
                  <span>ERASE ALL SAVE DATA?</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        onResetProgress();
                        setResetConfirm(false);
                      }}
                      className="bg-white text-black px-2 py-1 rounded font-bold uppercase"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setResetConfirm(false)}
                      className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded uppercase"
                    >
                      NO
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="w-full text-zinc-400 hover:text-white text-center py-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  RESET PROGRESS DATA
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onCloseModal}
            className="mt-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2 rounded text-xs font-bold border border-zinc-700 uppercase tracking-wider"
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {/* 8. CONTROLS / HELP MODAL */}
      {gameState === 'HELP' && (
        <div className="pointer-events-auto absolute inset-0 bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center z-30">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center space-x-2 border-b border-zinc-800 pb-2 w-full max-w-md uppercase tracking-widest">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>HOW TO PLAY & CONTROLS</span>
          </h2>

          <div className="space-y-3 w-full max-w-md text-xs text-zinc-300">
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 space-y-1.5">
              <span className="text-zinc-200 font-bold block mb-1 uppercase tracking-wider">KEYBOARD & GAMEPAD</span>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500 uppercase">JUMP:</span>
                <span className="font-bold text-white">SPACE / ARROW UP / W / GAMEPAD A</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500 uppercase">DUCK:</span>
                <span className="font-bold text-white">ARROW DOWN / S / GAMEPAD DOWN</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500 uppercase">PAUSE:</span>
                <span className="font-bold text-white">P / ESC / START</span>
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 space-y-1">
              <span className="text-zinc-200 font-bold block mb-1 uppercase tracking-wider">TOUCH CONTROLS</span>
              <p className="text-[11px] text-zinc-400">
                Tap canvas or on-screen button to jump. Swipe down or hold duck button to crouch under pterodactyls!
              </p>
            </div>
          </div>

          <button
            onClick={onCloseModal}
            className="mt-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-2 rounded text-xs font-bold border border-zinc-700 uppercase tracking-wider"
          >
            GOT IT
          </button>
        </div>
      )}

      {/* 9. MOBILE TOUCH CONTROLS (Active during PLAYING) */}
      {gameState === 'PLAYING' && (
        <div className="pointer-events-auto sm:hidden flex justify-between items-center w-full px-2 pb-2 mt-auto">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDuck(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onDuck(false);
            }}
            className="bg-zinc-900 active:bg-zinc-800 border-2 border-zinc-700 p-4 rounded-full text-zinc-200 shadow-lg flex items-center justify-center"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onJump();
            }}
            className="bg-white active:bg-zinc-200 border-2 border-white p-5 rounded-full text-black shadow-lg flex items-center justify-center"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* 10. UNLOCK TOAST NOTIFICATION */}
      {toast && (
        <div className="pointer-events-none absolute bottom-6 right-6 bg-zinc-900 border-2 border-white text-white p-3 rounded shadow-xl flex items-center space-x-3 animate-bounce z-40">
          <div className="text-2xl">{toast.icon}</div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">UNLOCKED: {toast.title}</div>
            <div className="text-[10px] text-zinc-300">{toast.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
};
