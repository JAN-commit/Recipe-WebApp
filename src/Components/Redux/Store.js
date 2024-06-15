import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './UserInfoSlice';
import mealInfoReducer from './MealInfoSlice'

const store = configureStore({
    reducer: {
        userInfo: userInfoReducer,
        MealInfo: mealInfoReducer,
    },
});

export default store;
