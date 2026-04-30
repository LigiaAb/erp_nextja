import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface AuthState {
  cod_usuario: number | null;
  correo: string | null;
  puesto: string | null;
  nombre_completo: string | null;
  nombre: string | null;
  apellido: string | null;
}

const initialState: AuthState = {
  cod_usuario: null,
  correo: null,
  puesto: null,
  nombre_completo: null,
  nombre: null,
  apellido: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<AuthState>) => {
      // console.log({ payload: action.payload });
      state.cod_usuario = action.payload.cod_usuario;
      state.correo = action.payload.correo;
      state.puesto = action.payload.puesto;
      state.nombre_completo = action.payload.nombre_completo;
      state.nombre = action.payload.nombre;
      state.apellido = action.payload.apellido;
    },

    clearUserData: (state) => {
      state.cod_usuario = null;
      state.correo = null;
      state.puesto = null;
      state.nombre_completo = null;
      state.nombre = null;
      state.apellido = null;
    },
  },
});

export const { setUserData, clearUserData } = authSlice.actions;

export default authSlice.reducer;

/* ---------------- SELECTORS ---------------- */

export const selectAuth = (state: RootState) => state.auth;
export const getCurrentUser = (state: RootState) => state.auth.cod_usuario;
