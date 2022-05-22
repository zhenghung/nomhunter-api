import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class LargeBoxShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "large.box";
  public static IMAGE_RESERVED_NAME = "large.box.shop-item";
  public static DISPLAY_NAME = "Large box";
  public static TYPE = "BOX";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 2000;

  getReservedName(): string {
    return LargeBoxShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return LargeBoxShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return LargeBoxShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return LargeBoxShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: LargeBoxShopItem.PRICE_CURRENCY,
      amount: LargeBoxShopItem.PRICE_AMOUNT,
    };
  }
}
