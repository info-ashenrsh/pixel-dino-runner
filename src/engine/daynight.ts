import { TimeOfDay } from '../types';

export class DayNightCycle {
  public timeOfDay: TimeOfDay = 'DAY';
  public progress: number = 0; // 0 to 1 cycle progress
  private cycleDuration: number = 60; // 60 seconds full cycle
  public skyColor: string = '#f8fafc';
  public groundColor: string = '#334155';
  public moonPhase: number = 0; // 0 to 4
  public stars: { x: number; y: number; size: number; alpha: number }[] = [];

  constructor() {
    // Generate random stars for night sky
    for (let i = 0; i < 40; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 160,
        size: Math.random() * 2 + 1,
        alpha: Math.random(),
      });
    }
  }

  public update(dt: number) {
    this.progress = (this.progress + dt / this.cycleDuration) % 1;

    // Cycle phases: 0.0-0.4 = DAY, 0.4-0.5 = SUNSET, 0.5-0.9 = NIGHT, 0.9-1.0 = SUNRISE
    if (this.progress < 0.4) {
      this.timeOfDay = 'DAY';
      this.skyColor = '#f1f5f9';
      this.groundColor = '#334155';
    } else if (this.progress < 0.5) {
      this.timeOfDay = 'SUNSET';
      this.skyColor = '#fed7aa';
      this.groundColor = '#431407';
    } else if (this.progress < 0.9) {
      this.timeOfDay = 'NIGHT';
      this.skyColor = '#0f172a';
      this.groundColor = '#94a3b8';
    } else {
      this.timeOfDay = 'SUNRISE';
      this.skyColor = '#fef08a';
      this.groundColor = '#713f12';
    }

    // Twinkle stars
    for (const star of this.stars) {
      star.alpha += (Math.random() - 0.5) * 0.1;
      if (star.alpha < 0.2) star.alpha = 0.2;
      if (star.alpha > 1) star.alpha = 1;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    // Sky Fill
    ctx.fillStyle = this.skyColor;
    ctx.fillRect(0, 0, width, height);

    // Stars at Night
    if (this.timeOfDay === 'NIGHT' || this.timeOfDay === 'SUNSET') {
      const starAlphaMultiplier = this.timeOfDay === 'NIGHT' ? 1 : 0.4;
      for (const star of this.stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * starAlphaMultiplier})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    }

    // Celestial Bodies (Sun / Moon)
    if (this.timeOfDay === 'DAY' || this.timeOfDay === 'SUNSET' || this.timeOfDay === 'SUNRISE') {
      // Sun
      const sunY = this.timeOfDay === 'SUNSET' ? height * 0.4 : height * 0.15;
      ctx.fillStyle = this.timeOfDay === 'SUNSET' ? '#f97316' : '#facc15';
      ctx.beginPath();
      ctx.arc(width - 120, sunY, 24, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.timeOfDay === 'NIGHT') {
      // Moon
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(width - 120, height * 0.18, 20, 0, Math.PI * 2);
      ctx.fill();

      // Crescent shadow cut
      ctx.fillStyle = this.skyColor;
      ctx.beginPath();
      ctx.arc(width - 112, height * 0.15, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public reset() {
    this.progress = 0;
    this.timeOfDay = 'DAY';
  }
}
