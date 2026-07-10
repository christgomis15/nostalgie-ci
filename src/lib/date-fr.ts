const MOIS_FR: Record<string, number> = {
  janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
}

export function parseFrenchDate(str: string): number | null {
  if (!str) return null
  const s = str.trim().toLowerCase()
  let m = s.match(/^(\d{1,2})\s+([a-zéûôîè]+)\s+(\d{4})$/)
  if (m && MOIS_FR[m[2]] !== undefined) {
    return new Date(parseInt(m[3], 10), MOIS_FR[m[2]], parseInt(m[1], 10)).getTime()
  }
  m = s.match(/^([a-zéûôîè]+)\s+(\d{4})$/)
  if (m && MOIS_FR[m[1]] !== undefined) {
    return new Date(parseInt(m[2], 10), MOIS_FR[m[1]], 1).getTime()
  }
  return null
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = parseFrenchDate(a.date)
    const db = parseFrenchDate(b.date)
    if (da === null && db === null) return 0
    if (da === null) return 1
    if (db === null) return -1
    return db - da
  })
}
