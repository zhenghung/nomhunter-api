import { AbstractShopItem } from "../abstract.shop-item";
import { Price } from "../../shop-item-price";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediumBoxShopItem extends AbstractShopItem {
  public static RESERVED_NAME = "medium.box";
  public static IMAGE_RESERVED_NAME = "medium.box.shop-item";
  public static DISPLAY_NAME = "Medium box";
  public static TYPE = "BOX";
  public static PRICE_CURRENCY = "NOM";
  public static PRICE_AMOUNT = 1300;

  getReservedName(): string {
    return MediumBoxShopItem.RESERVED_NAME;
  }

  getDisplayName(): string {
    return MediumBoxShopItem.DISPLAY_NAME;
  }

  getImageReservedName(): string {
    return MediumBoxShopItem.IMAGE_RESERVED_NAME;
  }

  getType(): string {
    return MediumBoxShopItem.TYPE;
  }

  getPrice(): Price {
    return {
      currency: MediumBoxShopItem.PRICE_CURRENCY,
      amount: MediumBoxShopItem.PRICE_AMOUNT,
    };
  }
}
