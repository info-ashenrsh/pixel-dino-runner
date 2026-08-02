import { WeatherType } from '../types';
import { ParticleSystem } from './particles';
import { sound } from '../utils/audio';

export class WeatherSystem {
  public currentWeather: WeatherType = 'SUNNY';
  private weatherTimer: number = 0;
  private weatherDuration: number = 25; // Change weather every 25s
  private lightningFlash: boolean = false;
  private lightningTimer: number = 0;

  public update(dt: number, particleSystem: ParticleSystem, width: number) {
    this.weatherTimer += dt;
    if (this.weatherTimer >= this.weatherDuration) {
      this.weatherTimer = 0;
      this.cycleWeather();
    }

    // Weather particle effects
    if (this.currentWeather === 'RAIN' || this.currentWeather === 'STORM') {
      particleSystem.createRain(width, this.currentWeather === 'STORM' ? 12 : 5);
    } else if (this.currentWeather === 'SNOW') {
      particleSystem.createSnow(width, 4);
    }

    // Lightning flashes in STORM mode
    if (this.currentWeather === 'STORM') {
      this.lightningTimer += dt;
      if (this.lightningTimer > Math.random() * 8 + 4) {
        this.lightningTimer = 0;
        this.lightningFlash = true;
        sound.playSound('thunder');
        setTimeout(() => {
          this.lightningFlash = false;
        }, 120);
      }
    }
  }

  public cycleWeather() {
    const list: WeatherType[] = ['SUNNY', 'CLOUDY', 'RAIN', 'STORM', 'SNOW', 'FOG', 'WIND'];
    const nextIndex = (list.indexOf(this.currentWeather) + 1) % list.length;
    this.currentWeather = list[nextIndex];
  }

  public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();

    // Lightning Flash
    if (this.lightningFlash) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(0, 0, width, height);
    }

    // Fog overlay
    if (this.currentWeather === 'FOG') {
      const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      grad.addColorStop(0, 'rgba(241, 245, 249, 0)');
      grad.addColorStop(1, 'rgba(241, 245, 249, 0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, height * 0.4, width, height * 0.6);
    }

    // Wind overlay lines
    if (this.currentWeather === 'WIND') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const offset = (Date.now() * 0.5 + i * 150) % width;
        ctx.beginPath();
        ctx.moveTo(offset, 40 + i * 40);
        ctx.lineTo(offset + 60, 40 + i * 40);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  public setWeather(weather: WeatherType) {
    this.currentWeather = weather;
    this.weatherTimer = 0;
  }
}
