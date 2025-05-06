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
  const root = document.querySelector('main')
  if (root) render(<App data={json.data} />, root)
}

Promise.resolve()
  .then(main)
  .catch(x => console.error(x))
