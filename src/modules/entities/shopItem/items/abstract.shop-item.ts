import { Price } from "../shop-item-price";
import { ShopItemObject } from "../shop-item.object";

export abstract class AbstractShopItem {
  abstract getReservedName(): string;

  abstract getImageReservedName(): string;

  abstract getDisplayName(): string;

  abstract getType(): string;

  abstract getPrice(): Price;

  public getAmazonUrl(name: string) {
    return `https://nomhunter-dev.s3.eu-west-2.amazonaws.com/shop/${name}.png`;
  }

  public toObject(): ShopItemObject {
    return {
      reservedName: this.getReservedName(),
      displayName: this.getDisplayName(),
      type: this.getType(),
      imageName: this.getImageReservedName(),
      imageUrl: this.getAmazonUrl(this.getImageReservedName()),
      price: this.getPrice(),
    };
  }
}
