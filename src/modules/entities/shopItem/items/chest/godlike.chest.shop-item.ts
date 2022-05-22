import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class GodlikeChestShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "godlike.chest";
  public static IMAGE_RESERVED_NAME = "godlike.chest.shop-item";
  public static DISPLAY_NAME = "Godlike chest";
  public static TYPE = "CHEST";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 10000;

  getReservedName(): string {
    return GodlikeChestShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return GodlikeChestShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return GodlikeChestShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return GodlikeChestShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: GodlikeChestShopItem.PRICE_CURRENCY,
      amount: GodlikeChestShopItem.PRICE_AMOUNT,
    };
  }
}
