import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  paletteAntd: Record<string, string | undefined> | null;
  paletteTailwind: Record<string, string | undefined> | null;
}

const initialState: ThemeState = {
  paletteAntd: null,
  paletteTailwind: null,
};

export const themeReducer = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (
      state,
      action: PayloadAction<{ paletteAntd: Record<string, string | undefined>; paletteTailwind: Record<string, string | undefined> }>
    ) => {
      const { paletteAntd, paletteTailwind } = action.payload;
      state.paletteAntd = paletteAntd;
      state.paletteTailwind = paletteTailwind;
    },
  },
});

export const { setTheme } = themeReducer.actions;
export default themeReducer.reducer;
