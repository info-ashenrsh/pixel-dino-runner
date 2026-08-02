/**
 * Web Audio API Chiptune & Sound Synthesizer for Pixel Dino Runner
 * Zero external audio files required, 100% procedurally synthesized retro audio.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private isMuted: boolean = false;
  
  // Music state
  private activeMusic: string | null = null;
  private musicTimer: number | null = null;
  private currentNoteIndex: number = 0;
  private isPlayingMusic: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(sfxVol: number, musicVol: number, muted: boolean) {
    this.sfxVolume = sfxVol;
    this.musicVolume = musicVol;
    this.isMuted = muted;
  }

  public playSound(name: string) {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const sfxVol = this.sfxVolume;

    switch (name) {
      case 'jump': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);

        gain.gain.setValueAtTime(0.3 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
        break;
      }
      case 'duck': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.1);

        gain.gain.setValueAtTime(0.2 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'land': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

        gain.gain.setValueAtTime(0.3 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.08);
        break;
      }
      case 'coin': {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(987.77, t); // B5
        osc1.frequency.setValueAtTime(1318.51, t + 0.08); // E6

        osc2.frequency.setValueAtTime(987.77, t);
        osc2.frequency.setValueAtTime(1318.51, t + 0.08);

        gain.gain.setValueAtTime(0.25 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.3);
        osc2.stop(t + 0.3);
        break;
      }
      case 'powerup': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const freqs = [220, 277, 330, 440, 554, 659];
        freqs.forEach((f, i) => {
          osc.frequency.setValueAtTime(f, t + i * 0.05);
        });

        gain.gain.setValueAtTime(0.35 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
        break;
      }
      case 'hit': {
        // Noise buffer for hit
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.15);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(t);
        break;
      }
      case 'gameover': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.setValueAtTime(260, t + 0.15);
        osc.frequency.setValueAtTime(220, t + 0.3);
        osc.frequency.setValueAtTime(150, t + 0.45);

        gain.gain.setValueAtTime(0.4 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.8);
        break;
      }
      case 'bird': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);

        gain.gain.setValueAtTime(0.2 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'thunder': {
        const bufferSize = this.ctx.sampleRate * 0.6;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(t);
        break;
      }
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);

        gain.gain.setValueAtTime(0.15 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.03);
        break;
      }
      case 'levelup': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => {
          osc.frequency.setValueAtTime(f, t + i * 0.08);
        });

        gain.gain.setValueAtTime(0.3 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
        break;
      }
      case 'explosion': {
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, t);
        filter.frequency.exponentialRampToValueAtTime(50, t + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5 * sfxVol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(t);
        break;
      }
    }
  }

  // Chiptune Music Sequencer
  public playMusic(track: 'menu' | 'gameplay' | 'boss' | 'victory') {
    if (this.activeMusic === track && this.isPlayingMusic) return;
    this.stopMusic();

    this.activeMusic = track;
    this.isPlayingMusic = true;
    this.currentNoteIndex = 0;

    const notesMap: Record<string, { notes: number[]; duration: number }> = {
      menu: {
        notes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23, 440.0, 587.33, 440.0, 349.23],
        duration: 0.22,
      },
      gameplay: {
        notes: [220, 220, 330, 220, 293.66, 261.63, 246.94, 220, 330, 330, 440, 392, 330, 293.66, 261.63, 220],
        duration: 0.16,
      },
      boss: {
        notes: [146.83, 146.83, 155.56, 146.83, 174.61, 146.83, 130.81, 146.83, 220, 207.65, 196, 174.61],
        duration: 0.12,
      },
      victory: {
        notes: [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5],
        duration: 0.25,
      },
    };

    const trackConfig = notesMap[track] || notesMap.gameplay;

    const playNext = () => {
      if (!this.isPlayingMusic || this.isMuted || this.musicVolume <= 0) {
        if (this.isPlayingMusic) {
          this.musicTimer = window.setTimeout(playNext, trackConfig.duration * 1000);
        }
        return;
      }

      this.initCtx();
      if (!this.ctx) return;

      const freq = trackConfig.notes[this.currentNoteIndex];
      this.currentNoteIndex = (this.currentNoteIndex + 1) % trackConfig.notes.length;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = track === 'boss' ? 'sawtooth' : track === 'menu' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, t);

      const mVol = this.musicVolume * 0.18;
      gain.gain.setValueAtTime(mVol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + trackConfig.duration * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + trackConfig.duration * 0.9);

      this.musicTimer = window.setTimeout(playNext, trackConfig.duration * 1000);
    };

    playNext();
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    this.activeMusic = null;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundEngine();
