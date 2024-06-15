// MealInfoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    name: '',
    area: '',
    image: '',
    youtube: '',
    instructions: '',
    source: '',
};

const mealInfoSlice = createSlice({
    name: 'mealInfo', // Ensure consistent naming
    initialState,
    reducers: {
        setId(state, action) {
            state.id = action.payload;
        },
        setName(state, action) {
            state.name = action.payload;
        },
        setArea(state, action) {
            state.area = action.payload;
        },
        setImage(state, action) {
            state.image = action.payload;
        },
        setYoutube(state, action) {
            state.youtube = action.payload;
        },
        setInstructions(state, action) {
            state.instructions = action.payload;
        },
        setSource(state, action) {
            state.source = action.payload;
        },
    },
});

export const { setId, setName, setArea, setImage, setYoutube, setInstructions, setSource } = mealInfoSlice.actions;
export default mealInfoSlice.reducer;
