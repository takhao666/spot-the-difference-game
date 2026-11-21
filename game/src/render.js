// Drawing only: the park-picnic scene painted twice (left original, right with 7 changes),
// the HUD with the remaining counter, found markers, crosshair, hints and the panels.
import { DIFFS, FIELD, PALETTE, PANEL, TOTAL_DIFFS } from './config.js';
import { SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON } from './world.js';

export { SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON };

function ellipse(g, x, y, rx, ry) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
}

function circle(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

/** One cloud: three overlapping puffs. */
function cloud(g, x, y) {
  g.fillStyle = PALETTE.cloud;
  ellipse(g, x, y, 34, 18);
  ellipse(g, x - 22, y + 6, 22, 13);
  ellipse(g, x + 24, y + 6, 24, 14);
}

function flower(g, x, y, color) {
  g.strokeStyle = '#2f7d3a';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x, y + 26);
  g.stroke();
  g.fillStyle = color;
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(g, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 6);
  }
  g.fillStyle = '#ffd93b';
  circle(g, x, y, 5);
}

/**
 * The picnic scene. `variant` 0 is the original (left picture), 1 is the changed one (right):
 * sun loses its face, the middle cloud, one apple, the cat's bow, the bottle and the bird vanish,
 * and the red tulip turns yellow.
 */
