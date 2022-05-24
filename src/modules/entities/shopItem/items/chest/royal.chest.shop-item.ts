import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class RoyalChestShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "royal.chest";
  public static IMAGE_RESERVED_NAME = "royal.chest.shop-item";
  public static DISPLAY_NAME = "Royal chest";
  public static TYPE = "CHEST";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 7000;

  getReservedName(): string {
    return RoyalChestShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return RoyalChestShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return RoyalChestShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return RoyalChestShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: RoyalChestShopItem.PRICE_CURRENCY,
      amount: RoyalChestShopItem.PRICE_AMOUNT,
    };
  }
}
