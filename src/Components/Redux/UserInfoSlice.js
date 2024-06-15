import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    age: 0,
    address: '',
    birthday: '',
    sex: '',
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setName(state, action) {
            state.name = action.payload;
        },
        setAge(state, action) {
            state.age = action.payload;
        },
        setAddress(state, action) {
            state.address = action.payload;
        },
        setBirthday(state, action) {
            state.birthday = action.payload;
        },
        setSex(state, action) {
            state.sex = action.payload;
        },
    },
});

export const { setName, setAge, setAddress, setBirthday, setSex } = userInfoSlice.actions;
export default userInfoSlice.reducer;
