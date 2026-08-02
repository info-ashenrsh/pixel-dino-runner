import { HitBox } from '../types';

export function checkAABBCollision(a: HitBox, b: HitBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Pixel-padded collision helper for fairness
export function checkPaddedCollision(
  a: HitBox,
  b: HitBox,
  paddingA: number = 4,
  paddingB: number = 4
): boolean {
  const boxA: HitBox = {
    x: a.x + paddingA,
    y: a.y + paddingA,
    width: Math.max(1, a.width - paddingA * 2),
    height: Math.max(1, a.height - paddingA * 2),
  };

  const boxB: HitBox = {
    x: b.x + paddingB,
    y: b.y + paddingB,
    width: Math.max(1, b.width - paddingB * 2),
    height: Math.max(1, b.height - paddingB * 2),
  };

  return checkAABBCollision(boxA, boxB);
}

// Distance between two points
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate magnetic pull towards target
export function calculateMagneticPull(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  speed: number = 12
): { vx: number; vy: number } {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return { vx: 0, vy: 0 };

  return {
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
  };
}
