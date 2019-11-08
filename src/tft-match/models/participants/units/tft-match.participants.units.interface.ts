import { IBaseInterface } from '../../../../base/base.interface'
import { IStaticTftItemsModel } from '../../../../static-data/models/static-tft-items/static-tft-items.interface'

// Interfae definition
export interface ITftMatchUnitsModel extends IBaseInterface {
  tier: number
  items: Partial<IStaticTftItemsModel>[]
  character_id: string
  rarity: number
  name: string
}
