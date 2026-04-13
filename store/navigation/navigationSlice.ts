import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export interface NavigationState {
  currentModulo: string | number | null;
  nameCurrentModulo: string | number | null;
  currentMenu: string | number | null;
  currentCategoria: string | number | null;
}

const initialState: NavigationState = {
  currentModulo: null,
  nameCurrentModulo: null,
  currentMenu: null,
  currentCategoria: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentModulo: (state, action: PayloadAction<string | number | null>) => {
      state.currentModulo = action.payload;
      // state.currentMenu = null;
      // state.currentCategoria = null;
    },

    setCurrentModuloName: (state, action: PayloadAction<string | number | null>) => {
      state.nameCurrentModulo = action.payload;
      // state.currentMenu = null;
      // state.currentCategoria = null;
    },

    setCurrentMenu: (state, action: PayloadAction<string | number | null>) => {
      state.currentMenu = action.payload;
      // state.currentCategoria = null;
    },

    setCurrentCategoria: (state, action: PayloadAction<string | number | null>) => {
      state.currentCategoria = action.payload;
    },

    setNavigation: (
      state,
      action: PayloadAction<{
        currentModulo?: string | number | null;
        nameCurrentModulo?: string | number | null;
        currentMenu?: string | number | null;
        currentCategoria?: string | number | null;
      }>,
    ) => {
      state.currentModulo = action.payload.currentModulo ?? null;
      state.nameCurrentModulo = action.payload.nameCurrentModulo ?? null;
      state.currentMenu = action.payload.currentMenu ?? null;
      state.currentCategoria = action.payload.currentCategoria ?? null;
    },

    clearNavigation: (state) => {
      state.currentModulo = null;
      state.nameCurrentModulo = null;
      state.currentMenu = null;
      state.currentCategoria = null;
    },
  },
});

export const { setCurrentModulo, setCurrentMenu, setCurrentCategoria, setNavigation, clearNavigation, setCurrentModuloName } = navigationSlice.actions;

export const selectNavigation = (state: RootState) => state.navigation;
export const selectCurrentModulo = (state: RootState) => state.navigation.currentModulo;
export const selectCurrentModuloName = (state: RootState) => state.navigation.nameCurrentModulo;
export const selectCurrentMenu = (state: RootState) => state.navigation.currentMenu;
export const selectCurrentCategoria = (state: RootState) => state.navigation.currentCategoria;

export default navigationSlice.reducer;
