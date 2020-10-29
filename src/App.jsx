import React from "react";
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Router } from "@reach/router";
import LoanCalculator from "./pages/LoanCalculator";
import EditLoan from "./pages/EditLoan";
import PaymentPlan from "./pages/PaymentPlan";
import Settings from "./pages/Settings";
import LeftDrawer from "./components/navigation/LeftDrawer";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import store from "./store";

import "./App.css";
import LoanOverview from "./pages/LoanOverview";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <React.Fragment>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  Marshmallow
                </Typography>
              </Toolbar>
            </AppBar>
            <LeftDrawer
              classes={classes}
              handleDrawerToggle={handleDrawerToggle}
              theme={theme}
              isMobileOpen={mobileOpen}
              closeDrawer={() => setMobileOpen(false)}
            />
            <Container maxWidth="xs" className={`App ${classes.Root} `}>
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <Router>
                  <LoanCalculator path="/" />
                  <EditLoan path="/loan/:loanId" />
                  <LoanOverview path="/loans" />
                  <PaymentPlan path="/plan" />
                  <Settings path="/settings" />
                </Router>
              </main>
            </Container>
          </div>
        </MuiPickersUtilsProvider>
      </Provider>
    </React.Fragment>
  );
}

export default App;
