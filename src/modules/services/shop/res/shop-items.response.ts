import { ShopItemObject } from "../../../entities/shopItem/shop-item.object";

export interface ShopItemsResponse {
  boxes: ShopItemObject[];
  chests: ShopItemObject[];
  coins: ShopItemObject[];
}
