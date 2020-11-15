import { Request } from 'express';
import { User } from '../../entities/users/user.entity';

export interface RequestWithUser extends Request {
    user: User;
}
