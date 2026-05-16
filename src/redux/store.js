// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // The slice we created earlier

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other reducers here if you have them
  },
});

export default store;