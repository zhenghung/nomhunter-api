import { ApiProperty } from "@nestjs/swagger";

export class CreateTagReq {
  @ApiProperty()
  name: string;
}
