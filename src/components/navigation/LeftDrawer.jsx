import React from "react";
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

const Links = [
  {
    text: "Calculator",
    location: "/",
    icon: <AttachMoneyIcon />,
  },
  {
    text: "Add Loan",
    location: "/loan",
    icon: <AddIcon />,
  },
];

function LeftDrawer(props) {
  const { window } = props;

  const drawer = (
    <div>
      <div className={props.classes.toolbar} />
      <Divider />
      <List>
        {Links.map(({ text, location, icon }) => (
          <Link to={location}>
            <ListItem button key={text}>
              <ListItemIcon>
                {React.createElement(icon.type, icon.props)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={props.classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
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
      <Hidden xsDown implementation="css">
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

LeftDrawer.propTypes = {
  isMobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  classes: PropTypes.any,
  theme: PropTypes.any,
};

export default LeftDrawer;
