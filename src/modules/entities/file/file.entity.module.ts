import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import { FileEntityService } from "./file.entity.service";
import { FileEntityController } from "./file.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileEntityController],
  providers: [FileEntityService],
  exports: [FileEntityService],
})
export class FileEntityModule {}
