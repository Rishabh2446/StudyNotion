import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UpdatePasswordPage = () => {

    const {token} = useParams();
    const [formData, setFormData] = useState({ newPassword: "", confirmPassword: ""});
    const navigate = useNavigate();

    function changeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleUpdate(e){
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:4000/api/v1/auth/reset-password", {
                token,
                ...formData,
            });
            alert(response.data.message || "Password reset successful");
            navigate("/login");
        }
        catch(err){
            alert(err.response?.data?.message || "Error resetting password");
        }
    }
  return (
    <div className="flex justify-center items-center h-screen bg-richblack-900 text-richblack-5">
        <form onSubmit={handleUpdate} className="bg-richblack-800 p-6 rounded-lg shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create New Password</h2>
            <label className="block mb-3">
            <span className="text-sm mb-1">New Password</span>
            <input
                type="password"
                required
                name="newPassword"
                value={formData.newPassword}
                onChange={changeHandler}
                placeholder="Enter new password"
                className="bg-richblack-700 text-richblack-5 w-full p-3 rounded-md"
            />
            </label>
            <label className="block mb-4">
            <span className="text-sm mb-1">Confirm Password</span>
            <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm new password"
                className="bg-richblack-700 text-richblack-5 w-full p-3 rounded-md"
            />
            </label>
            <button type="submit" className="w-full bg-[#fde047] text-black py-2 rounded-lg font-semibold">
            Reset Password
            </button>
        </form>
    </div>
  )
}

export default UpdatePasswordPage