import { SERVICE_UNAVAILABLE, NOT_FOUND } from 'http-status-codes'

export function exitJob (e) {
  return e.status === SERVICE_UNAVAILABLE
}

export function showError (e) {
  return e.status === NOT_FOUND
}
