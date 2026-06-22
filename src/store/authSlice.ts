import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserAuthData } from '../components/Login';

interface AuthState {
  user: UserAuthData | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserAuthData | null>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserAuthData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
