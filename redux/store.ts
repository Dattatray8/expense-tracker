import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSliece";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;