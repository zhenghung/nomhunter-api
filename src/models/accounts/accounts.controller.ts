import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {
    }

    @Post()
    async create(@Body() createAccountDto: CreateAccountDto): Promise<void> {
        await this.accountsService.create(createAccountDto);
    }

    @Get()
    async findAll(): Promise<Account[]> {
        return this.accountsService.findAll();
    }
}
