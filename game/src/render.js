// render.js - Background and screen UI renderer (Start, Game Over, Win)

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    // Initialize background stars
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2
      });
    }
  }

  clear() {
    this.ctx.fillStyle = '#060612';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw & animate background stars
    this.ctx.fillStyle = '#ffffff';
    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > this.canvas.height) star.y = 0;
      this.ctx.globalAlpha = star.size / 2.5;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    this.ctx.globalAlpha = 1.0;
  }

  drawStartScreen() {
    this.clear();
    const ctx = this.ctx;
    ctx.save();

    // Title glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillStyle = '#00ffff';
    ctx.textAlign = 'center';
    ctx.fillText('ORBIT HARVEST', this.canvas.width / 2, 160);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffcc00';
    ctx.font = '20px "Courier New", monospace';
    ctx.fillStyle = '#ffcc00';
    ctx.fillText('THE BEST BROWSER ARCADE GAME', this.canvas.width / 2, 210);

    // Instructions Box
    ctx.fillStyle = 'rgba(20, 20, 50, 0.8)';
    ctx.strokeStyle = '#404090';
    ctx.lineWidth = 2;
    ctx.fillRect(150, 250, 500, 200);
    ctx.strokeRect(150, 250, 500, 200);

    ctx.font = '16px "Courier New", monospace';
    ctx.fillStyle = '#e0e0ff';
    ctx.textAlign = 'left';
    ctx.fillText('CONTROLS:', 180, 285);
    ctx.fillText('• Move: WASD or Arrow Keys', 180, 315);
    ctx.fillText('• Aim: Mouse Cursor', 180, 345);
    ctx.fillText('• Objective: Collect Star Shards (cyan)', 180, 375);
    ctx.fillText('• Danger: Dodge Asteroids (red/grey)', 180, 405);
    ctx.fillText('• Goal: Reach 500 Points to Win!', 180, 435);

    // Prompt to start
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = '#00ffaa';
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('PRESS SPACEBAR OR CLICK TO START', this.canvas.width / 2, 500);
    }

    ctx.restore();
  }

  drawGameOverScreen(world) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(10, 5, 10, 0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff2244';
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillStyle = '#ff3344';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.canvas.width / 2, 200);

    ctx.font = '22px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Final Score: ${world.score}`, this.canvas.width / 2, 270);
    ctx.fillText(`Wave Reached: ${world.wave}`, this.canvas.width / 2, 315);
    ctx.fillText(`Shards Collected: ${world.shardsCollected}`, this.canvas.width / 2, 360);

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#ffcc00';
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('PRESS R TO RESTART', this.canvas.width / 2, 450);
    }

    ctx.restore();
  }

  drawWinScreen(world) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 10, 20, 0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00ffaa';
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillStyle = '#00ffaa';
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', this.canvas.width / 2, 180);

    ctx.font = '22px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('You successfully harvested the orbit!', this.canvas.width / 2, 235);
    ctx.fillText(`Final Score: ${world.score}`, this.canvas.width / 2, 290);
    ctx.fillText(`Wave: ${world.wave}`, this.canvas.width / 2, 335);
    ctx.fillText(`Shards Collected: ${world.shardsCollected}`, this.canvas.width / 2, 380);

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#00ffff';
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('PRESS R TO PLAY AGAIN', this.canvas.width / 2, 470);
    }

    ctx.restore();
  }
}
