import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    type: "income" | "expense";
    category: mongoose.Types.ObjectId; // References Category model
    date: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

delete mongoose.models.Transaction;
const Transaction: Model<ITransaction> = mongoose.model("Transaction", transactionSchema);

export default Transaction;
