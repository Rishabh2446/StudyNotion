import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setLogin } from "../../../slices/authSlice";
import { setUser } from "../../../slices/profileSlice";
import toast from 'react-hot-toast';


const LoginForm = () => {

      const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email:"", password:""
    });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    function changeHandler(event){
        setFormData( (preevData) =>(
            {
                ...preevData,
                [event.target.name]:event.target.value
            }
        ))
    }
     async function submitHandler(event){
        event.preventDefault();
        console.log("Login submitted:", formData);

        try {
            const response = await axios.post("http://localhost:4000/api/v1/auth/login", formData, {
                withCredentials: true
            });

            console.log("Login response:", response.data);
            console.log("Login response user:", response.data.user);
            console.log("Account type from backend:", response.data.user?.accountType);


            if(response.data.success){
                dispatch(setLogin(response.data.token));
                dispatch(setUser(response.data.user));
                console.log("Redux user set:", response.data.user);


                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                const user = response.data.user;

                toast.success("Logged-in Successfully!");
                navigate("/dashboard/profile");
                


                

            } else {
                alert(response.data.message); // show error message
            }

        } catch(error){
            alert(error.response?.data?.message || "Login failed");
        }
    }
  return (
    <form onSubmit={submitHandler}
    >
        <label className='w-full'>
            <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]'>
                Email Address <sup className='text-[#fbcfe8]'>*</sup>
            </p>
            <input
                required
                type='email'
                value={formData.email}
                onChange={changeHandler}
                placeholder='Enter email id'
                name='email'
                className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'
            />
        </label>
        <label className='relative'>
            <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]'>
                Password <sup className='text-[#fbcfe8]'>*</sup>
            </p>
            <input
                required
                type={showPassword ? ("text"):("password")}
                value={formData.password}
                onChange={changeHandler}
                placeholder='Enter Password'
                name='password'
                className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'
            />
            
            {/* icon */}

            <span  onClick={()=> setShowPassword((prev)=> !prev)}
            className='absolute text-richblack-5 right-[12px] top-[75px]'>
                {showPassword ? (<AiOutlineEyeInvisible/>) : (<AiOutlineEye/>)}
            </span>

            <Link to="/reset-password" className='appearance-none bg-transparent border-none outline-none p-0 m-0'>
                <p className='font-xs mt-[4px] text-[#93c5fd] max-w-max ml-auto'>
                    Forget Password
                </p>
            </Link>
        </label>
        <button className='w-full bg-[#fde047] font-md rounded-lg px-3 py-2 mt-4 text-[#1f2937]'>
            Sign In
        </button>
    </form>
  )
}

export default LoginForm
