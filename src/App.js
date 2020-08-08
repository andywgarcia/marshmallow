import React from "react";
import "./App.css";
import LoanInformation from "./components/LoanInformation";
import Amount from "./components/Amount";
import PayoffInformation from "./components/PayoffInformation";
import { Provider } from "react-redux";
import store from "./redux/store";
import TotalCost from "./components/TotalCost";

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
