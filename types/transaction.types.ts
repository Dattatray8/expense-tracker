export interface Transaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  date: string | Date;
  description: string;
  category?: {
    _id: string;
    name: string;
    color?: string;
    icon?: string;
    type: "income" | "expense";
  };
  _pending?: boolean;
}
