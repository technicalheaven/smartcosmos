import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./features/auth/authSlice";
import tenantReducer from "./features/tenant/tenantSlice";
import roleReducer from "./features/role/roleSlice";
import processReducer from "./features/process/processSlice";
import appReducer from "./features/app/appSlice";
import { tenantService } from "./services/tenantApiSlice";
import { userService } from "./services/userApiSlice";
import { roleService } from "./services/roleApiSlice";
import { zoneService } from "./services/zoneApiSlice";
import { deviceService } from "./services/deviceApiSlice";
import { authApiSlice } from "./services/authApiSlice";
import { siteService } from "./services/siteApiSlice";
import { productService } from "./services/productApiSlice";
import { processService } from "./services/processApiSlice";
import { dashboardService } from "./services/dashboardApiSlice";
import { deviceManagerService } from "./services/deviceManagerApiSlice";
import { identityService } from "./services/identityApiSlice";
import { TagService } from "./services/tagApiSlice";
import filterReducer from "./features/filter/filterSlice";


const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["api"],
};

export const rootReducers = combineReducers({
  // Add the generated reducer as a specific top-level slice
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [tenantService.reducerPath]: tenantService.reducer,
  [userService.reducerPath]: userService.reducer,
  [roleService.reducerPath]: roleService.reducer,
  [deviceService.reducerPath]: deviceService.reducer,
  [zoneService.reducerPath]: zoneService.reducer,
  [siteService.reducerPath]: siteService.reducer,
  [productService.reducerPath]: productService.reducer,
  [processService.reducerPath]: processService.reducer,
  [dashboardService.reducerPath]: dashboardService.reducer,
  [deviceManagerService.reducerPath]: deviceManagerService.reducer,
  [identityService.reducerPath]: identityService.reducer,
  [TagService.reducerPath]: TagService.reducer,
  auth: authReducer,
  tenant: tenantReducer,
  role: roleReducer,
  process: processReducer,
  app: appReducer,
  filter: filterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      apiSlice.middleware,
      authApiSlice.middleware,
      tenantService.middleware,
      userService.middleware,
      zoneService.middleware,
      deviceService.middleware,
      siteService.middleware,
      roleService.middleware,
      productService.middleware,
      processService.middleware,
      dashboardService.middleware,
      deviceManagerService.middleware,
      identityService.middleware,
      TagService.middleware,
    ]),
  devTools: true,
});

setupListeners(store.dispatch);
