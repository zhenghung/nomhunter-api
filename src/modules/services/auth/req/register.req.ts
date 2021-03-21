import { ApiProperty } from "@nestjs/swagger";

export class RegisterReq {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
