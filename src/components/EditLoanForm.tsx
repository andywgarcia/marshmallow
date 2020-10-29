import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { updateLoan, removeLoan } from "../store/actions";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { getLoan } from "../store/selectors";
import { Link } from "@reach/router";
import moment from "moment";
import DecimalInput from "./DecimalInput";
import { RootState } from "../store/rootReducer";

const mapStateToProps = (state: RootState, ownProps) => {
  const loan = getLoan(state, ownProps);
  return {
    id: loan?.id,
    balance: loan?.balance,
    interestRate: loan?.interestRate,
    monthlyMinimumPayment: loan?.monthlyMinimumPayment,
    date: loan?.date,
  };
};

const mapDispatchToProps = {
  updateLoan,
  removeLoan,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  loanId: string;
};

function AddLoanForm(props: Props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>Loan Information</h1>
      <div>
        <TextField
          id="loan-balance-input"
          label="Balance"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: DecimalInput,
            inputProps: {
              value: props.balance,
              onChange: (e) => {
                props.updateLoan({
                  id: props.loanId,
                  balance: parseFloat((e.target as HTMLTextAreaElement).value),
                });
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <KeyboardDatePicker
          disableToolbar
          format="MMMM Do, YYYY"
          margin="normal"
          id="loan-date"
          label="Date"
          inputVariant="outlined"
          value={props.date || moment()}
          onChange={(date) =>
            props.updateLoan({ id: props.loanId, date: moment(date) })
          }
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </div>
      <div>
        <TextField
          id="loan-interest-rate-input"
          label="Interest Rate %"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputComponent: DecimalInput,
            inputProps: {
              value: props.interestRate,
              onChange: (e) => {
                props.updateLoan({
                  id: props.loanId,
                  interestRate: parseFloat(
                    (e.target as HTMLTextAreaElement).value
                  ),
                });
              },
              max: 100,
              // suffix: "%",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div>
        <TextField
          id="loan-monthly-min-payment-input"
          label="Monthly Minimum Payment"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: DecimalInput,
            inputProps: {
              value: props.monthlyMinimumPayment,
              onChange: (e) => {
                props.updateLoan({
                  id: props.loanId,
                  monthlyMinimumPayment: parseFloat(
                    (e.target as HTMLTextAreaElement).value
                  ),
                });
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Remove Loan
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this loan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Link
            to="/loans"
            replace
            onClick={() => {
              props.removeLoan(props.loanId);
              handleClose();
            }}
          >
            <Button color="secondary" autoFocus>
              Delete
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default connector(AddLoanForm);
