// The screenshot scenes behind ?shot=start|play|end: real game states, staged directly —
// title over the fresh pictures, mid-game with 3 of 7 found (4 still to find), and the win
// screen with all 7 circled. The same seed always gives the same frame.
import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WON } from './world.js';

export function stageShot(name, world) {
  const state = world.state;
  if (name === 'play') {
    world.reset();
    state.screen = SCREEN_PLAY;
    for (const i of [0, 2, 4]) {
      state.found[i] = true;
      state.foundCount += 1;
    }
    state.score = 342;
    state.elapsed = 87;
    state.hintsLeft = 2;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'end') {
    world.reset();
    state.screen = SCREEN_WON;
    for (let i = 0; i < state.found.length; i += 1) {
      state.found[i] = true;
      state.foundCount += 1;
    }
    state.score = 748;
    state.elapsed = 194;
    state.mistakes = 2;
    state.hintsLeft = 1;
    return { screen: SCREEN_WON, best: 748 };
  }
  world.toTitle();
  return { screen: SCREEN_TITLE, best: 520 };
}
