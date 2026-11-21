# Spot the Difference — Sunny Park Picnic

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Play the game](https://img.shields.io/badge/Play-static%20HTML-blue.svg)](game/index.html)
[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty%20%2450-orange.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451):
two hand-drawn pictures of a sunny park picnic side by side, with **7 tiny differences**
hiding between them. Pure static files, no network request, desktop browser, mouse + keyboard.

## Play

```sh
node serve.ts
# open http://localhost:8080
```

Or open `game/index.html` from any static server. Click a difference in either picture
and a red circle marks it on both; the **Remaining** counter in the top bar counts down
from 7. Find all 7 to win.

- **Mouse:** click a difference in either picture.
- **Keyboard:** arrow keys / WASD move the crosshair, Enter or Space checks it.
- **H:** spend a hint (3 per game, yellow pulsing ring). **P:** pause. **R:** restart.
- Wrong clicks cost 25 points; fast finds earn a time bonus. Best score is saved locally.

## The 7 differences

1. The sun's smiling face — 2. the third cloud — 3. the fifth apple on the tree —
4. the cat's red bow — 5. the green bottle on the blanket — 6. the red tulip (yellow on
the right) — 7. the little bird in the sky.

## Screenshots

`screenshots/` holds 3 real renders of the game: title, mid-game (3 found, 4 remain),
and the win screen (all 7 circled). The first by name is the cover.

## Tech

- `game/index.html` + ES modules under `game/src/` — no library, no build step, no
  network request. All art is drawn in code on `<canvas>` (original, no borrowed assets).
- `main.ts` (Node 22, stdlib only) copies `game/` and `screenshots/` to `/output` and
  writes `/output/dossier.json` with the vendored `vendor/makefun-game.ts` library.
- `serve.ts` serves `game/` locally for development.

## License

MIT — see [LICENSE](LICENSE).
