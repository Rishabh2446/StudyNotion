import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();


  console.log("Verify button clicked!");

  async function handleVerify() {

    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) {
      toast.error("Signup data missing. Please try signing up again.");
      navigate("/signup");
      return;
    }
    const { firstName, lastName, password, accountType, email } = signupData;

      console.log("Sending:", { email, otp });


    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/signup`, {
        email,
        otp,
        firstName,
        lastName,
        password,
        confirmPassword: password,
        accountType: accountType.charAt(0).toUpperCase() + accountType.slice(1),
      });

      console.log("Verification success:", response.data);

      if (response.data.success) {
        console.log("Signup success:", response.data);
        localStorage.removeItem("signupData"); // cleanup
        navigate("/login"); // or /dashboard if you want auto-login
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Verification failed", error.response?.data || error.message);
    }
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <h2 className="text-white text-xl">Verify Email</h2>
      <p className="text-gray-400">Enter the OTP sent to your emailId</p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mt-4 px-4 py-2 rounded-md"
        placeholder="Enter OTP"
      />

      <button
        onClick={handleVerify}
        className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-md"
      >
        Verify Email
      </button>
    </div>
  );
}
