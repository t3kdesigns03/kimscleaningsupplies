export function money(n: number): string {
  return "$" + (Math.round(n * 100) / 100).toFixed(2);
}

export function money2(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}
