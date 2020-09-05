import { createStore } from "redux";
import rootReducer from "./reducers";

import throttle from "lodash/throttle";
import { saveState, loadState } from "./localStorage";

const store = createStore(
  rootReducer,
  loadState(),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

export default store;
