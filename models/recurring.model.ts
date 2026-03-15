import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRecurring extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: mongoose.Types.ObjectId;
  dayOfMonth: number; // 1-31
  createdAt: Date;
  updatedAt: Date;
}

const recurringSchema = new Schema<IRecurring>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    dayOfMonth: { type: Number, required: true, min: 1, max: 31 },
  },
  { timestamps: true }
);

delete mongoose.models.Recurring;
const Recurring: Model<IRecurring> = mongoose.model("Recurring", recurringSchema);
export default Recurring;
