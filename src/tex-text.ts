import type { Formated } from './format'

export const makeTexText = (
  list: readonly Formated[],
  makeValue: (item: Formated) => string,
): string => {
  let count = 0
  let prev: [number, string] | null = null
  const tmp = list
    // .filter(d => 0 < d.dpsPerCost && Number.isFinite(d.dpsPerCost))
    // .sort((q, w) => w.dpsPerCost - q.dpsPerCost)
    .map((d, i) => {
      const notCount =
        d.classes.some(c => 'ship' === c || 'warship' === c) ||
        d.id.startsWith('clocktower') ||
        d.id === 'handcannon-ashigaru'
      const value = makeValue(d)
      if (notCount)
        return {
          idx: `- (${i + 1})`,
          name: d.name,
          value,
        }
      ++count
      if (prev?.[1] !== value) prev = [count, value]
      return {
        idx: `${prev[0]} (${i + 1})`,
        name: d.name,
        value,
      }
    })
  return [
    '$$',
    '\\begin{array}{|l|l|l|} \\hline',
    ...tmp.map(
      d =>
        [d.idx, d.name, d.value].map(t => '\\text{' + t + '}').join(' & ') +
        ' \\\\\\\\ \\hline',
    ),
    '\\end{array}',
    '$$',
  ]
    .map(d => d + '\n')
    .join('')
}
