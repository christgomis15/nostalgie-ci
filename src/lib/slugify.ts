export function slugify(title: string): string {
  const stripped = title
    .normalize('NFD')
    .split('')
    .filter(ch => ch.charCodeAt(0) < 0x0300 || ch.charCodeAt(0) > 0x036f)
    .join('')
  return stripped
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
