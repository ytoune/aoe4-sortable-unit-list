import { CivAbbr } from 'aoe4data/src/types/civs'
import type { Unit } from './data'

export type Formated = ReturnType<typeof formatData>[number]
export type Civ = `${CivAbbr}${number}`

const weaponTypeRank = (
  t: 'ranged' | 'siege' | 'melee' | 'fire' | 'charge',
): 1 | 2 | 3 | 4 | 5 => {
  switch (t) {
    case 'ranged':
      return 1
    case 'siege':
      return 4
    case 'melee':
      return 1
    case 'fire':
      return 5
    case 'charge':
      return 3
    default:
      return 2
  }
}

const filterUnit = (d: Unit) =>
  !('cavalry-archer' === d.baseId && 'ot' === d.civs.join(''))

export const formatData = (data: Unit[]) =>
  Object.entries(
    // @ts-expect-error: ignore
    Object.groupBy(data.filter(filterUnit), q => q.baseId) as {
      [k in Unit['baseId']]: Unit[]
    },
  )
    .map(([id, _]: [Unit['baseId'], Unit[]]) => {
      const displayNames: string[] = Array.from(new Set(_.flatMap(q => q.name)))
      const speeds: number[] = Array.from(
        new Set(_.flatMap(q => q.movement?.speed ?? [])),
      ).sort()
      const weapons = _.flatMap(d => d.weapons)
        .filter(w => w?.type)
        .map((weapon, idx) => ({ idx, weapon }) as const)
        .sort(
          (q, w) =>
            weaponTypeRank(q.weapon.type) - weaponTypeRank(w.weapon.type) ||
            q.idx - w.idx,
        )
        .map(d => d.weapon)
      const dps: number[] = weapons.map(w => (w ? w.damage / w.speed : 0))
      const armors: string[] = Array.from(
        new Set(
          _.flatMap(q => q.armor.map(a => (a ? a.type[0]! + a.value : '0'))),
        ),
      )
      const hitpoints: number[] = Array.from(new Set(_.map(q => q.hitpoints)))
      const hashCost = (c: Unit['costs']) => {
        const h = (k: keyof Unit['costs']) =>
          c[k] ? k[0]! + Math.floor(c[k]!) : ''
        return [
          h('food'),
          h('wood'),
          h('gold'),
          h('stone'),
          h('oliveoil'),
          `(${c.popcap ?? '_'}/${c.time ?? '_'})`,
          h('vizier'),
        ].join('')
      }
      const sumCost = (c: Unit['costs']) => {
        const h = (k: keyof Unit['costs']) => c[k] || 0
        return h('food') + h('wood') + h('gold') + h('stone') + h('oliveoil')
      }
      const costs = Array.from(new Set(_.flatMap(q => hashCost(q.costs))))
      const costNum = Array.from(new Set(_.flatMap(q => sumCost(q.costs))))
      type PartialCost = Partial<{
        food: number
        wood: number
        gold: number
        stone: number
        oliveoil: number
        time?: number
        popcap?: number
      }>
      const makeCost = (c: PartialCost, div: number) => {
        const food = (c.food ?? 0) / div
        const wood = (c.wood ?? 0) / div
        const gold = (c.gold ?? 0) / div
        const stone = (c.stone ?? 0) / div
        const oliveoil = (c.oliveoil ?? 0) / div
        const time = c.time ?? 0
        const popcap = (c.popcap ?? 1) / div
        const total = food + wood + gold + stone + oliveoil
        return {
          food,
          wood,
          gold,
          stone,
          oliveoil,
          time,
          popcap,
          total,
        } as const
      }
      // const pushCost = (c: PartialCost) => {
      //   const cost = makeCost(c, 1)
      //   costs.push(hashCost(cost))
      //   costNum.push(sumCost(cost))
      // }
      const replaceCost = (c: PartialCost, div = 1) => {
        const cost = makeCost(c, div)
        costs.splice(0, costs.length, hashCost(cost))
        costNum.splice(0, costNum.length, sumCost(cost))
      }
      if ('shinobi' === id && costNum.join(':') === '0')
        replaceCost({ food: 50, gold: 50 })
      if ('wynguard-footman' === id) {
        const item = data.find(d => 'wynguard-footmen' === d.id)
        if (item?.costs) replaceCost(item.costs, item.costs.popcap)
      }
      if ('wynguard-ranger' === id) {
        const item = data.find(d => 'wynguard-rangers' === d.id)
        if (item?.costs) replaceCost(item.costs, item.costs.popcap)
      }
      if ('bedouin-swordsman' === id) replaceCost({ gold: 425 / 8 })
      if ('bedouin-skirmisher' === id) replaceCost({ gold: 425 / 8 })
      if ('militia' === id) replaceCost({ food: 55 }, 2)
      const classes = Array.from(new Set(_.flatMap(q => q.classes)))
      const producedBy = Array.from(new Set(_.flatMap(q => q.producedBy)))
      const civs = Array.from(
        new Set(_.flatMap(q => q.civs.map((c): Civ => `${c}${q.age}`))),
      )
      const firstDps = dps[0] ?? -1
      const minCost = costNum.sort((q, w) => q - w).filter(n => 0 < n)[0] ?? 0
      const dpsPerCost = 0 < firstDps ? firstDps / minCost : 0
      const maxHitpoints = hitpoints.sort((q, w) => w - q)[0] ?? 0
      const hpPerCost = 0 < maxHitpoints ? maxHitpoints / minCost : 0
      return {
        id,
        displayNames,
        name: displayNames[0] ?? id,
        speed: speeds[0] ?? -1,
        dps: firstDps,
        armors: armors.join(),
        costText: costs.join(),
        costs: minCost,
        dpsPerCost,
        hp: maxHitpoints,
        hpPerCost,
        civs,
        classes,
        producedBy,
        z_: _,
        z_speed2: speeds.join(),
        z_dps: dps.join(),
      }
    })
    .sort((q, w) => w?.speed - q?.speed)
