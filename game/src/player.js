// player.js - Player ship logic and physics

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 16;
    this.speed = 0.45;
    this.friction = 0.92;
    this.maxSpeed = 6;
    this.angle = 0;
    this.invulnerableTimer = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.invulnerableTimer = 60; // 1 second invulnerability on spawn/hit
  }

  update(input, bounds) {
    let ax = 0;
    let ay = 0;

    // Keyboard movement (WASD or Arrow keys)
    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) ay -= this.speed;
    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) ay += this.speed;
    if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) ax -= this.speed;
    if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) ax += this.speed;

    this.vx += ax;
    this.vy += ay;

    this.vx *= this.friction;
    this.vy *= this.friction;

    // Clamp speed
    const currentSpeed = Math.hypot(this.vx, this.vy);
    if (currentSpeed > this.maxSpeed) {
      this.vx = (this.vx / currentSpeed) * this.maxSpeed;
      this.vy = (this.vy / currentSpeed) * this.maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Screen boundaries
    if (this.x < this.radius) { this.x = this.radius; this.vx *= -0.5; }
    if (this.x > bounds.width - this.radius) { this.x = bounds.width - this.radius; this.vx *= -0.5; }
    if (this.y < this.radius) { this.y = this.radius; this.vy *= -0.5; }
    if (this.y > bounds.height - this.radius) { this.y = bounds.height - this.radius; this.vy *= -0.5; }

    // Rotate towards mouse
    const mouse = input.getMouse();
    this.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Ship glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#40c0ff';

    // Engine exhaust flame
    if (Math.random() > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-14, -4);
      ctx.lineTo(-24 - Math.random() * 8, 0);
      ctx.lineTo(-14, 4);
      ctx.fillStyle = '#ff8822';
      ctx.fill();
    }

    // Ship hull
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-14, -12);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fillStyle = '#10e0ff';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.arc(2, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}
