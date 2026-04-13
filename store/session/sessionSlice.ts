import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export interface SessionState {
  expired: boolean;
}

const initialState: SessionState = {
  expired: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionExpired(state) {
      state.expired = true;
    },

    clearSessionExpired(state) {
      state.expired = false;
    },
  },
});

export const { setSessionExpired, clearSessionExpired } = sessionSlice.actions;

export default sessionSlice.reducer;

/* ---------------- SELECTORS ---------------- */

export const selectSession = (state: RootState) => state.session.expired;
