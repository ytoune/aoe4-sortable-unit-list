import { make } from './set'

const init = [
  ['name', false],
  ['jaName', true],
  ['icon', true],
  ['speed', true],
  ['dps', true],
  ['armors', false],
  ['costs', false],
  ['dpsPerCost', false],
  ['hp', false],
  ['hpPerCost', false],
  ['classes', false],
  ['jaClasses', false],
  ['producedBy', false],
  ['civs', true],
] as const

export const useKeys = make(init)
