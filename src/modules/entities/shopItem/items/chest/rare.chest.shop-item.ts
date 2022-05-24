import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class RareChestShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "rare.chest";
  public static IMAGE_RESERVED_NAME = "rare.chest.shop-item";
  public static DISPLAY_NAME = "Rare chest";
  public static TYPE = "CHEST";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 2500;

  getReservedName(): string {
    return RareChestShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return RareChestShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return RareChestShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return RareChestShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: RareChestShopItem.PRICE_CURRENCY,
      amount: RareChestShopItem.PRICE_AMOUNT,
    };
  }
}
