import type { Unit } from 'aoe4data/src/types/items'
export type { Unit } from 'aoe4data/src/types/items'

export const getData = (): Promise<{ data: Unit[] }> =>
  fetch('https://data.aoe4world.com/units/all.json').then(r => r.json())
