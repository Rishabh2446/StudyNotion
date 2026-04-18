import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
const BASE_URL = process.env.REACT_APP_BASE_URL;


const SignupForm = () => {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        firstname:"", lastname:"", email:"",
        password:"", confirmPassword:""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [accountType, setAccountType] = useState("Student");
    const [loading, setLoading] = useState(false);
    
    function changeHandler(event){
        setFormData( (prevData) =>(
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
        ))
    }
    
   async function submitHandler(event) {
  event.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/signup`,
      {
        firstName: formData.firstname,
        lastName: formData.lastname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType,
      }
    );

    toast.success("Account created successfully");

    // redirect to login
    navigate("/login");

  } catch (error) {
    if (error.response?.status === 400) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Signup failed. Try again.");
    }
  } finally {
    setLoading(false);
  }
}


        

    

  return (
    <div>
      {/* Student-Instructor tab */}
      <div className='bg-[#0f172a] flex px-1 py-2 gap-x-1 rounded-full max-w-max mt-4'>
        <button onClick={() => setAccountType("Student")}
        className={`py-2 px-5 rounded-full border-none cursor-pointer transition-all duration-200 ease-in-out bg-transparent text-red ${accountType === "Student" ? "bg-richblack-900 text-richblack-5" : "text-richblack-700"}`}
        >
            Student
        </button>
        <button onClick={()=> setAccountType("Instructor")}
        className={`py-2 px-5 rounded-full border-none cursor-pointer transition-all duration-200 ease-in-out bg-transparent text-red ${accountType === "Instructor" ? "bg-richblack-900 text-richblack-5" : "text-richblack-700"}`}
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
            {loading ? "Creating Account..." : "Create Account"}
        </button>


        
      </form>
    </div>
  )
}

export default SignupForm
