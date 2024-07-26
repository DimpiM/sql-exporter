import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { appSlice } from "./appSlice";
import { apiBase } from "./api/apiBase";
import { manageDbSlice } from "./slice/manageDbSlice";
import { databaseSlice } from "./slice/databaseSlice";
import { exportProgressSlice } from "./slice/exportProgressSlice";

export const store = configureStore({
  devTools: true,
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [manageDbSlice.name]: manageDbSlice.reducer,
    [databaseSlice.name]: databaseSlice.reducer,
    [exportProgressSlice.name]: exportProgressSlice.reducer,
    [apiBase.reducerPath]: apiBase.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      apiBase.middleware
    )
  }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
