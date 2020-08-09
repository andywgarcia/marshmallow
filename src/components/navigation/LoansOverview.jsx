import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { connect } from "react-redux";
import { Link } from "@reach/router";

import FolderIcon from "@material-ui/icons/Folder";
const LoansOverview = (props) => {
  return (
    <List>
      {props.allLoans.map((loan, index) => (
        <Link to={`/loan/${loan.id}`} key={`loan-overview-${loan.id}`}>
          <ListItem button>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={`Loan ${index + 1}`} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

const mapStateToProps = (state) => ({
  allLoans: state.loans.allLoans,
});

export default connect(mapStateToProps)(LoansOverview);
