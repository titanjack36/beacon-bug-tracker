import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type UserState = {
  isAuthenticated: boolean;
};

const initialState: UserState = {
  isAuthenticated: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: state => {
      state.isAuthenticated = true;
    },
    logout: state => {
      state.isAuthenticated = false;
    }
  }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;