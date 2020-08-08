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

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Provider store={store}>
        <Container maxWidth="sm" className="App">
          <LoanInformation />
          <PayoffInformation />
          <Amount />
          <TotalCost />
        </Container>
      </Provider>
    </React.Fragment>
  );
}

export default App;
