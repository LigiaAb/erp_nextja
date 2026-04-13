import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

import permisosReducer from "./permisos/permisosSlice";
import contextReducer from "./context/contextSlice";
import authReducer from "./auth/authSlice";
import navigationReducer from "./navigation/navigationSlice";
import sessionReducer from "./session/sessionSlice";

const appReducer = combineReducers({
  permisos: permisosReducer,
  context: contextReducer,
  auth: authReducer,
  navigation: navigationReducer,
  session: sessionReducer,
});

export const resetAppState = createAction("app/resetState");

const rootReducer: typeof appReducer = (state, action) => {
  if (resetAppState.match(action)) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

