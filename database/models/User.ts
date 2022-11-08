import mongoose, { Schema, model, Model } from "mongoose";
import type { IUser } from "@interfaces";


const UserSchema: Schema = new Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   role: { 
    type: String,
    enum: { 
        values: ['admin', 'client', 'super-user', 'SEO'],
        message: '{VALUE} no es un role válido',
        default: 'client',
        requiree: true
     }
    }

}, {
    timestamps: true
})


const UserModel: Model<IUser> = mongoose.models.User || model('User', UserSchema)

export default UserModel