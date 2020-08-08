import React from "react";
import "./App.css";
import LoanInformation from "./components/LoanInformation";
import Amount from "./components/Amount";
import PayoffInformation from "./components/PayoffInformation";
import { Provider } from "react-redux";
import store from "./redux/store";
import TotalCost from "./components/TotalCost";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Divider } from "@material-ui/core";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Provider store={store}>
        <Container maxWidth="xs" className="App">
          <LoanInformation />
          <Divider />
          <PayoffInformation />
          <Divider />
          <Amount />
          <Divider />
          <TotalCost />
        </Container>
      </Provider>
    </React.Fragment>
  );
}

export default App;
