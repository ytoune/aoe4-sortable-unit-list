import { make } from './set'

const init = [
  ['name', true],
  ['icon', true],
  ['speed', true],
  ['dps', true],
  ['armors', false],
  ['costs', false],
  ['dpsPerCost', false],
  ['classes', false],
  ['producedBy', false],
  ['civs', true],
] as const

export const useKeys = make(init)
