import { ApiProperty } from "@nestjs/swagger";

export class LoginReq {
  @ApiProperty({
    example: "testing1@nomhunter.com",
  })
  email: string;

  @ApiProperty({
    example: "password123",
  })
  password: string;
}
