import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntityService } from "./tag.entity.service";
import { TagEntity } from "./tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagEntityService],
  controllers: [],
  exports: [TagEntityService],
})
export class TagEntityModule {}
