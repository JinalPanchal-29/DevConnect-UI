import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserAuthData } from '../components/Login';

export interface ConnectionRequestInfo {
  _id: string;
  fromUserId: UserAuthData;
  toUserId: string;
  status: string;
  createdAt: string;
}

interface RequestState {
  requests: ConnectionRequestInfo[] | null;
}

const initialState: RequestState = {
  requests: null,
};

export const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<ConnectionRequestInfo[]>) => {
      state.requests = action.payload;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      if (state.requests) {
        state.requests = state.requests.filter(req => req._id !== action.payload);
      }
    },
    clearRequests: (state) => {
      state.requests = null;
    }
  },
});

export const { setRequests, removeRequest, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
