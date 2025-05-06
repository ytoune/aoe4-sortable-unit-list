import { useReducer } from 'preact/hooks'
import type { Formated } from '../format'

const string = (q = '', w = '') => q.localeCompare(w, void 0, { numeric: true })
const number = (q = 0, w = 0) => q - w
const strings = (q: readonly string[] = [], w: readonly string[] = []) =>
  `${q}`.localeCompare(`${w}`, void 0, { numeric: true })

const comp = {
  name: string,
  icon: false,
  speed: number,
  dps: number,
  armors: string,
  costs: number,
  dpsPerCost: number,
  hp: number,
  hpPerCost: number,
  classes: strings,
  producedBy: strings,
  civs: strings,
} as const

type OrderKey = keyof typeof comp
type OrderKeys = readonly (readonly [OrderKey, 1 | -1])[]

const init = [
  ['speed', -1],
  ['name', 1],
] satisfies OrderKeys

const reduce = (keys: OrderKeys, mut: OrderKey): OrderKeys => {
  if (comp[mut]) {
    const i = keys.find(k => mut === k[0])?.[1] ?? 1
    return [[mut, -i as 1 | -1], ...keys.filter(k => mut !== k[0])]
  }
  return keys
}

export const useOrderKeys = () => useReducer(reduce, init)
export const sortWithOrderKeys =
  (keys: OrderKeys) =>
  (q: Formated, w: Formated): number => {
    for (const [k, i] of keys)
      if ('icon' !== k) {
        const c = comp[k](q?.[k] as any, w?.[k] as any)
        if (c) return i * c
      }
    return 0
  }
