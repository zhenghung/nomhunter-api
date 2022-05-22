import { Module } from "@nestjs/common";
import { ShopItemEntityService } from "./shop-item.entity.service";

@Module({
  imports: [],
  providers: [ShopItemEntityService],
  controllers: [],
  exports: [ShopItemEntityService],
})
export class ShopItemEntityModule {}
