// Boot and the one loop: fixed 1/60 s steps, clicks and keys read every frame, the renderer
// paints what is there. Four screens: title, play, paused and won.
//
// ?shot=start|play|end stages that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { BEST_KEY, FIELD, PANEL, STEP } from './config.js';
import { createWorld, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;
const CROSSHAIR_SPEED = 420;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);

// Canvas pixels -> scene point, or null when the point is outside both pictures.
function toScene(px, py) {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
  const ox = (canvas.width - FIELD.width * scale) / 2;
  const oy = (canvas.height - FIELD.height * scale) / 2;
  const fx = (px - ox) / scale;
  const fy = (py - oy) / scale;
  const y = fy - PANEL.y;
  if (y < 0 || y > PANEL.h) return null;
  if (fx >= PANEL.leftX && fx <= PANEL.leftX + PANEL.w) return { x: fx - PANEL.leftX, y };
  if (fx >= PANEL.rightX && fx <= PANEL.rightX + PANEL.w) return { x: fx - PANEL.rightX, y };
  return null;
}

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, toScene);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.reset();
    screen = SCREEN_PLAY;
    accumulator = 0;
    announce('Playing. Find 7 differences.');
  }

  function endGame() {
    screen = SCREEN_WON;
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
    announce(`You found them all. Score ${world.state.score}. Best ${best}.`);
  }

  function handleActions() {
    const actions = input.takeActions();
    const click = input.takeClick();
    if (actions & ACTION_RESTART && screen !== SCREEN_TITLE) {
      startGame();
      return;
    }
    if (screen === SCREEN_TITLE) {
      if (actions & ACTION_CONFIRM || click) startGame();
      return;
    }
    if (screen === SCREEN_WON) {
      if (actions & ACTION_CONFIRM || click) startGame();
      return;
    }
    if (screen === SCREEN_PAUSED) {
      if (actions & (ACTION_PAUSE | ACTION_CONFIRM) || click) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
      return;
    }
    // SCREEN_PLAY
    if (actions & ACTION_PAUSE) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
      return;
    }
    if (actions & ACTION_HINT) {
      if (world.useHint()) announce('Hint: look inside the yellow ring.');
      return;
    }
    if (click) {
      const result = world.clickAt(click.x, click.y);
      if (result === 'found') {
        announce(`${world.state.foundCount} of 7 found. ${7 - world.state.foundCount} remain.`);
        if (world.state.screen === SCREEN_WON) endGame();
      } else if (result === 'wrong') announce('Not a difference. Try again.');
      return;
    }
    if (actions & ACTION_CONFIRM) {
      const c = world.state.crosshair;
      const result = world.clickAt(c.x, c.y);
      if (result === 'found') {
        announce(`${world.state.foundCount} of 7 found. ${7 - world.state.foundCount} remain.`);
        if (world.state.screen === SCREEN_WON) endGame();
      } else if (result === 'wrong') announce('Not a difference. Try again.');
    }
  }

  function step() {
    world.step(STEP);
    if (screen === SCREEN_PLAY) {
      const dir = input.direction();
      const c = world.state.crosshair;
      c.x = Math.min(PANEL.w - 1, Math.max(0, c.x + dir.x * CROSSHAIR_SPEED * STEP));
      c.y = Math.min(PANEL.h - 1, Math.max(0, c.y + dir.y * CROSSHAIR_SPEED * STEP));
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    if (screen === SCREEN_TITLE || screen === SCREEN_PLAY) {
      while (accumulator >= STEP && (screen === SCREEN_TITLE || screen === SCREEN_PLAY)) {
        step();
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, best);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