function drawScene(g, ox, oy, variant) {
  g.save();
  g.translate(ox, oy);
  g.beginPath();
  g.rect(0, 0, PANEL.w, PANEL.h);
  g.clip();

  // Sky.
  const sky = g.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, PALETTE.skyTop);
  sky.addColorStop(1, PALETTE.skyBottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, PANEL.w, 340);

  // Sun with rays (and a smile, left picture only).
  g.fillStyle = PALETTE.sunRay;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    g.save();
    g.translate(95, 75);
    g.rotate(a);
    g.fillRect(44, -4, 18, 8);
    g.restore();
  }
  g.fillStyle = PALETTE.sun;
  circle(g, 95, 75, 38);
  if (variant === 0) {
    g.fillStyle = '#3a3a3a';
    circle(g, 82, 68, 4);
    circle(g, 108, 68, 4);
    g.strokeStyle = '#3a3a3a';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(95, 78, 14, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  }

  // Clouds (three left, two right) and the bird (left only).
  cloud(g, 180, 60);
  if (variant === 0) cloud(g, 300, 65);
  cloud(g, 480, 55);
  if (variant === 0) {
    g.strokeStyle = PALETTE.bird;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(386, 120);
    g.quadraticCurveTo(393, 110, 400, 120);
    g.quadraticCurveTo(407, 110, 414, 120);
    g.stroke();
  }

  // Hills, then grass.
  g.fillStyle = PALETTE.hillFar;
  g.beginPath();
  g.moveTo(0, 340);
  g.quadraticCurveTo(180, 260, 380, 335);
  g.quadraticCurveTo(500, 375, 600, 320);
  g.lineTo(600, 340);
  g.lineTo(0, 340);
  g.fill();
  g.fillStyle = PALETTE.hillNear;
  g.beginPath();
  g.moveTo(0, 340);
  g.quadraticCurveTo(240, 300, 460, 340);
  g.lineTo(600, 340);
  g.lineTo(600, 360);
  g.lineTo(0, 360);
  g.fill();
  g.fillStyle = PALETTE.grass;
  g.fillRect(0, 340, PANEL.w, 200);
  g.fillStyle = PALETTE.grassDark;
  for (const [x, y] of [[40, 400], [250, 385], [560, 420], [90, 520], [560, 520]]) {
    g.beginPath();
    g.moveTo(x - 8, y);
    g.lineTo(x, y - 12);
    g.lineTo(x + 8, y);
    g.fill();
  }

  // Pond, bottom left.
  g.fillStyle = PALETTE.pond;
  ellipse(g, 110, 480, 95, 32);
  g.fillStyle = PALETTE.pondDark;
  ellipse(g, 110, 486, 70, 20);
  g.strokeStyle = 'rgba(255,255,255,0.7)';
  g.lineWidth = 3;
  g.beginPath();
  g.arc(90, 476, 22, Math.PI * 1.1, Math.PI * 1.6);
  g.stroke();

  // Tree, right: trunk, canopy, five apples (four on the right).
  g.fillStyle = PALETTE.trunk;
  g.fillRect(488, 210, 26, 170);
  g.fillStyle = PALETTE.leafDark;
  circle(g, 440, 205, 55);
  circle(g, 560, 205, 55);
  g.fillStyle = PALETTE.leaf;
  circle(g, 500, 165, 85);
  circle(g, 445, 195, 48);
  circle(g, 555, 195, 48);
  g.fillStyle = PALETTE.apple;
  for (const [x, y] of [[455, 160], [500, 140], [530, 180], [470, 200]]) circle(g, x, y, 9);
  if (variant === 0) circle(g, 505, 205, 9);

  // Picnic blanket, checkered.
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      g.fillStyle = (r + c) % 2 === 0 ? PALETTE.blanketA : PALETTE.blanketB;
      g.fillRect(280 + c * 40, 450 + r * 30, 40, 30);
    }
  }
  // Basket with a handle.
  g.fillStyle = PALETTE.basket;
  g.beginPath();
  g.moveTo(305, 470);
  g.lineTo(365, 470);
  g.lineTo(358, 505);
  g.lineTo(312, 505);
  g.closePath();
  g.fill();
  g.strokeStyle = PALETTE.basketDark;
  g.lineWidth = 5;
  g.beginPath();
  g.arc(335, 470, 22, Math.PI, 0);
  g.stroke();
  g.fillStyle = PALETTE.basketDark;
  g.fillRect(305, 482, 60, 5);
  // Green bottle on the blanket (left picture only).
  if (variant === 0) {
    g.fillStyle = PALETTE.bottle;
    g.fillRect(402, 428, 16, 34);
    g.fillRect(406, 418, 8, 12);
    g.fillStyle = '#7ddba4';
    g.fillRect(402, 438, 5, 18);
  }

  // Sitting cat with a red bow (left picture only).
  g.fillStyle = PALETTE.cat;
  ellipse(g, 210, 462, 30, 26);
  circle(g, 210, 425, 22);
  g.beginPath();
  g.moveTo(192, 412);
  g.lineTo(196, 392);
  g.lineTo(206, 408);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(214, 408);
  g.lineTo(224, 392);
  g.lineTo(228, 412);
  g.closePath();
  g.fill();
  g.strokeStyle = PALETTE.catDark;
  g.lineWidth = 4;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(238, 470);
  g.quadraticCurveTo(258, 462, 252, 442);
  g.stroke();
  g.fillStyle = '#3a3a3a';
  circle(g, 202, 422, 2.5);
  circle(g, 218, 422, 2.5);
  if (variant === 0) {
    g.fillStyle = PALETTE.bow;
    g.beginPath();
    g.moveTo(210, 468);
    g.lineTo(194, 458);
    g.lineTo(194, 478);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(210, 468);
    g.lineTo(226, 458);
    g.lineTo(226, 478);
    g.closePath();
    g.fill();
    circle(g, 210, 468, 4);
  }

  // Flower row along the bottom (the tulip at x=480 is red left, yellow right).
  flower(g, 60, 505, PALETTE.flowerPink);
  flower(g, 120, 505, PALETTE.flowerPurple);
  flower(g, 480, 505, variant === 0 ? PALETTE.flowerRed : PALETTE.flowerYellow);
  flower(g, 540, 505, PALETTE.flowerPink);

  g.restore();
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const fonts = new Map();

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    view.scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    view.x = (canvas.width - FIELD.width * view.scale) / 2;
    view.y = (canvas.height - FIELD.height * view.scale) / 2;
  }

  function text(value, x, y, size, color, align, weight = 'bold') {
    const key = `${weight} ${size}`;
    if (!fonts.has(key)) fonts.set(key, `${weight} ${size}px system-ui, sans-serif`);
    context.font = fonts.get(key);
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = 'alphabetic';
    context.fillText(value, x, y);
  }

  function drawMarker(x, y, r) {
    context.strokeStyle = PALETTE.marker;
    context.lineWidth = 5;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(255,255,255,0.85)';
    context.beginPath();
    context.arc(x, y, r + 4, 0, Math.PI * 2);
    context.stroke();
  }

  function drawHud(state) {
    context.fillStyle = '#171b26';
    context.fillRect(0, 0, FIELD.width, 88);
    text('SPOT THE DIFFERENCE', 24, 56, 34, PALETTE.text, 'left');
    const remaining = TOTAL_DIFFS - state.foundCount;
    context.fillStyle = remaining === 0 ? PALETTE.ok : PALETTE.accent;
    const pillW = 300;
    context.beginPath();
    context.roundRect((FIELD.width - pillW) / 2, 18, pillW, 52, 26);
    context.fill();
    text(`Remaining: ${remaining} / ${TOTAL_DIFFS}`, FIELD.width / 2, 55, 28, '#171b26', 'center');
    text(`Time ${fmtTime(state.elapsed)}`, FIELD.width - 330, 42, 24, PALETTE.text, 'left');
    text(`Score ${state.score}`, FIELD.width - 330, 70, 24, PALETTE.accent, 'left');
    text(`Hints ${state.hintsLeft}  (H)`, FIELD.width - 150, 56, 24, PALETTE.muted, 'left');

    context.fillStyle = '#171b26';
    context.fillRect(0, 648, FIELD.width, 72);
    text('Click a difference in either picture  •  Arrow keys move the crosshair, Enter checks it  •  H hint  •  P pause  •  R restart',
      FIELD.width / 2, 692, 20, PALETTE.muted, 'center', 'normal');
  }

  function drawPanels(state) {
    const panels = [
      { x: PANEL.leftX, label: 'A — original', variant: 0 },
      { x: PANEL.rightX, label: 'B — changed', variant: 1 },
    ];
    for (const p of panels) {
      drawScene(context, p.x, PANEL.y, p.variant);
      context.strokeStyle = '#ffffff';
      context.lineWidth = 3;
      context.strokeRect(p.x, PANEL.y, PANEL.w, PANEL.h);
      context.fillStyle = 'rgba(18, 22, 34, 0.85)';
      context.fillRect(p.x + 8, PANEL.y + 8, 150, 30);
      text(p.label, p.x + 16, PANEL.y + 29, 17, PALETTE.text, 'left');
    }
    // Found markers on both pictures, wrong-click X flashes, hint ring.
    for (let i = 0; i < DIFFS.length; i += 1) {
      if (!state.found[i]) continue;
      for (const p of panels) drawMarker(p.x + DIFFS[i].x, PANEL.y + DIFFS[i].y, DIFFS[i].r + 8);
    }
    for (const m of state.wrongMarks) {
      for (const p of panels) {
        context.strokeStyle = PALETTE.marker;
        context.lineWidth = 5;
        context.globalAlpha = Math.min(1, m.ttl);
        const cx = p.x + m.x;
        const cy = PANEL.y + m.y;
        context.beginPath();
        context.moveTo(cx - 12, cy - 12);
        context.lineTo(cx + 12, cy + 12);
        context.moveTo(cx + 12, cy - 12);
        context.lineTo(cx - 12, cy + 12);
        context.stroke();
        context.globalAlpha = 1;
      }
    }
    if (state.hintIndex >= 0 && state.hintTtl > 0) {
      const d = DIFFS[state.hintIndex];
      const pulse = 1 + 0.12 * Math.sin(state.hintTtl * 10);
      for (const p of panels) {
        context.strokeStyle = PALETTE.accent;
        context.lineWidth = 4;
        context.setLineDash([10, 8]);
        context.beginPath();
        context.arc(p.x + d.x, PANEL.y + d.y, (d.r + 12) * pulse, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
      }
    }
    // Keyboard crosshair, same spot in both pictures.
    if (state.screen === SCREEN_PLAY) {
      for (const p of panels) {
        const cx = p.x + state.crosshair.x;
        const cy = PANEL.y + state.crosshair.y;
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2.5;
        context.beginPath();
        context.moveTo(cx - 14, cy);
        context.lineTo(cx + 14, cy);
        context.moveTo(cx, cy - 14);
        context.lineTo(cx, cy + 14);
        context.stroke();
        context.strokeStyle = 'rgba(0,0,0,0.6)';
        context.lineWidth = 1;
        context.beginPath();
        context.arc(cx, cy, 18, 0, Math.PI * 2);
        context.stroke();
      }
    }
  }

  function drawOverlay(title, lines, prompt, accent) {
    const w = 680;
    const h = 150 + lines.length * 34 + 84;
    const x = (FIELD.width - w) / 2;
    const y = (FIELD.height - h) / 2;
    context.fillStyle = PALETTE.panel;
    context.beginPath();
    context.roundRect(x, y, w, h, 18);
    context.fill();
    context.strokeStyle = accent || PALETTE.panelBorder;
    context.lineWidth = 3;
    context.stroke();
    text(title, FIELD.width / 2, y + 66, 44, PALETTE.text, 'center');
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], FIELD.width / 2, y + 116 + i * 34, 21, PALETTE.muted, 'center', 'normal');
    }
    text(prompt, FIELD.width / 2, y + h - 32, 23, PALETTE.accent, 'center');
  }

  function draw(state, screen, best) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawHud(state);
    drawPanels(state);
    if (screen === SCREEN_TITLE) {
      drawOverlay('SPOT THE DIFFERENCE', [
        'Two pictures of a sunny park picnic — seven tiny differences hide between them.',
        'Click a difference in either picture and a red circle marks it on both.',
        'Arrow keys move the crosshair, Enter checks it. H spends a hint, P pauses.',
        `Best score so far: ${best}`,
      ], 'Click or press Space to start');
    } else if (screen === SCREEN_PAUSED) {
      drawOverlay('Paused', ['The picnic will wait for you.'], 'Press P or click to resume');
    } else if (screen === SCREEN_WON) {
      const acc = state.foundCount + state.mistakes === 0 ? 100
        : Math.round((state.foundCount / (state.foundCount + state.mistakes)) * 100);
      drawOverlay('You found them all!', [
        `Time ${fmtTime(state.elapsed)}   •   Score ${state.score}   •   Best ${Math.max(best, state.score)}`,
        `Accuracy ${acc}%  (${state.mistakes} wrong click${state.mistakes === 1 ? '' : 's'})`,
        'Sunny face, third cloud, fifth apple, red bow, green bottle, red tulip, little bird.',
      ], 'Press Space or click to play again', PALETTE.ok);
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw };
}
