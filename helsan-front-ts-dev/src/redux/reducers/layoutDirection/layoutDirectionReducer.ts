import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isRtl: true,
};
export const layoutDirectionReducer = createSlice({
    name: 'layoutDirection',
    initialState,
    reducers: {
        setDirection: (state, { payload }) => {
            if (payload === 'fa' || payload === 'ar') {
                state.isRtl = true;
            } else if (payload === 'en') {
                state.isRtl = false;
            }
        },
    },
});

export const { setDirection } = layoutDirectionReducer.actions;
export default layoutDirectionReducer.reducer;
