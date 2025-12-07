import { configureStore, combineReducers, Action } from "@reduxjs/toolkit";
import auth from "@/redux/reducers/authReducer";
import theme from "@/redux/reducers/theme";
import user from "@/redux/reducers/userReducer/userReducer";
import direction from "@/redux/reducers/layoutDirection/layoutDirectionReducer";
import currentLocation from "@/redux/reducers/currentLocationReducer";
import directionReducer from "./reducers/direction/directionReducer";
// Combine all reducers
const combinedReducer = combineReducers({
  auth,
  theme,
  direction,
  user,
  currentLocation,
  directionReducer,
});

// Define RootState based on combined reducer
export type RootState = ReturnType<typeof combinedReducer>;

// Root reducer with logout handling
const rootReducer = (state: RootState | undefined, action: Action<string>) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

// ✅ Create the store and export it
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// ✅ Export correct AppDispatch type after store is created
export type AppDispatch = typeof store.dispatch;
export default store;
