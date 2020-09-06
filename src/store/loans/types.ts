import { Moment } from "moment";

export interface Loan {
  id: string;
  balance: number;
  interestRate: number;
  monthlyMinimumPayment: number;
  date: Moment;
}

export interface State {
  allLoans: Loan[];
}

export interface LoanPayment {
  id: string;
  balance: number;
  payment: number;
  date: Moment;
}

export interface LoansPayment {
  [loanId: string]: LoanPayment;
}
