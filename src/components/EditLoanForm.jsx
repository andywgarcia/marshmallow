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
import { getLoan } from "../redux/selectors";
import { useNavigate } from "@reach/router";

function AddLoanForm(props) {
  const navigate = useNavigate();

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
          id="loan-current-balance-input"
          label="Current Balance"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={props.balance}
          onChange={({ target: { value } }) => {
            props.updateLoan({
              id: props.loanId,
              balance: value,
            });
          }}
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              balance: parseFloat(props.balance || 0),
            })
          }
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
          }}
          value={props.interestRate}
          onChange={({ target: { value } }) =>
            props.updateLoan({
              id: props.loanId,
              interestRate: value,
            })
          }
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              interestRate: parseFloat(props.interestRate || 0),
            })
          }
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
          }}
          value={props.monthlyMinimumPayment}
          onChange={({ target: { value } }) =>
            props.updateLoan({
              id: props.loanId,
              monthlyMinimumPayment: value,
            })
          }
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              monthlyMinimumPayment: parseFloat(
                props.monthlyMinimumPayment || 0
              ),
            })
          }
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
          <Button
            onClick={() => {
              navigate("/loans");
              props.removeLoan(props.loanId);
              // handleClose();
            }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
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
  };
};

const mapDispatchToProps = {
  updateLoan,
  removeLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanForm);
