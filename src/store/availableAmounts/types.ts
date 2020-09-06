import { Moment } from "moment";

export interface Payment {
  id: string;
  date: Moment;
  amount: number;
}

export interface State {
  desiredSpending: {
    date: Moment;
    amount: number;
  };
  monthlyPayment: number;
  extraPayments: Payment[];
  extraSpending: Payment[];
}
