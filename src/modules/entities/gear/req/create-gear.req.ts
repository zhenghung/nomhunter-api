import { ApiProperty } from "@nestjs/swagger";

export class CreateGearReq {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
