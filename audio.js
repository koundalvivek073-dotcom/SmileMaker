// audio.js - Web Audio API Synthesizer for Komal's Happiness Loop
// 100% self-contained, no external audio files required!

class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.isMusicPlaying = false;
        this.musicInterval = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted && this.isMusicPlaying) {
            this.stopVictoryMusic();
        }
        return this.muted;
    }

    // Adorable Kitten Meow using FM synthesis + formant filtering
    playMeow() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Frequency sweep simulating a cute "m-e-o-w"
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.28);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.45);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.Q.setValueAtTime(3, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
        filter.frequency.exponentialRampToValueAtTime(800, now + 0.45);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.28, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.46);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.48);
    }

    // Soft, soothing kitten purr vibration
    playPurr() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.7;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate warm soft rumble noise modulated by a 24Hz purr cycle
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.ctx.sampleRate;
            const modulation = (Math.sin(2 * Math.PI * 25 * t) + 1) * 0.5;
            const noise = (Math.random() * 2 - 1) * 0.4;
            data[i] = noise * modulation;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        noiseNode.start(now);
    }

    // Satisfying squishy marshmallow pop sound
    playSquish() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.18);

        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Magical compliment chime / sparkle arpeggio
    playChime() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.07;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.42);
        });
    }

    // Gentle giggle / chirp sound
    playGiggle() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const pitches = [600, 750, 700, 850, 800];
        pitches.forEach((p, idx) => {
            const now = this.ctx.currentTime + idx * 0.05;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(p, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        });
    }

    // Upbeat celebratory victory tune (bright, cheerful chiptune music box)
    playVictoryMusic() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        this.stopVictoryMusic();
        this.isMusicPlaying = true;

        // Upbeat victory melody notes [freq, duration in seconds]
        // Joyful melody: C5 - E5 - G5 - A5 - G5 - C6!
        const melody = [
            { f: 523.25, d: 0.16 }, // C5
            { f: 659.25, d: 0.16 }, // E5
            { f: 783.99, d: 0.16 }, // G5
            { f: 880.00, d: 0.22 }, // A5
            { f: 783.99, d: 0.18 }, // G5
            { f: 1046.50, d: 0.45 }, // C6
            { f: 0, d: 0.1 },      // rest
            { f: 880.00, d: 0.16 }, // A5
            { f: 1046.50, d: 0.16 }, // C6
            { f: 1174.66, d: 0.35 }, // D6
            { f: 1046.50, d: 0.45 }  // C6
        ];

        let cursor = 0;
        let timeOffset = this.ctx.currentTime + 0.05;

        melody.forEach(note => {
            if (note.f > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.f, timeOffset);

                gain.gain.setValueAtTime(0.001, timeOffset);
                gain.gain.linearRampToValueAtTime(0.22, timeOffset + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + note.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(timeOffset);
                osc.stop(timeOffset + note.d + 0.05);
            }
            timeOffset += note.d + 0.03;
        });
    }

    // Paper flutter and magical fairy chime when opening the letter
    playLetterOpen() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Soft paper swoosh / rustle
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.25;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);

        // 2. Enchanting harp sparkle chords (G4, C5, E5, G5, C6)
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const time = now + 0.12 + idx * 0.07;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.001, time);
            gain.gain.linearRampToValueAtTime(0.22, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.6);
        });
    }

    // Gentle swoosh sound during swipe
    playSwoosh() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }
}

window.soundCtrl = new SoundController();
