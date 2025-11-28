import type { Unit as OrignalUnit } from 'aoe4data/src/types/items'

export type Unit = OrignalUnit & {
  locale: {
    [k in 'ja']?: {
      name: string
      description: string
      displayClasses: string[]
    }
  }
}

const checkDepricated = (units: OrignalUnit[]) => {
  const counts: Record<string, number> = {}
  for (const unit of units) {
    for (const civ of unit.civs) {
      // const key = `${unit.id}:${civ}:${unit.age}`
      const key = `${unit.id}:${civ}`
      counts[key] = (counts[key] || 0) + 1
    }
  }
  const duplicates = Object.entries(counts)
    .filter(([_, count]) => count > 1)
    .map(([key, count]) => `${key} * ${count}`)
  return duplicates
}

export const getData = async (): Promise<{ data: Unit[] }> => {
  const [{ data }, { data: data2 }] = await Promise.all([
    fetch('https://data.aoe4world.com/units/all.json').then(r => r.json()),
    import('../source/units-all.json').then(
      d => d.default,
      () => ({ data: [] }),
    ),
  ])
  const map2 = Object.fromEntries(data2.map(d => [d.id, d]))
  return {
    data: (data as OrignalUnit[]).map(d1 => ({
      ...d1,
      locale: { ...map2[d1.id]?.locale },
    })),
  }
}
