import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { PermisosUsuarios } from "@/types/permisos/permisos";

export interface PermisosState {
  permisos: PermisosUsuarios | null;
}

const initialState: PermisosState = {
  permisos: null,
};

export const permisosSlice = createSlice({
  name: "permisos",
  initialState,
  reducers: {
    setPermisos: (state, action: PayloadAction<PermisosUsuarios>) => {
      state.permisos = action.payload;
    },

    clearPermisos: (state) => {
      state.permisos = null;
    },
  },
});

export const { setPermisos, clearPermisos } = permisosSlice.actions;

export default permisosSlice.reducer;

/* ---------------- SELECTORS ---------------- */

export const selectPermisos = (state: RootState) => state.permisos.permisos;
