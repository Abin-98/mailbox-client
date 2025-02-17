import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice'
import mailReducer from './reducers/mailSlice'

const store = configureStore({
  reducer: { 
    auth: authReducer,
    mail: mailReducer
  }
});

export default store;