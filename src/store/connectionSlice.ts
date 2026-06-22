import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserAuthData } from '../components/Login';

interface ConnectionState {
  connections: UserAuthData[] | null;
}

const initialState: ConnectionState = {
  connections: null,
};

export const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<UserAuthData[]>) => {
      state.connections = action.payload;
    },
    clearConnections: (state) => {
      state.connections = null;
    }
  },
});

export const { setConnections, clearConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
