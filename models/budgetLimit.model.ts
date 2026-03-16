import mongoose, { Document, Schema } from "mongoose";

export interface IBudgetLimit extends Document {
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  limitAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetLimitSchema = new Schema<IBudgetLimit>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    limitAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

budgetLimitSchema.index({ user: 1, category: 1 }, { unique: true });

const BudgetLimit = mongoose.models?.BudgetLimit || mongoose.model("BudgetLimit", budgetLimitSchema);

export default BudgetLimit;
