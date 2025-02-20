import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  idToken: localStorage.getItem("idToken") || "",
  userEmail: localStorage.getItem("userEmail") || "",
  userName: localStorage.getItem("userName") || "",
  userProfilePic: "",
  emailVerified: false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setIdToken(state, action) {
      state.idToken = action.payload
    },
    setUserEmail(state, action) {
      state.userEmail = action.payload
    },
    setUserName(state, action) {
      state.userName = action.payload
    },
    setEmailVerified(state, action) {
      state.emailVerified = action.payload
    },
    setProfilePic(state, action) {
      state.emailVerified = action.payload
    }
  }
});

export default authSlice.reducer
export const authActions = authSlice.actions;
