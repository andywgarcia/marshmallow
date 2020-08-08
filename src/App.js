import React from "react";
import "./App.css";
import LoanInformation from "./LoanInformation";
import Amount from "./Amount";
import PayoffInformation from "./PayoffInformation";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <LoanInformation />
        <PayoffInformation />
        <Amount />
      </div>
    </Provider>
  );
}

export default App;
