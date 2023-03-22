import { Schema, model, models } from 'mongoose';

interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    active: boolean,
    updated: Date,
    options: {
        darkMode: boolean,
        taskTypes: [string],
    },
}

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    active: Boolean,
    updated: { type: Date, default: Date.now },
    options: {
        darkMode: Boolean,
        taskTypes: [String],
    },
});

const User = models.User || model<IUser>('User', userSchema);

export default User;
export type { IUser };
