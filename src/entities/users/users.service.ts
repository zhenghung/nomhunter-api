import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async getByEmail(email: string): Promise<User>{
        const user = await this.usersRepository.findOne({ email });
        if (user){
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new User();
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;
        newUser.firstName = createUserDto.firstName;
        newUser.lastName = createUserDto.lastName;
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async getById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne(id);
        if (user) {
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
