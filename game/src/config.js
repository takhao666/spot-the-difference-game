// Spot the Difference — shared constants: two 600x540 panels side by side in a 1280x720 field.
export const FIELD = { width: 1280, height: 720 };
export const PANEL = { w: 600, h: 540, leftX: 20, rightX: 660, y: 96 };
export const STEP = 1 / 60;
export const BEST_KEY = 'spot-the-difference-best';
export const TOTAL_DIFFS = 7;
export const MAX_HINTS = 3;
export const FIND_POINTS = 100;
export const WRONG_POINTS = 25;
export const HINT_COST = 50;

// The seven differences, in scene coordinates (same for both panels).
// name: what the judge / player sees; x/y/r: the hit spot.
export const DIFFS = [
  { x: 95, y: 75, r: 32, name: 'Sunny face' },
  { x: 300, y: 65, r: 34, name: 'Third cloud' },
  { x: 505, y: 205, r: 26, name: 'Fifth apple' },
  { x: 210, y: 468, r: 28, name: "Cat's red bow" },
  { x: 410, y: 440, r: 28, name: 'Green bottle' },
  { x: 480, y: 505, r: 26, name: 'Red tulip' },
  { x: 400, y: 120, r: 26, name: 'Little bird' },
];

export const PALETTE = {
  backdrop: '#20242e',
  skyTop: '#8ec9ee',
  skyBottom: '#d8f0ff',
  sun: '#ffd93b',
  sunRay: '#ffcf3f',
  cloud: '#ffffff',
  hillFar: '#9ed68a',
  hillNear: '#79c25f',
  grass: '#8fd07a',
  grassDark: '#7cc169',
  trunk: '#8a5a33',
  leaf: '#3f9e4d',
  leafDark: '#2f7d3a',
  apple: '#e33e3e',
  pond: '#5fb7e8',
  pondDark: '#3f9fd4',
  blanketA: '#e85d5d',
  blanketB: '#fff6ea',
  basket: '#b07a3e',
  basketDark: '#8a5f2c',
  bottle: '#2fae5f',
  cat: '#f2a541',
  catDark: '#d98a2b',
  bow: '#e33e3e',
  flowerRed: '#e33e3e',
  flowerYellow: '#ffd93b',
  flowerPink: '#ff8fb2',
  flowerPurple: '#9b7ede',
  bird: '#3a3a3a',
  text: '#ffffff',
  muted: '#c9d4e6',
  accent: '#ffd93b',
  panel: '#121622',
  panelBorder: '#ffd93b',
  marker: '#ff3b30',
  ok: '#37d67a',
};
