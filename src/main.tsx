import { getData } from './data'
import { App } from './app'
import { formatData } from './format'
import { render } from 'preact'

const main = async () => {
  const json = await getData()
  const list = formatData(json.data)
  console.log(list)
  // @ts-expect-error: ignore
  globalThis.json = json
  // @ts-expect-error: ignore
  globalThis.list = list
  const root = document.querySelector('main')
  if (root) render(<App data={json.data} />, root)
}

Promise.resolve()
  .then(main)
  .catch(x => console.error(x))
