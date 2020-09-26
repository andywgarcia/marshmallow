import React from "react";
import { connect } from "react-redux";
import * as selectors from "../store/selectors";
import { Line as LineChart } from "react-chartjs-2";
import { LoansPayment, LoanPayment, Loan } from "../store/loans/types";
import moment from "moment";

const PaymentPlanGraph = ({
  potentialPaymentPlan,
  paymentPlan,
  allLoansIds,
  loans,
}: {
  potentialPaymentPlan: LoansPayment[];
  paymentPlan: LoansPayment[];
  allLoansIds: string[];
  loans: Loan[];
}) => {
  const oldestLoanDate = loans.reduce((acc, curr) => {
    if (curr.date && moment(curr.date).isBefore(acc)) {
      return moment(curr.date);
    }
    return acc;
  }, moment());
  const labels = paymentPlan.map(
    (_monthPayment: LoansPayment, index: number) => {
      const date = moment(oldestLoanDate).add(index, "M").format("MMM-YY");
      return date;
    }
  );
  const totalLoanAmountsData = potentialPaymentPlan.map(
    (monthPayment: LoansPayment) => {
      const loanIds = Object.keys(monthPayment);
      const totalAmount = loanIds.reduce((acc: number, curr: string) => {
        const loanPayment: LoanPayment = monthPayment[curr];
        return acc + loanPayment.balance - loanPayment.payment;
      }, 0);
      return totalAmount;
    }
  );

  const totalLoanAmountsNoExtraPaymentData = paymentPlan.map(
    (monthPayment: LoansPayment) => {
      const loanIds = Object.keys(monthPayment);
      const totalAmount = loanIds.reduce((acc: number, curr: string) => {
        const loanPayment: LoanPayment = monthPayment[curr];
        return acc + loanPayment.balance - loanPayment.payment;
      }, 0);
      return totalAmount;
    }
  );

  const individualLoansData = allLoansIds.map((loanId) => {
    return paymentPlan.reduce((acc: number[], curr: LoansPayment) => {
      return [...acc, curr[loanId].balance];
    }, []);
  });

  const datasets = individualLoansData.map((data, index) => {
    const color = `rgba(${(255 / individualLoansData.length) * (index + 1)}, ${
      (255 - 255 / individualLoansData.length) * (index + 1)
    }, 115,0.4)`;
    return {
      label: `Loan ${index + 1} Data`,
      fill: true,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data,
    };
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Plan With Additional One-Time Spendings",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: totalLoanAmountsData,
      },
      {
        label: "Plan Without Additional One-Time Spendings",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(3, 252, 115,0.4)",
        borderColor: "rgba(3, 252, 115,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(3, 252, 115,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(3, 252, 115,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: totalLoanAmountsNoExtraPaymentData,
      },
    ],
  };

  const loanData = {
    labels: labels,
    datasets: datasets,
  };
  return (
    <div>
      <LineChart data={data} />
      <LineChart data={loanData} />
    </div>
  );
};

const mapState = (state) => {
  const potentialPaymentPlan = selectors.getPaymentPlanWithAdditionalDesiredSpending(
    state
  );

  const paymentPlan = selectors.getPaymentPlanWithAdditionalPayments(state);
  const allLoansIds = selectors.getAllLoans(state).map((loan) => loan.id);
  return {
    potentialPaymentPlan,
    paymentPlan,
    allLoansIds,
    loans: selectors.getAllLoans(state),
  };
};

PaymentPlanGraph.propTypes = {};

export default connect(mapState)(PaymentPlanGraph);
