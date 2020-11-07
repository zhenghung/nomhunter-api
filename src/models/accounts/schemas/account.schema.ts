import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account extends Document {
    @Prop()
    email: string;

    @Prop()
    password: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AccountSchema = SchemaFactory.createForClass(Account);
