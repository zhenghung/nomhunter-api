import { ApiProperty } from "@nestjs/swagger";

export class CreateAvatarDto {
  @ApiProperty({
    example: 1,
  })
  body: number;

  @ApiProperty({
    example: 1,
  })
  hat: number;

  @ApiProperty({
    example: 1,
  })
  prop: number;
}
