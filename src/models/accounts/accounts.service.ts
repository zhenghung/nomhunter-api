import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    ) {
    }

    async create(createAccountDto: CreateAccountDto): Promise<Account> {
        const createdAccount = new this.accountModel(createAccountDto);
        return createdAccount.save();
    }

    async findAll(): Promise<Account[]> {
        return this.accountModel.find().exec();
    }
}
