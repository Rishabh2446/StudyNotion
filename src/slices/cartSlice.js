import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};


const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
                // add to cart
        addToCart(state, action) {
            const course = action.payload;

            const alreadyExists = state.cart.find((item) => item._id === course._id);
            if (alreadyExists) {
                toast.error("Course already in cart");
                return;
            }

            state.cart.push(course);
            state.totalItems++;

            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            toast.success("Added to cart");
        },
        // remove from cart
        removeFromCart(state, action) {
            const courseId = action.payload;

            state.cart = state.cart.filter((item) => item._id !== courseId);
            state.totalItems--;

            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        },

        // reset cart
        resetCart(state) {
            state.cart = [];
            state.totalItems = 0;
            localStorage.removeItem("cart");
            localStorage.removeItem("totalItems");
            toast.success("Removed from cart!")
        },
    },
});


export const {addToCart, removeFromCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer;
