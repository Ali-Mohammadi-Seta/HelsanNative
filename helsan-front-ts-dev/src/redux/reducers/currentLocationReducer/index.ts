import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentLocation: { lat: 35.6892, lng: 51.389 },
    accuracy: 500,
};

export const currentLocationReducer = createSlice({
    name: 'currentLocation',
    initialState,
    reducers: {
        setCurrentLocation: (state, { payload }) => {
            state.currentLocation = payload;
        },
        setAccuracy: (state, { payload }) => {
            state.accuracy = payload;
        },
    },
});

export const { setCurrentLocation, setAccuracy } =
    currentLocationReducer.actions;
export default currentLocationReducer.reducer;