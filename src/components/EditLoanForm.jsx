import React from "react";
import { connect } from "react-redux";
import { updateLoan, removeLoan } from "../redux/actionCreators";
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
import { getLoan } from "../redux/selectors";
import { Link } from "@reach/router";
import moment from "moment";
import CurrencyInput from "react-currency-input";

function AddLoanForm(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let componentDidMount_super = CurrencyInput.prototype.componentDidMount;
  CurrencyInput.prototype.componentDidMount = function () {
    this.theInput.setSelectionRange_super = this.theInput.setSelectionRange;
    this.theInput.setSelectionRange = (start, end) => {
      if (document.activeElement === this.theInput) {
        this.theInput.setSelectionRange_super(start, end);
      }
    };
    componentDidMount_super.call(this, ...arguments);
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
            inputComponent: CurrencyInput,
            inputProps: {
              value: props.balance,
              onChangeEvent: (event, maskedValue, floatValue) => {
                props.updateLoan({
                  id: props.loanId,
                  balance: floatValue,
                });
              },
              inputType: "number",
              pattern: "\\d*",
              selectAllOnFocus: true,
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
            props.updateLoan({ id: props.loanId, date: date })
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
            inputComponent: CurrencyInput,
            inputProps: {
              value: props.interestRate,
              onChangeEvent: (event, maskedValue, floatValue) => {
                props.updateLoan({
                  id: props.loanId,
                  interestRate: floatValue,
                });
              },
              inputType: "number",
              pattern: "\\d*",
              selectAllOnFocus: true,
            },
          }}
          InputLabelProps={{ shrink: true }}
          onBlur={() => {
            if (props.interestRate > 100) {
              props.updateLoan({
                id: props.loanId,
                interestRate: 100,
              });
            }
          }}
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
            inputComponent: CurrencyInput,
            inputProps: {
              value: props.monthlyMinimumPayment,
              onChangeEvent: (event, maskedValue, floatValue) => {
                props.updateLoan({
                  id: props.loanId,
                  monthlyMinimumPayment: floatValue,
                });
              },
              inputType: "number",
              pattern: "\\d*",
              selectAllOnFocus: true,
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

const mapStateToProps = (state, ownProps) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanForm);
