import { TftMatchEnum } from '../../../enums/tft-match.enum'

export function isWin (placement?: number) {
  if (!placement) {
    return false
  }
  return placement <= TftMatchEnum.PLACEMENT_WIN
}
