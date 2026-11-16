// main.js - Main game loop and state controller for Orbit Harvest

import { InputManager } from './input.js';
import { Player } from './player.js';
import { World } from './world.js';
import { Renderer } from './render.js';
import { hud } from './hud.js';
import { audio } from './audio.js';

const canvas = document.getElementById('gameCanvas');
const input = new InputManager(canvas);
const player = new Player(canvas.width / 2, canvas.height / 2);
const world = new World(canvas.width, canvas.height);
const renderer = new Renderer(canvas);

let gameState = 'START'; // 'START', 'PLAYING', 'GAMEOVER', 'WIN'

window.game = {
  get gameState() { return gameState; },
  set gameState(s) { gameState = s; },
  world,
  player
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'Enter') {
    if (gameState === 'START') {
      gameState = 'PLAYING';
      world.reset();
      player.reset(canvas.width / 2, canvas.height / 2);
    }
  }
  if (e.code === 'KeyR') {
    if (gameState === 'GAMEOVER' || gameState === 'WIN') {
      gameState = 'PLAYING';
      world.reset();
      player.reset(canvas.width / 2, canvas.height / 2);
    }
  }
});

canvas.addEventListener('click', () => {
  if (gameState === 'START') {
    gameState = 'PLAYING';
    world.reset();
    player.reset(canvas.width / 2, canvas.height / 2);
  }
});

function gameLoop() {
  // Update
  if (gameState === 'PLAYING') {
    player.update(input, { width: canvas.width, height: canvas.height });
    world.update(player);

    if (world.lives <= 0) {
      gameState = 'GAMEOVER';
      audio.playGameOver();
    } else if (world.score >= world.winTarget) {
      gameState = 'WIN';
      audio.playWin();
    }
  }

  // Render
  if (gameState === 'START') {
    renderer.drawStartScreen();
  } else if (gameState === 'PLAYING') {
    renderer.clear();
    world.draw(renderer.ctx);
    player.draw(renderer.ctx);
    hud.draw(renderer.ctx, world);
  } else if (gameState === 'GAMEOVER') {
    renderer.clear();
    world.draw(renderer.ctx);
    renderer.drawGameOverScreen(world);
  } else if (gameState === 'WIN') {
    renderer.clear();
    world.draw(renderer.ctx);
    renderer.drawWinScreen(world);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
