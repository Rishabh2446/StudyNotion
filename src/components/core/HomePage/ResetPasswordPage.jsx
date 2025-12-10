import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function handleReset(e){
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:4000/api/v1/auth/reset-password-token", {email});
            alert(response.data.message || "Password reset link sent to your email");
            navigate("/login");
        }
        catch(err){
            alert(err.response?.data?.message || "Error sending reset link");
        }
    }

  return (
    <div className='flex justify-center items-center h-screen bg-richblack-900 text-richblack-5'>
      <form onSubmit={handleReset} className="bg-richblack-800 p-6 rounded-lg shadow-md w-[400px]">
        <h2 className="text-xl font-bold mb-4">Reset your password</h2>
        <p className="text-sm mb-4 text-richblack-300">
          Have no fear. We'll email you instructions to reset your password.
        </p>
        <label className="block mb-3">
          <span className="block text-sm mb-1">Email Address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email id"
            className="bg-richblack-700 text-richblack-5 w-full p-3 rounded-md"
          />
        </label>
        <button type="submit" className="w-full bg-[#fde047] text-black py-2 rounded-lg font-semibold">
           Send Reset Password
        </button>
        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-blue-400 cursor-pointer text-center"
        >
          ← Back to login
        </p>
      </form>
    </div>
  )
}

export default ResetPasswordPage