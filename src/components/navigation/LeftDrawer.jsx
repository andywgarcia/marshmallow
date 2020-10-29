import React, { useState } from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import AddIcon from "@material-ui/icons/Add";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import SettingsIcon from "@material-ui/icons/Settings";
import List from "@material-ui/core/List";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "@reach/router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { addLoan } from "../../store/actions";
import LoansOverview from "./LoansOverview";
import * as selectors from "../../store/selectors";

import { Typography } from "@material-ui/core";

function LeftDrawer(props) {
  const { window } = props;
  const [id, createNewId] = useState(uuidv4());
  const drawer = (
    <div>
      <div
        className={props.classes.toolbar}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h5" style={{ color: "green" }}>
            ${(props.interestSaved || 0).toFixed(2)} saved
          </Typography>
        </div>
        {(props.interestMissed || 0).toFixed(2) > 0 && (
          <div>
            <Typography variant="caption" style={{ color: "red" }}>
              (${(props.interestMissed || 0).toFixed(2)} didn't save...)
            </Typography>
          </div>
        )}
      </div>
      <Divider />
      <List>
        <Link to="/" onClick={props.closeDrawer}>
          <ListItem button key="Calculator">
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Calculator" />
          </ListItem>
        </Link>
        <Link
          to={`/loan/${id}`}
          onClick={() => {
            props.addLoan(id);
            createNewId(uuidv4());
            props.closeDrawer();
          }}
        >
          <ListItem button key="Add Loan" onClick={props.closeDrawer}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Loan" />
          </ListItem>
        </Link>
        <Link to={`/plan`} onClick={props.closeDrawer}>
          <ListItem button key="Plan" onClick={props.closeDrawer}>
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Plan" />
          </ListItem>
        </Link>
        <Link to={`/settings`} onClick={props.closeDrawer}>
          <ListItem button key="Settings" onClick={props.closeDrawer}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <LoansOverview closeDrawer={props.closeDrawer} />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={props.classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp>
        <Drawer
          container={container}
          variant="temporary"
          anchor={props.theme.direction === "rtl" ? "right" : "left"}
          open={props.isMobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: props.classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          classes={{
            paper: props.classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

const mapStateToProps = (state) => {
  const originalTotalPaid = selectors.getOriginalTotalPaid(state);
  const totalPaidAfterAdditionalPayments = selectors.getTotalPaidWithExtraPayments(
    state
  );
  const originalPaymentPlan = selectors.getPaymentPlan(state);
  const additionalPaymentsPlan = selectors.getPaymentPlanWithAdditionalPayments(
    state
  );

  const interestSaved = originalTotalPaid - totalPaidAfterAdditionalPayments;

  const potentialTotalPaid = selectors.getPotentialTotalPaid(state);
  const potentialInterestSaved = originalTotalPaid - potentialTotalPaid;

  return {
    interestSaved: originalTotalPaid - totalPaidAfterAdditionalPayments,
    monthsSooner: originalPaymentPlan.length - additionalPaymentsPlan.length,
    interestMissed: potentialInterestSaved - interestSaved,
  };
};
const mapDispatchToProps = {
  addLoan,
};

LeftDrawer.propTypes = {
  isMobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  classes: PropTypes.any,
  theme: PropTypes.any,
  closeDrawer: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer);
