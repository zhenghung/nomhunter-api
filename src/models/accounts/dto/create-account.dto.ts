import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly password: string;
}
