// hud.js - Heads-up display (score, lives, wave, timer, combo)

export const hud = {
  draw(ctx, world) {
    ctx.save();
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';

    // Top HUD bar background
    ctx.fillStyle = 'rgba(10, 10, 30, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, 40);
    ctx.strokeStyle = '#303060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(ctx.canvas.width, 40);
    ctx.stroke();

    // Score & Target
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`SCORE: ${world.score} / ${world.winTarget}`, 20, 25);

    // Lives
    ctx.fillStyle = '#ff4444';
    let livesStr = 'LIVES: ';
    for (let i = 0; i < world.lives; i++) livesStr += '♥ ';
    ctx.fillText(livesStr, 240, 25);

    // Wave
    ctx.fillStyle = '#ffcc00';
    ctx.fillText(`WAVE: ${world.wave}`, 430, 25);

    // Timer
    const mins = Math.floor(world.timer / 60);
    const secs = Math.floor(world.timer % 60);
    const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    ctx.fillStyle = '#a0a0ff';
    ctx.fillText(`TIME: ${timeStr}`, 560, 25);

    // Combo
    if (world.combo > 1) {
      ctx.fillStyle = '#ff00ff';
      ctx.fillText(`COMBO x${world.combo}`, 680, 25);
    }

    ctx.restore();
  }
};
