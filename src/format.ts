import type { Unit } from './data'

export type Formated = ReturnType<typeof formatData>[number]
export const formatData = (data: Unit[]) =>
  Object.entries(
    // @ts-expect-error: ignore
    Object.groupBy(data, q => q.baseId) as {
      [k in Unit['baseId']]: Unit[]
    },
  )
    .map(([i, _]: [Unit['baseId'], Unit[]]) => {
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
      return {
        id: _[0]!.baseId,
        name: _[0]!.baseId,
        civs: Array.from(
          new Set(_.flatMap(q => q.civs.map(c => c + q.age))),
        ).join(),
        speed: speeds[0] ?? -1,
        dps: dps[0] ?? -1,
        armors: armors.join(),
        costText: costs.join(),
        costs: costNum.sort((q, w) => q - w)[0] ?? 0,
        z_: _,
        z_speed2: speeds.join(),
        z_dps: dps.join(),
      }
    })
    .sort((q, w) => w?.speed - q?.speed)
