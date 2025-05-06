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
  // const tmp = list
  //   .filter(d => 0 < d.dpsPerCost && Number.isFinite(d.dpsPerCost))
  //   .sort((q, w) => w.dpsPerCost - q.dpsPerCost)
  // exports.texText = [
  //   '$$',
  //   '\\begin{array}{|l|l|} \\hline',
  //   ...tmp.map(
  //     d =>
  //       [d.displayNames[0] ?? d.name, d.dpsPerCost.toFixed(6)]
  //         .map(t => '\\text{' + t + '}')
  //         .join(' & ') + ' \\\\\\\\ \\hline',
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
