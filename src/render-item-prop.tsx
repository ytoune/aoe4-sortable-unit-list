import type { Formated } from './format'

const renderNumber = (num: number, fix = 2): string => {
  if (Number.isNaN(num)) return 'NaN'
  if (!Number.isFinite(num) || Number.isSafeInteger(num)) return `${num}`
  return num.toFixed(fix)
}

const comps = {
  name: ({ item }) => (
    <a
      href={`https://aoe4world.com/explorer/units/${item.id}`}
      rel="nofollow noopener noreferrer"
      target="_blank"
    >
      {item.name}
    </a>
  ),
  jaName: ({ item }) => (
    <a
      href={`https://aoe4world.com/explorer/units/${item.id}`}
      rel="nofollow noopener noreferrer"
      target="_blank"
    >
      {item.jaName}
    </a>
  ),
  icon: ({ item }) =>
    Array.from(new Set(item.z_.map(i => i.icon)))
      .filter((src): src is string => !!src)
      .map(src => (
        <img
          key={src}
          src={src}
          title={src.match(/\/([^/]*)(\.[^.]+)$/u)?.[1]}
        />
      )),
  costs: ({ item }) => <span>{item.costText}</span>,
  dps: ({ item }) => <span>{item.dps.toFixed(2)}</span>,
  dpsPerCost: ({ item }) => <span>{renderNumber(item.dpsPerCost, 6)}</span>,
  // hp: ({ item }) => <span>{item.hp}</span>,
  hpPerCost: ({ item }) => <span>{renderNumber(item.hpPerCost, 2)}</span>,
  classes: ({ item }) => <span>{item.classes.join()}</span>,
  producedBy: ({ item }) => <span>{item.producedBy.join()}</span>,
  civs: ({ item }) => <span>{item.civs.join()}</span>,
  def: ({ item, p }) => <span>{item[p]}</span>,
} satisfies {
  [k in string]: (p: { item: Formated; p: keyof Formated }) => unknown
}
export const renderItemProp = (
  item: Formated,
  p: keyof Formated | keyof typeof comps,
) => {
  const Comp = (comps as any)[p] || comps.def
  return <Comp item={item} p={p} />
}
