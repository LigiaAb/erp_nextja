import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Ctx } from "@/types/permisos/context";

export interface contextState {
  context: Ctx | null;
}

const initialState: contextState = {
  context: null,
};

export const contextSlice = createSlice({
  name: "context",
  initialState,
  reducers: {
    setcontext: (state, action: PayloadAction<Ctx>) => {
      state.context = action.payload;
    },

    clearcontext: (state) => {
      state.context = null;
    },
  },
});

export const { setcontext, clearcontext } = contextSlice.actions;

export default contextSlice.reducer;

/* ---------------- SELECTORS ---------------- */

export const selectcontext = (state: RootState) => state.context.context;
