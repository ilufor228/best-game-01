// world.js - Game world objects, asteroids, star shards, wave management, and collisions

import { audio } from './audio.js';

export class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.timer = 0; // seconds elapsed in game
    this.waveTimer = 0; // timer for wave progression
    this.shards = [];
    this.asteroids = [];
    this.particles = [];
    this.shardsCollected = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.spawnTimer = 0;
    this.asteroidSpawnTimer = 0;
    this.winTarget = 500;
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.timer = 0;
    this.waveTimer = 0;
    this.shards = [];
    this.asteroids = [];
    this.particles = [];
    this.shardsCollected = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.spawnTimer = 0;
    this.asteroidSpawnTimer = 0;
  }

  update(player) {
    this.timer += 1 / 60;
    this.waveTimer += 1 / 60;

    // Wave progression every 20 seconds, waves get faster and harder
    if (this.waveTimer > 20) {
      this.wave++;
      this.waveTimer = 0;
    }

    // Combo decay
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.combo = 1;
      }
    }

    // Spawn star shards (falling)
    this.spawnTimer++;
    const shardInterval = Math.max(15, 60 - this.wave * 5);
    if (this.spawnTimer >= shardInterval) {
      this.spawnTimer = 0;
      this.shards.push({
        x: Math.random() * (this.width - 40) + 20,
        y: -20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 2 + Math.random() * 2 + this.wave * 0.4,
        radius: 10,
        rotation: Math.random() * Math.PI
      });
    }

    // Spawn asteroids (falling/drifting with danger)
    this.asteroidSpawnTimer++;
    const asteroidInterval = Math.max(25, 90 - this.wave * 8);
    if (this.asteroidSpawnTimer >= asteroidInterval) {
      this.asteroidSpawnTimer = 0;
      const radius = 18 + Math.random() * 22;
      this.asteroids.push({
        x: Math.random() * this.width,
        y: -40,
        vx: (Math.random() - 0.5) * 3,
        vy: 1.5 + Math.random() * 2.5 + this.wave * 0.6,
        radius: radius,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05
      });
    }

    // Update shards
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const s = this.shards[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += 0.05;

      // Check collision with player
      const dist = Math.hypot(player.x - s.x, player.y - s.y);
      if (dist < player.radius + s.radius) {
        // Collected!
        audio.playCollect();
        this.shardsCollected++;
        this.combo++;
        this.comboTimer = 120; // 2 seconds to keep combo
        const points = 10 * Math.min(this.combo, 5);
        this.score += points;

        // Sparkle particles
        for (let p = 0; p < 8; p++) {
          this.particles.push({
            x: s.x,
            y: s.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 30,
            color: '#a0ffff'
          });
        }

        this.shards.splice(i, 1);
        continue;
      }

      // Remove if off screen
      if (s.y > this.height + 30) {
        this.shards.splice(i, 1);
      }
    }

    // Update asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const a = this.asteroids[i];
      a.x += a.vx;
      a.y += a.vy;
      a.rot += a.vRot;

      // Check collision with player
      if (player.invulnerableTimer === 0) {
        const dist = Math.hypot(player.x - a.x, player.y - a.y);
        if (dist < player.radius + a.radius - 4) {
          // Hit by asteroid!
          audio.playHit();
          this.lives--;
          player.invulnerableTimer = 90; // 1.5 seconds invulnerability
          this.combo = 1;

          // Explosion particles
          for (let p = 0; p < 15; p++) {
            this.particles.push({
              x: player.x,
              y: player.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 40,
              color: '#ff4444'
            });
          }

          this.asteroids.splice(i, 1);
          continue;
        }
      }

      // Remove if off screen
      if (a.y > this.height + 60 || a.x < -60 || a.x > this.width + 60) {
        this.asteroids.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw star shards
    for (const s of this.shards) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';

      // Star shape
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -s.radius);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, -s.radius / 2);
        ctx.rotate(Math.PI / 4);
      }
      ctx.closePath();
      ctx.fillStyle = '#00ffff';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // Draw asteroids
    for (const a of this.asteroids) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3344';

      ctx.beginPath();
      // Jagged asteroid shape
      const pts = 8;
      for (let i = 0; i < pts; i++) {
        const angle = (i / pts) * Math.PI * 2;
        const r = a.radius * (0.8 + ((i % 2) * 0.4));
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#3a3a50';
      ctx.fill();
      ctx.strokeStyle = '#ff6666';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    // Draw particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.life / 40;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
