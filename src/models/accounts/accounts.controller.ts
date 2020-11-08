import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
    private readonly logger = new Logger(AccountsController.name);

    constructor(private readonly accountsService: AccountsService) {
    }

    @Post()
    async create(@Body() createAccountDto: CreateAccountDto): Promise<void> {
        this.logger.log(`Creating account with email: ${createAccountDto.email}`);
        await this.accountsService.create(createAccountDto)
            .then((account) => this.logger.log(`Account with email ${account.email} successfully created`));
    }

    @Get()
    async findAll(): Promise<Account[]> {
        this.logger.log('Fetching all accounts');
        return this.accountsService.findAll();
    }
}
