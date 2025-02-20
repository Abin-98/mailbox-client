import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import mailReducer from "./reducers/mailSlice";
import searchReducer from "./reducers/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    search: searchReducer,
  },
});

export default store;
