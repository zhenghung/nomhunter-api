import { Price } from "./shop-item-price";

export interface ShopItemObject {
  reservedName: string;
  displayName: string;
  type: string;
  imageName: string;
  imageUrl: string;
  price: Price;
}
