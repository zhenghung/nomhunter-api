import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserEntityController } from "./user.entity.controller";
import { UserEntityService } from "./user.entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserEntityService],
  controllers: [UserEntityController],
  exports: [UserEntityService],
})
export class UserEntityModule {}
