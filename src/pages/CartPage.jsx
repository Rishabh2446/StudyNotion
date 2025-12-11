import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("Please login to purchase!");
        navigate("/login");
        return;
    }

    if (cart.length === 0) return;

    // Save cart before payment
    localStorage.setItem("cartCheckout", JSON.stringify(cart));

    try {
        const res = await axios.post(
        `${BASE_URL}/api/v1/payment/create-stripe-session-multiple`,
        {
            courses: cart.map((course) => ({
            courseId: course._id,
            name: course.courseName,
            price: course.price,
            })),
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        window.location.href = res.data.url;
    } catch (error) {
        console.log("Stripe Checkout Error:", error);
        toast.error("Payment failed!");
    }
    };


  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="text-white w-11/12 max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cart.length === 0 ? (
        <p className="text-richblack-300 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between bg-richblack-800 p-4 rounded-lg border border-richblack-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{course.courseName}</h2>
                    <p className="text-sm text-richblack-300">₹ {course.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(course._id)}
                  className="text-red-400 hover:text-red-500 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total Price Section */}
          <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700 mt-6">
            <h2 className="text-xl font-bold">Total Price: ₹ {totalAmount}</h2>
            <button
              onClick={handleCheckout}
              className="bg-yellow-400 text-black font-bold py-2 px-4 rounded mt-3 w-17"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
