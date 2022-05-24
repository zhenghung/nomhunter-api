import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class XLBoxShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "xl.box";
  public static IMAGE_RESERVED_NAME = "xl.box.shop-item";
  public static DISPLAY_NAME = "XL box";
  public static TYPE = "BOX";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 3000;

  getReservedName(): string {
    return XLBoxShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return XLBoxShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return XLBoxShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return XLBoxShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: XLBoxShopItem.PRICE_CURRENCY,
      amount: XLBoxShopItem.PRICE_AMOUNT,
    };
  }
}
