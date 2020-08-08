import React from "react";
import "./App.css";
import LoanInformation from "./LoanInformation";
import Amount from "./Amount";
import PayoffInformation from "./PayoffInformation";
import { Provider } from "react-redux";
import store from "./redux/store";
import TotalCost from "./TotalCost";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <LoanInformation />
        <PayoffInformation />
        <Amount />
        <TotalCost />
      </div>
    </Provider>
  );
}

export default App;
