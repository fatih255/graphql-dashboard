import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { uiSlice } from "./uiSlice";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [uiSlice.name]: uiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault().concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
