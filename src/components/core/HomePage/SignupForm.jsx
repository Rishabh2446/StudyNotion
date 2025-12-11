import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSignup } from "../../../slices/authSlice"; 
import toast from 'react-hot-toast';
const BASE_URL = process.env.REACT_APP_BASE_URL;


const SignupForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        firstname:"", lastname:"", email:"",
        password:"", confirmPassword:""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [accountType, setAccountType] = useState("student");
    const [loading, setLoading] = useState(false);
    
    function changeHandler(event){
        setFormData( (prevData) =>(
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
        ))
    }
    async function submitHandler(event){
        event.preventDefault();
        if(formData.password !== formData.confirmPassword){
            // toast.error("Password do not match.")
            toast.error("Password do not match.")
            return ;
        }
        try{
                setLoading(true);

            const response = await axios.post(
                `${BASE_URL}/api/v1/auth/send-otp`, 
                {
                
                email: formData.email,
                
                }
            );

            console.log("Signup response:", response.data);

            if (response.data.success) {
                toast.success("OTP sent to your email!");
                dispatch(setSignup({
                    accountType,
                    email: formData.email,
                }));
                // Save email in localStorage or context so OTP page knows it
                localStorage.setItem("signupData", JSON.stringify({
                    firstName: formData.firstname,
                    lastName: formData.lastname,
                    email: formData.email,
                    password: formData.password,
                    accountType: accountType
                }));
                // Redirect to OTP page
                navigate("/verify-email");
            } else {
                alert(response.data.message || "Something went wrong.");
            }

        }
        catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Server error");
        } finally{
            setLoading(false);
        }
        

    }

  return (
    <div>
      {/* Student-Instructor tab */}
      <div className='bg-[#0f172a] flex px-1 py-2 gap-x-1 rounded-full max-w-max mt-4'>
        <button onClick={() => setAccountType("student")}
        className={`py-2 px-5 rounded-full border-none cursor-pointer transition-all duration-200 ease-in-out bg-transparent text-red ${accountType === "student" ? "bg-richblack-900 text-richblack-5" : "text-richblack-700"}`}
        >
            Student
        </button>
        <button onClick={()=> setAccountType("instructor")}
        className={`py-2 px-5 rounded-full border-none cursor-pointer transition-all duration-200 ease-in-out bg-transparent text-red ${accountType === "instructor" ? "bg-richblack-900 text-richblack-5" : "text-richblack-700"}`}
        >
            Instructor
        </button>
      </div>

      <form onSubmit={submitHandler}>
        {/* First name & Last name */}
        <div className='flex justify-between mt-1 gap-2'>
          <label>
            <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]' >First Name <sup className='text-[#fbcfe8]'>*</sup></p>
            <input
                required
                type='text'
                name='firstname'
                placeholder='Enter first name'
                onChange={changeHandler}
                value={formData.firstname}
                className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'

            />
          </label>
          <label>
            <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]' >Last Name<sup className='text-[#fbcfe8]'>*</sup></p>
            <input
                required
                type='text'
                name='lastname'
                placeholder='Enter last name'
                onChange={changeHandler}
                value={formData.lastname}
                className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'

            />
          </label>
        </div>
         
        {/* Email Address */}
        <label className='mt-1'>
            <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]' >Email Address <sup className='text-[#fbcfe8]'>*</sup></p>
            <input
                required
                type='email'
                name='email'
                placeholder='Enter email address'
                onChange={changeHandler}
                value={formData.email}
                className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'

            />
        </label>

        {/* create password & confirm password */}
        <div className='flex justify-between mt-1 gap-2'>
            <label className='relative'>
               <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]' >Create Password <sup className='text-[#fbcfe8]'>*</sup></p>
               <input
                    required
                    type={showPassword ? ("text") : ("password")}
                    name='password'
                    placeholder='Enter password'
                    onChange={changeHandler}
                    value={formData.password}
                    className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'

                />
                <span className='text-white absolute cursor-pointer right-[3px] top-[45px]' onClick={()=> setShowPassword((prev)=> !prev)}>
                    {showPassword ? (<AiOutlineEyeInvisible/>) : (<AiOutlineEye/>)}
                </span>
            </label>
            <label className='relative'>
               <p className='font-[14px] text-richblack-5 mt-[4px] leading-[1.375rem]' >Confirm Password <sup className='text-[#fbcfe8]'>*</sup></p>
               <input
                    required
                    type={showConfirmPassword ? ("text") : ("password")}
                    name='confirmPassword'
                    placeholder='confirm password'
                    onChange={changeHandler}
                    value={formData.confirmPassword}
                    className='bg-richblack-800 text-richblack-5 w-full p-3 border-none rounded-md'

                />
                <span  className='text-white absolute cursor-pointer right-[3px] top-[45px]' onClick={()=> setShowConfirmPassword((prev)=> !prev)}>
                    {showConfirmPassword ? (<AiOutlineEyeInvisible/>) : (<AiOutlineEye/>)}
                </span>
            </label>

        </div>
        <button 
        type='submit'
        disabled={loading}
        className='w-full bg-[#fde047] font-md rounded-lg px-3 py-2 mt-4 text-[#1f2937]'>
            {loading ? "Sending OTP..." : "Create Account"}
        </button>


        
      </form>
    </div>
  )
}

export default SignupForm
