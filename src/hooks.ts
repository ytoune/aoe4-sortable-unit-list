import { useReducer } from 'preact/hooks'
import type { Formated } from './format'
import type { CivAbbr } from 'aoe4data/src/types/civs'

export const useKeys = (() => {
  const init = [
    ['name', true],
    ['icon', true],
    ['speed', true],
    ['dps', true],
    ['armors', true],
    ['costs', false],
    ['civs', true],
  ] as const
  type Key = (typeof init)[number][0]
  type Keys = readonly (readonly [Key, boolean])[]
  const reduce = (keys: Keys, mut: { key: Key; val: boolean }): Keys =>
    keys.map(([k, v]) =>
      k === mut.key && k !== 'name' ? [k, mut.val] : [k, v],
    )
  return () => useReducer(reduce, init)
})()
export const [useOrderKeys, sortWithOrderKeys] = (() => {
  const string = (q = '', w = '') =>
    q.localeCompare(w, void 0, { numeric: true })
  const number = (q = 0, w = 0) => q - w
  const comp = {
    name: string,
    icon: false,
    speed: number,
    dps: number,
    armors: string,
    costs: number,
    civs: string,
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
  return [
    () => useReducer(reduce, init),
    (keys: OrderKeys) => (q: Formated, w: Formated) => {
      for (const [k, i] of keys)
        if ('icon' !== k) {
          const c = comp[k](q?.[k] as any, w?.[k] as any)
          if (c) return i * c
        }
      return 0
    },
  ] as const
})()
export const useDataSetting = (() => {
  const init = [
    ['ship', false],
    ['age<=2', true],
  ] as const
  type DataSettingKey = (typeof init)[number][0]
  type DataSetting = readonly (readonly [DataSettingKey, boolean])[]
  const reduce = (
    st: DataSetting,
    mut: { key: DataSettingKey; val: boolean },
  ): DataSetting => st.map(([k, v]) => (k === mut.key ? [k, mut.val] : [k, v]))
  return () => useReducer(reduce, init)
})()
export const useCivs = (() => {
  const list = [
    {
      id: 'ab',
      name: 'Abbasid Dynasty',
      href: 'https://aoe4world.com/explorer/civs/abbasid',
    },
    {
      id: 'ay',
      name: 'Ayyubids',
      href: 'https://aoe4world.com/explorer/civs/ayyubids',
    },
    {
      id: 'by',
      name: 'Byzantines',
      href: 'https://aoe4world.com/explorer/civs/byzantines',
    },
    {
      id: 'ch',
      name: 'Chinese',
      href: 'https://aoe4world.com/explorer/civs/chinese',
    },
    {
      id: 'de',
      name: 'Delhi Sultanate',
      href: 'https://aoe4world.com/explorer/civs/delhi',
    },
    {
      id: 'en',
      name: 'English',
      href: 'https://aoe4world.com/explorer/civs/english',
    },
    {
      id: 'fr',
      name: 'French',
      href: 'https://aoe4world.com/explorer/civs/french',
    },
    {
      id: 'hr',
      name: 'Holy Roman Empire',
      href: 'https://aoe4world.com/explorer/civs/hre',
    },
    {
      id: 'ja',
      name: 'Japanese',
      href: 'https://aoe4world.com/explorer/civs/japanese',
    },
    {
      id: 'je',
      name: "Jeanne d'Arc",
      href: 'https://aoe4world.com/explorer/civs/jeannedarc',
    },
    {
      id: 'ma',
      name: 'Malians',
      href: 'https://aoe4world.com/explorer/civs/malians',
    },
    {
      id: 'mo',
      name: 'Mongols',
      href: 'https://aoe4world.com/explorer/civs/mongols',
    },
    {
      id: 'od',
      name: 'Order of the Dragon',
      href: 'https://aoe4world.com/explorer/civs/orderofthedragon',
    },
    {
      id: 'ot',
      name: 'Ottomans',
      href: 'https://aoe4world.com/explorer/civs/ottomans',
    },
    {
      id: 'ru',
      name: 'Rus',
      href: 'https://aoe4world.com/explorer/civs/rus',
    },
    {
      id: 'zx',
      name: "Zhu Xi's Legacy",
      href: 'https://aoe4world.com/explorer/civs/zhuxi',
    },
  ] as const
  type State = readonly (readonly [CivAbbr, boolean])[]
  const init = list.map(i => [i.id, true as boolean] as const)
  const reduce = (st: State, mut: { key: CivAbbr; val: boolean }): State =>
    st.map(([k, v]) => (k === mut.key ? [k, mut.val] : [k, v]))
  const map = Object.entries(list.map(o => [o.id, o]))
  return () => [map, ...useReducer(reduce, init)] as const
})()
