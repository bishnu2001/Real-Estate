import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinstart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserstart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserstart: (state) => {
      state.loading = true;
    },
    deleteuserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    SignoutUserstart: (state) => {
      state.loading = true;
    },
    SignoutuserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    SignoutUserfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signinstart,
  signInSuccess,
  signInFailure,
  updateUserstart,
  updateUserSuccess,
  updateUserfailure,
  deleteUserstart,
  deleteuserSuccess,
  deleteUserfailure,
  SignoutUserstart,
  SignoutuserSuccess,
  SignoutUserfailure,
} = userSlice.actions;

export default userSlice.reducer;
