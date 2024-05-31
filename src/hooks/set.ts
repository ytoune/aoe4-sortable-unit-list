import { useReducer } from 'preact/hooks'

export const make = <T extends string>(
  init: readonly (readonly [T, boolean])[],
) => {
  type State = readonly (readonly [T, boolean])[]
  type Mut =
    | Readonly<{ all: true; key?: undefined; keys?: undefined }>
    | Readonly<{ all?: false; key: T; val: boolean; keys?: undefined }>
    | Readonly<{ all?: false; key?: undefined; keys: readonly T[] }>

  const reduce = (st: State, mut: Mut): State => {
    if (mut.all)
      return st.every(([, v]) => v)
        ? st.map(([k]) => [k, false])
        : st.map(([k]) => [k, true])
    if (mut.keys) return st.map(([k]) => [k, mut.keys.includes(k)])
    return st.map(([k, v]) => (k === mut.key ? [k, mut.val] : [k, v]))
  }

  return () => useReducer(reduce, init)
}
