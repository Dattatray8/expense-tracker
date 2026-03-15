import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    type: "income" | "expense";
    user?: mongoose.Types.ObjectId; 
    color?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null, 
        },
        color: {
            type: String,
            default: "#4A00FF",
        },
        icon: {
            type: String,
            default: "folder"
        },
    },
    { timestamps: true }
);

delete mongoose.models.Category;
const Category: Model<ICategory> = mongoose.model("Category", categorySchema);

export default Category;
