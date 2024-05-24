import type { Unit } from './data'
import { formatData } from './format'
import {
  useKeys,
  useDataSetting,
  useCivs,
  useOrderKeys,
  sortWithOrderKeys,
} from './hooks'
import { renderItemProp } from './render-item-prop'

const checked = (e: { readonly target: EventTarget | null }): boolean =>
  e.target && e.target instanceof HTMLInputElement ? e.target.checked : false

export const App = ({ data }: { data: Unit[] }) => {
  const [keys, setKeys] = useKeys()
  const [setlist, setset] = useDataSetting()
  const [civmap, civset, setCivset] = useCivs()
  const [orderKeys, setOrderKeys] = useOrderKeys()
  const setting = Object.fromEntries(setlist)
  const civsets = Object.fromEntries(civset)
  const list = formatData(
    data
      .filter(q => setting['ship'] || !~q.classes.indexOf('ship'))
      .filter(q => !setting['age<=2'] || q.age <= 2)
      .map(q => ({ ...q, civs: q.civs.filter(c => civsets[c]) }))
      .filter(q => q.civs.length),
  ).sort(sortWithOrderKeys(orderKeys))
  return (
    <div>
      <p class="tools">
        {setlist.map(([k, v]) => (
          <label key={k}>
            <input
              type="checkbox"
              checked={v}
              onChange={e => setset({ key: k, val: checked(e) })}
            />
            {k}
          </label>
        ))}
      </p>
      <p class="tools">
        {civset.map(([k, v]) => (
          <label key={k}>
            <input
              type="checkbox"
              checked={v}
              onChange={e => setCivset({ key: k, val: checked(e) })}
            />
            {k}
          </label>
        ))}
      </p>
      <p class="tools">
        {keys.map(([k, v]) => (
          <label key={k}>
            <input
              type="checkbox"
              checked={v}
              onChange={e => setKeys({ key: k, val: checked(e) })}
            />
            {k}
          </label>
        ))}
      </p>
      <table>
        <tr>
          {keys
            .filter(([, v]) => v)
            .map(([k]) => (
              <th key={k} onClick={() => setOrderKeys(k)}>
                {k}
              </th>
            ))}
        </tr>
        {list.map(item => (
          <tr key={item.id}>
            {keys
              .filter(([, v]) => v)
              .map(([k]) => (
                <td key={k}>{renderItemProp(item, k)}</td>
              ))}
          </tr>
        ))}
      </table>
    </div>
  )
}
