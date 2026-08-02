import { Particle } from '../types';

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number = 300;

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life += dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'line') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
        ctx.stroke();
      } else {
        // Standard retro pixel square
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    ctx.restore();
  }

  // Dust particles when running or landing
  public createDust(x: number, y: number, count: number = 3, color: string = '#94a3b8') {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      this.particles.push({
        x: x + (Math.random() * 10 - 5),
        y: y + (Math.random() * 4 - 2),
        vx: -(Math.random() * 2 + 1),
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.3 + 0.2,
      });
    }
  }

  // Sparkles when collecting coins or powerups
  public createSparkles(x: number, y: number, color: string = '#facc15', count: number = 10) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.5 + 0.3,
        shape: 'pixel',
      });
    }
  }

  // Explosions on hit or meteor impact
  public createExplosion(x: number, y: number, color: string = '#ef4444', count: number = 20) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 3,
        color: Math.random() > 0.5 ? color : '#f59e0b',
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.6 + 0.3,
      });
    }
  }

  // Rain particle generator
  public createRain(canvasWidth: number, count: number = 5) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      this.particles.push({
        x: Math.random() * (canvasWidth + 100) - 50,
        y: -10,
        vx: -2 - Math.random() * 2,
        vy: 12 + Math.random() * 6,
        size: 1.5,
        color: '#38bdf8',
        alpha: 0.7,
        life: 0,
        maxLife: 1.2,
        shape: 'line',
      });
    }
  }

  // Snow particle generator
  public createSnow(canvasWidth: number, count: number = 3) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      this.particles.push({
        x: Math.random() * (canvasWidth + 100) - 50,
        y: -10,
        vx: Math.sin(Math.random() * Math.PI * 2) * 1.5 - 1,
        vy: 1.5 + Math.random() * 1.5,
        size: Math.random() * 3 + 2,
        color: '#f8fafc',
        alpha: 0.8,
        life: 0,
        maxLife: 3.0,
        shape: 'circle',
      });
    }
  }

  public clear() {
    this.particles = [];
  }
}
