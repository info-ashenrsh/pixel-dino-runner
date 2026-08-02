import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../engine/gameLoop';

interface PixelCanvasProps {
  gameEngineRef: React.MutableRefObject<GameEngine | null>;
  crtFilter: boolean;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({ gameEngineRef, crtFilter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new GameEngine(canvas);
    gameEngineRef.current = engine;
    engine.start();

    // Keyboard Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        engine.handleJump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        engine.handleDuck(true);
      } else if (e.code === 'KeyP') {
        engine.pauseGame();
      } else if (e.code === 'KeyR' && engine.state === 'GAMEOVER') {
        engine.startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        engine.handleDuck(false);
      }
    };

    // Touch Event Listeners for Mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        engine.handleJump();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY > 30) {
          engine.handleDuck(true);
        }
      }
    };

    const handleTouchEnd = () => {
      engine.handleDuck(false);
    };

    // Gamepad API Polling
    let gamepadInterval: number | null = null;
    let lastJumpPressed = false;
    let lastPausePressed = false;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (!gp) continue;
        // Button 0 (A / Cross) or Button 12 (D-pad Up)
        const jumpPressed = gp.buttons[0]?.pressed || gp.buttons[12]?.pressed;
        const duckPressed = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
        const pausePressed = gp.buttons[9]?.pressed || gp.buttons[8]?.pressed;

        if (jumpPressed && !lastJumpPressed) {
          engine.handleJump();
        }
        lastJumpPressed = !!jumpPressed;

        if (duckPressed) {
          engine.handleDuck(true);
        } else {
          engine.handleDuck(false);
        }

        if (pausePressed && !lastPausePressed) {
          engine.pauseGame();
        }
        lastPausePressed = !!pausePressed;
      }
    };

    gamepadInterval = window.setInterval(pollGamepad, 50);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      engine.stop();
      if (gamepadInterval) clearInterval(gamepadInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameEngineRef]);

  return (
    <div className="relative w-full h-full aspect-[2/1] max-w-4xl bg-zinc-950 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full block image-pixelated select-none touch-none cursor-pointer"
      />

      {/* Retro CRT Scanline Overlay */}
      {crtFilter && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-70 z-10" />
      )}
    </div>
  );
};
