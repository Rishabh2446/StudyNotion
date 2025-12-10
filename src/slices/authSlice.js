import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    isSignedUp: localStorage.getItem("isSignedUp") ? true : false,
}
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setSignup: (state) => {
            state.isSignedUp = true;
            localStorage.setItem("isSignedUp", "true");
        },
        setLogin: (state, action) => {
            state.token = action.payload;
            state.isSignedUp = false;
            localStorage.removeItem("isSignedUp");
            localStorage.setItem("token",action.payload);
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token",action.payload);
        },
        logout: (state) => {
            state.token = null;
            state.isSignedUp = false;
            localStorage.removeItem("token");
            localStorage.removeItem("isSignedUp");
        },
    },
});


export const {setToken, setLogin, logout, setSignup} = authSlice.actions;
export default authSlice.reducer;