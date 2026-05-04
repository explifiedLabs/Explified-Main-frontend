import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import memberReducer from "../features/members/memberSlice"
import postReducer from "../features/posts/postSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: memberReducer,
    posts: postReducer,

  },
});