import { getData } from './data'
import { App } from './app'
import { formatData } from './format'
import { render } from 'preact'
import { makeTexText } from './tex-text'

const main = async () => {
  const exports: any = globalThis
  const json = await getData()
  const list = formatData(json.data)
  console.log(list)
  exports.json = json
  exports.list = list
  exports.texText = makeTexText(
    list
      // .filter(d => 0 < d.dpsPerCost && Number.isFinite(d.dpsPerCost))
      // .sort((q, w) => w.dpsPerCost - q.dpsPerCost)
      .filter(d => 0 < d.hpPerCost && Number.isFinite(d.hpPerCost))
      .sort((q, w) => w.hpPerCost - q.hpPerCost),
    d => d.hpPerCost.toFixed(6),
  )
  // console.log(exports.texText)
  const root = document.querySelector('main')
  if (root) render(<App data={json.data} />, root)
}

Promise.resolve()
  .then(main)
  .catch(x => console.error(x))
