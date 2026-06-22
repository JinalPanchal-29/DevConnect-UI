import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserAuthData } from '../components/Login';

interface FeedState {
  users: UserAuthData[] | null;
}

const initialState: FeedState = {
  users: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<UserAuthData[]>) => {
      state.users = action.payload;
    },
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      if (state.users) {
        state.users = state.users.filter(user => user.id !== action.payload && (user as any)._id !== action.payload);
      }
    },
    clearFeed: (state) => {
      state.users = null;
    }
  },
});

export const { setFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
