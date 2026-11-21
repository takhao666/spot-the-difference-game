// The game's rules and state, with no drawing and no browser in it: which of the seven
// differences are found, score, mistakes, hints, timer and screens. clickAt() takes a point in
// scene coordinates (the same spot in either panel) and reports what happened.
import { DIFFS, FIND_POINTS, HINT_COST, MAX_HINTS, TOTAL_DIFFS, WRONG_POINTS } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_WON = 'won';

export function createWorld() {
  const state = {
    screen: SCREEN_TITLE,
    found: DIFFS.map(() => false),
    foundCount: 0,
    score: 0,
    mistakes: 0,
    hintsLeft: MAX_HINTS,
    hintIndex: -1,
    hintTtl: 0,
    elapsed: 0,
    wrongMarks: [], // {x, y, ttl} red X flashes on wrong clicks
    crosshair: { x: 300, y: 270 },
  };

  function reset() {
    state.screen = SCREEN_PLAY;
    state.found = DIFFS.map(() => false);
    state.foundCount = 0;
    state.score = 0;
    state.mistakes = 0;
    state.hintsLeft = MAX_HINTS;
    state.hintIndex = -1;
    state.hintTtl = 0;
    state.elapsed = 0;
    state.wrongMarks = [];
    state.crosshair = { x: 300, y: 270 };
  }

  function toTitle() {
    reset();
    state.screen = SCREEN_TITLE;
  }

  /** Check a scene point. Returns 'found' | 'wrong' | 'already'. */
  function clickAt(x, y) {
    if (state.screen !== SCREEN_PLAY) return 'none';
    for (let i = 0; i < DIFFS.length; i += 1) {
      if (state.found[i]) continue;
      const d = DIFFS[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found[i] = true;
        state.foundCount += 1;
        // Faster finds pay more: up to +50 for a find inside the first minute.
        state.score += FIND_POINTS + Math.max(0, 50 - Math.floor(state.elapsed));
        state.hintIndex = -1;
        if (state.foundCount === TOTAL_DIFFS) state.screen = SCREEN_WON;
        return 'found';
      }
    }
    // Already-circled spots do not count as a mistake.
    for (let i = 0; i < DIFFS.length; i += 1) {
      if (!state.found[i]) continue;
      const d = DIFFS[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return 'already';
    }
    state.mistakes += 1;
    state.score = Math.max(0, state.score - WRONG_POINTS);
    state.wrongMarks.push({ x, y, ttl: 0.9 });
    return 'wrong';
  }

  /** Reveal one unfound difference with a pulsing ring. Costs points, limited uses. */
  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return false;
    const remaining = DIFFS.map((d, i) => (state.found[i] ? -1 : i)).filter((i) => i >= 0);
    if (remaining.length === 0) return false;
    state.hintIndex = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintTtl = 3;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    return true;
  }

  function step(dt) {
    if (state.screen === SCREEN_PLAY) state.elapsed += dt;
    if (state.hintTtl > 0) state.hintTtl = Math.max(0, state.hintTtl - dt);
    for (let i = state.wrongMarks.length - 1; i >= 0; i -= 1) {
      state.wrongMarks[i].ttl -= dt;
      if (state.wrongMarks[i].ttl <= 0) state.wrongMarks.splice(i, 1);
    }
  }

  return { state, reset, toTitle, clickAt, useHint, step };
}
