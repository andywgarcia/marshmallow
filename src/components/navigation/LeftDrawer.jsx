import React, { useState } from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import AddIcon from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "@reach/router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { addLoan } from "../../redux/actionCreators";

function LeftDrawer(props) {
  const { window } = props;
  const [id, createNewId] = useState(uuidv4());
  const drawer = (
    <div>
      <div className={props.classes.toolbar} />
      <Divider />
      <List>
        <Link to="/">
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
          }}
        >
          <ListItem button key="Add Loan">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Loan" />
          </ListItem>
        </Link>
      </List>
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

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  addLoan,
};

LeftDrawer.propTypes = {
  isMobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  classes: PropTypes.any,
  theme: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer);
