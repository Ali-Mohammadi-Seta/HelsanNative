import { createSlice } from "@reduxjs/toolkit";

const directionSlice = createSlice({
  name: "direction",
  initialState: {
    isRtl: true,
  },
  reducers: {
    setDirection: (state, { payload }) => {
      state.isRtl = payload === "fa";
    },
  },
});

export const { setDirection } = directionSlice.actions;
export default directionSlice.reducer;
