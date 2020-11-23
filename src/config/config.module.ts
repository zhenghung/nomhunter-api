import { ConfigModule } from "@nestjs/config";
import { configFactory } from "./config.factory";

export default ConfigModule.forRoot({
  isGlobal: true,
  load: [configFactory],
});
