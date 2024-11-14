import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { IUser } from "src/interfaces/user.interface";
import * as bcrypt from "bcrypt";

@Schema({ timestamps: true })
export class User extends Document implements IUser {
    @Prop({ type: String, required: true })
    first_name: string;

    @Prop({ type: String, required: true })
    last_name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<User>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})
