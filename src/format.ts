import { CivAbbr } from 'aoe4data/src/types/civs'
import type { Unit } from './data'

export type Formated = ReturnType<typeof formatData>[number]
export type Civ = `${CivAbbr}${number}`

export const formatData = (data: Unit[]) =>
  Object.entries(
    // @ts-expect-error: ignore
    Object.groupBy(data, q => q.baseId) as {
      [k in Unit['baseId']]: Unit[]
    },
  )
    .map(([id, _]: [Unit['baseId'], Unit[]]) => {
      const displayNames: string[] = Array.from(new Set(_.flatMap(q => q.name)))
      const speeds: number[] = Array.from(
        new Set(_.flatMap(q => q.movement?.speed ?? [])),
      ).sort()
      const dps: number[] = _.flatMap(q =>
        q.weapons.map(w => (w ? w.damage / w.speed : 0)),
      )
      const armors: string[] = Array.from(
        new Set(
          _.flatMap(q => q.armor.map(a => (a ? a.type[0]! + a.value : '0'))),
        ),
      )
      const hashCost = (c: Unit['costs']) => {
        const h = (k: keyof Unit['costs']) => (c[k] ? k[0]! + c[k]! : '')
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
      const classes = Array.from(new Set(_.flatMap(q => q.classes)))
      const producedBy = Array.from(new Set(_.flatMap(q => q.producedBy)))
      const civs = Array.from(
        new Set(_.flatMap(q => q.civs.map((c): Civ => `${c}${q.age}`))),
      )
      const firstDps = dps[0] ?? -1
      const minCost = costNum.sort((q, w) => q - w).filter(n => 0 < n)[0] ?? 0
      const dpsPerCost = 0 < firstDps ? firstDps / minCost : 0
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
        civs,
        classes,
        producedBy,
        z_: _,
        z_speed2: speeds.join(),
        z_dps: dps.join(),
      }
    })
    .sort((q, w) => w?.speed - q?.speed)
