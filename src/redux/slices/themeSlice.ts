import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

const THEME_STORAGE_KEY = '@app_theme';

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newMode: ThemeMode = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = newMode;
      AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      AsyncStorage.setItem(THEME_STORAGE_KEY, action.payload);
    },
  },
});

// Load theme from storage
export const loadTheme = () => async (dispatch: any) => {
  try {
    const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (theme === 'dark' || theme === 'light') {
      dispatch(setTheme(theme));
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
};

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;