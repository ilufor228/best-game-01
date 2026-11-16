// input.js - Keyboard and mouse input handling

export class InputManager {
  constructor(canvas) {
    this.keys = {};
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };
    this.canvas = canvas;

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
    });

    canvas.addEventListener('mouseup', (e) => {
      this.mouse.down = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  getMouse() {
    return this.mouse;
  }
}
