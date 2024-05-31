import type { JSX } from 'preact/jsx-runtime'

const checked = (e: { readonly target: EventTarget | null }): boolean =>
  e.target && e.target instanceof HTMLInputElement ? e.target.checked : false

export const ToolForSet = <T extends string>({
  title,
  set,
  update,
  sub,
}: Readonly<{
  title: string
  set: readonly (readonly [T, boolean])[]
  update: (mut: { all: true } | { all?: false; key: T; val: boolean }) => void
  sub?: JSX.Element | false
}>) => (
  <>
    <dt>{title}</dt>
    <dd>
      {false === sub ? null : (
        <div class="line">
          <label key="all">
            <input
              type="checkbox"
              checked={set.every(([, v]) => v)}
              onChange={() => update({ all: true })}
            />
            all
          </label>
          {sub}
        </div>
      )}
      {set.map(([k, v]) => (
        <label key={k}>
          <input
            type="checkbox"
            checked={v}
            onChange={e => update({ key: k, val: checked(e) })}
          />
          {k}
        </label>
      ))}
    </dd>
  </>
)
