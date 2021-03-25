import { ApiProperty } from "@nestjs/swagger";

export class RegisterReq {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  nickname: string;
}
