import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { FilesModule } from "./files/files.module";

@Module({
  imports: [UsersModule, FilesModule],
})
export class EntitiesModule {}
