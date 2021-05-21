import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntityService } from "./tag.entity.service";
import { TagEntity } from "./tag.entity";
import { TagEntityController } from "./tag.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagEntityService],
  controllers: [TagEntityController],
  exports: [TagEntityService],
})
export class TagEntityModule {}
