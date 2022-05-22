import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";

export class EpixChestShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "epix.chest";
  public static IMAGE_RESERVED_NAME = "epix.chest.shop-item";
  public static DISPLAY_NAME = "Epix chest";
  public static TYPE = "CHEST";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 5000;

  getReservedName(): string {
    return EpixChestShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return EpixChestShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return EpixChestShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return EpixChestShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: EpixChestShopItem.PRICE_CURRENCY,
      amount: EpixChestShopItem.PRICE_AMOUNT,
    };
  }
}
