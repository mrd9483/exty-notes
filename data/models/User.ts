import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    active: Boolean,
    updated: { type: Date, default: Date.now }
});

const User = models.User || model('User', userSchema);

export default User;