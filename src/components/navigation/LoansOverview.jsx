import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { connect } from "react-redux";
import { Link } from "@reach/router";

import FolderIcon from "@material-ui/icons/Folder";
const LoansOverview = (props) => {
  return (
    <List>
      <Link to={"/loans"} onClick={props.closeDrawer}>
        <ListItem button>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Loans Overview" />
        </ListItem>
      </Link>
      {props.allLoans.map((loan, index) => (
        <Link
          to={`/loan/${loan.id}`}
          key={`loan-overview-${loan.id}`}
          onClick={props.closeDrawer}
        >
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
