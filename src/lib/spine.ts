const PALETTE = ['#6e56cf', '#2f8f83', '#c2410c', '#1d4ed8', '#be185d', '#15803d', '#854d0e', '#0f766e'];

/** Spine thickness scales with page count, clamped to a sensible range. */
export function spineWidth(pages: number): number {
  return Math.min(56, Math.max(26, Math.round(18 + pages / 12)));
}

/** Deterministic height variation so a shelf doesn't look like a flat row. */
export function spineHeight(title: string): number {
  let sum = 0;
  for (const ch of title) sum += ch.charCodeAt(0);
  return 160 + (sum % 50);
}

/** Stable colour for a title, used when a book has no colour of its own. */
export function paletteFor(title: string): string {
  let sum = 0;
  for (const ch of title) sum += ch.charCodeAt(0);
  return PALETTE[sum % PALETTE.length];
}

/** Picks dark or light text for readability on a #rrggbb background. */
export function inkFor(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.4 ? '#14141a' : '#fafafa';
}
