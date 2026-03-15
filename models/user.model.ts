import mongoose from "mongoose";

interface IUser {
    _id?: mongoose.Types.ObjectId;
    username?: string;
    image?: string;
    email: string;
    password?: string;
    monthlyIncome?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: String,
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: String,
        image: String,
        monthlyIncome: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true },
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;