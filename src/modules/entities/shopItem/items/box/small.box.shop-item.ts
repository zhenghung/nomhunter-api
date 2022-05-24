import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class SmallBoxShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "small.box";
  public static IMAGE_RESERVED_NAME = "small.box.shop-item";
  public static DISPLAY_NAME = "Small box";
  public static TYPE = "BOX";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 900;

  getReservedName(): string {
    return SmallBoxShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return SmallBoxShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return SmallBoxShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return SmallBoxShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: SmallBoxShopItem.PRICE_CURRENCY,
      amount: SmallBoxShopItem.PRICE_AMOUNT,
    };
  }
}
