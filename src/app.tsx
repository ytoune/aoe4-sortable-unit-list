import type { Unit } from './data'
import { formatData } from './format'
import { useAges, useCivs } from './hooks/civs'
import { useOrderKeys, sortWithOrderKeys } from './hooks/order-keys'
import { useKeys } from './hooks/keys'
import { renderItemProp } from './render-item-prop'
import { make } from './hooks/set'
import { useRef } from 'preact/hooks'
import { ToolForSet } from './tool-for-set'

export const App = ({ data }: { data: Unit[] }) => {
  const allClasses = (useRef<readonly string[]>().current ??= Array.from(
    new Set(data.flatMap(q => q.classes)),
  ))
  const useClasses = (useRef<ReturnType<typeof make>>().current ??= make(
    allClasses.map(k => [k, true]),
  ))
  const useHiddenClasses = (useRef<ReturnType<typeof make>>().current ??= make(
    allClasses.map(k => [k, 'ship' === k || 'warship' === k]),
  ))
  const useProducer = (useRef<ReturnType<typeof make>>().current ??= make(
    Array.from(new Set(data.flatMap(q => q.producedBy))).map(k => [k, true]),
  ))
  const [keys, setKeys] = useKeys()
  const [civset, setCivset] = useCivs()
  const [ages, setAges, agesShown] = useAges()
  const [orderKeys, setOrderKeys] = useOrderKeys()
  const [classes, setClasses, classesShown] = useClasses()
  const [hiddenClassesList, setHiddenClasses, hiddenClasses] =
    useHiddenClasses()
  const [producer, setProducer, producerSelected] = useProducer()
  const civsets = Object.fromEntries(civset)
  const list = formatData(
    data
      .filter(q => agesShown.includes(`${q.age}`))
      .filter(q => q.classes.some(c => classesShown.includes(c)))
      .filter(q => !q.classes.some(c => hiddenClasses.includes(c)))
      .filter(q => q.producedBy.some(p => producerSelected.includes(p)))
      .map(q => ({ ...q, civs: q.civs.filter(c => civsets[c]) }))
      .filter(q => q.civs.length),
  ).sort(sortWithOrderKeys(orderKeys))
  return (
    <div>
      <dl class="tools">
        <ToolForSet title="civilizations" set={civset} update={setCivset} />
        <ToolForSet title="age" set={ages} update={setAges} sub={false} />
        <ToolForSet title="keys" set={keys} update={setKeys} sub={false} />
        {!keys.some(([k, v]) => 'classes' === k && v) ? null : (
          <>
            <ToolForSet title="classes" set={classes} update={setClasses} />
            <ToolForSet
              title="exclude classes"
              set={hiddenClassesList}
              update={setHiddenClasses}
              sub={
                <label key="ship">
                  <input
                    type="checkbox"
                    checked={hiddenClassesList.every(([k, v]) =>
                      'ship' === k || 'warship' === k ? v : !v,
                    )}
                    onChange={() =>
                      setHiddenClasses({ keys: ['ship', 'warship'] })
                    }
                  />
                  ship or warship
                </label>
              }
            />
          </>
        )}
        {!keys.some(([k, v]) => 'producedBy' === k && v) ? null : (
          <ToolForSet title="producedBy" set={producer} update={setProducer} />
        )}
      </dl>
      <table>
        <thead>
          <tr>
            {keys
              .filter(([, v]) => v)
              .map(([k]) => (
                <th key={k} onClick={() => setOrderKeys(k)}>
                  {k}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {list.map(item => (
            <tr key={item.id}>
              {keys
                .filter(([, v]) => v)
                .map(([k]) => (
                  <td key={k}>{renderItemProp(item, k)}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
