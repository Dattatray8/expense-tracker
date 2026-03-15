import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authLoad: false,
    userData: null,
    authUser: null,
  },
  reducers: {
    setAuthLoad: (state, action: PayloadAction<boolean>) => {
      state.authLoad = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { setAuthLoad, setUserData, setAuthUser } =
  userSlice.actions;

export default userSlice.reducer;