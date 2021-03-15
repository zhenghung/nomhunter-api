import { ApiProperty } from "@nestjs/swagger";

export class CreateBadgeReq {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
