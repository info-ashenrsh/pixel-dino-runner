# Pixel Dino Runner

An original retro monochrome pixel-art runner browser game inspired by classic endless runner mechanics with complete procedural sound synthesis, weather systems, day/night transitions, custom unlockable dino skins, powerups, achievements, and high score telemetry.

## Features

- **Retro Monochrome Pixel Art**: High precision pixelated graphics, custom dino animation frames (idle, run, duck, jump, dead), custom cacti, birds, rocks, robots, meteors, clouds, and parallax backgrounds.
- **Procedural Sound Engine**: Powered by Web Audio API — 100% synthesized sound effects (jump, land, duck, coin, powerup, explosion, thunder, wind, hit) and multi-track chiptune music (menu, gameplay, boss, victory).
- **Day & Night Cycle**: Automatic smooth transitions between Day, Sunset, Night (with twinkling stars and glowing crescent moon), and Sunrise.
- **7 Weather Conditions**: Sunny, Cloudy, Rain, Storm (with thunder flashes), Snow, Fog, and Wind drift.
- **5 Progressive Levels + Endless Mode**: Level 1 (Cacti) → Level 2 (Flying Pterodactyls) → Level 3 (Rolling Rocks) → Level 4 (Mecha Hazards) → Level 5 (Meteor Shower) → Endless scaling.
- **7 Unlockable Dino Skins**: Classic, Shadow Runner, Neon Cyber, Golden Rex, Robo-Dino 3000, Skelly Dino, Pixel Phantom.
- **7 Power-Ups & Coin System**: Shield, Magnet, Slow Motion, Double Score, Double Coins, Super Jump, Invincibility.
- **10 Achievements**: Instant unlock notifications and persistence via Local Storage.
- **Ghost Run Telemetry**: Semi-transparent ghost runner playing back your high score run trajectory in real time.
- **Controls & Accessibility**: Full Keyboard, Touch/Mobile controls, Gamepad polling, CRT Scanline toggle, FPS counter, Screenshot PNG export, and Share options.

## Controls

| Action | Keyboard | Touch / Mobile | Gamepad |
| ------ | -------- | -------------- | ------- |
| **Jump** | `Space` / `Arrow Up` / `W` | Tap screen / On-screen Up Button | `Button 0` / `D-Pad Up` |
| **Duck** | `Arrow Down` / `S` | Swipe down / Hold Duck Button | `D-Pad Down` |
| **Pause** | `P` / `ESC` | Pause UI Button | `Start` / `Select` |
| **Restart**| `R` (on Game Over) | Restart Button | `Button 0` |

## Technical Architecture

- **Engine**: Pure Vanilla TypeScript HTML5 Canvas 2D engine with 60 FPS `requestAnimationFrame` loop and Object Pooling.
- **Audio**: Web Audio API Procedural Oscillator & Noise Synthesizer.
- **UI Framework**: React 19 with Tailwind CSS v4.
- **Build Tool**: Vite.

## Running the Game

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.
