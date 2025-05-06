import { getData } from './data'
import { App } from './app'
import { formatData } from './format'
import { render } from 'preact'

const main = async () => {
  const exports: any = globalThis
  const json = await getData()
  const list = formatData(json.data)
  console.log(list)
  exports.json = json
  exports.list = list
  // let count = 0
  // let prev: [number, string] | null = null
  // const tmp = list
  //   .filter(d => 0 < d.dpsPerCost && Number.isFinite(d.dpsPerCost))
  //   .sort((q, w) => w.dpsPerCost - q.dpsPerCost)
  //   .map((d, i) => {
  //     const notCount =
  //       d.classes.some(c => 'ship' === c || 'warship' === c) ||
  //       d.id.startsWith('clocktower') ||
  //       d.id === 'handcannon-ashigaru'
  //     if (notCount)
  //       return {
  //         idx: `- (${i + 1})`,
  //         name: d.name,
  //         dps: d.dpsPerCost.toFixed(6),
  //       }
  //     ++count
  //     const dps = d.dpsPerCost.toFixed(6)
  //     if (prev?.[1] !== dps) prev = [count, dps]
  //     return {
  //       idx: `${prev[0]} (${i + 1})`,
  //       name: d.name,
  //       dps,
  //     }
  //   })
  // exports.texText = [
  //   '$$',
  //   '\\begin{array}{|l|l|l|} \\hline',
  //   ...tmp.map(
  //     d =>
  //       [d.idx, d.name, d.dps].map(t => '\\text{' + t + '}').join(' & ') +
  //       ' \\\\\\\\ \\hline',
  //   ),
  //   '\\end{array}',
  //   '$$',
  // ]
  //   .map(d => d + '\n')
  //   .join('')
  // console.log(exports.texText)
  const root = document.querySelector('main')
  if (root) render(<App data={json.data} />, root)
}

Promise.resolve()
  .then(main)
  .catch(x => console.error(x))
