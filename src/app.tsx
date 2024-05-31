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
  const [noShipClasses, useClasses] = (useRef<
    [string[], ReturnType<typeof make>]
  >().current ??= (() => {
    const classes = Array.from(new Set(data.flatMap(q => q.classes)))
    const noShipClasses = classes.filter(k => 'ship' !== k && 'warship' !== k)
    return [
      noShipClasses,
      make(classes.map(k => [k, noShipClasses.includes(k)])),
    ]
  })())
  const useProducer = (useRef<ReturnType<typeof make>>().current ??= make(
    Array.from(new Set(data.flatMap(q => q.producedBy))).map(k => [k, true]),
  ))
  const [keys, setKeys] = useKeys()
  const [civset, setCivset] = useCivs()
  const [ages, setAges] = useAges()
  const [orderKeys, setOrderKeys] = useOrderKeys()
  const [classes, setClasses] = useClasses()
  const [producer, setProducer] = useProducer()
  const civsets = Object.fromEntries(civset)
  const agesShown = ages.filter(([, v]) => v).map(p => Number(p[0]))
  const classesShown = classes.filter(([, v]) => v).map(p => p[0])
  const producerSelected = producer.filter(([, v]) => v).map(p => p[0])
  const list = formatData(
    data
      .filter(q => agesShown.includes(q.age))
      .filter(q => q.classes.some(c => classesShown.includes(c)))
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
          <ToolForSet
            title="classes"
            set={classes}
            update={setClasses}
            sub={
              <label key="no-ship">
                <input
                  type="checkbox"
                  checked={classes.every(([k, v]) =>
                    'ship' !== k && 'warship' !== k ? v : !v,
                  )}
                  onChange={() => setClasses({ keys: noShipClasses })}
                />
                not ship
              </label>
            }
          />
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
