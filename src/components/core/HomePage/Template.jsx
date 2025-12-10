import React from 'react'
import SignupForm from './SignupForm'
import frameImage from '../../../assets/frame.png'
import LoginForm from './LoginForm'
import { FcGoogle } from 'react-icons/fc'

const Template = ({title, desc1, desc2, image, formtype, setIsLoggedIn}) => {
  return (
    <div className='mx-auto flex w-11/12 items-center justify-between max-w-5xl gap-32 py-12'>

      <div className='w-11/12 mx-auto max-w-[450px]'>
        <h1 className='text-[#E6E6E6] font-semibold text-3xl leading-[2.375rem]'>{title}</h1>
        <p className='text-lg leading-7 mt-4'>
            <span className='text-[#f1f1f1]'>{desc1}</span>
            <br/>
            <span className='text-[#93c5fd] italic'>{desc2}</span>
        </p>
        {formtype === "signup" ?
        (<SignupForm setIsLoggedIn={setIsLoggedIn}/>):
        (<LoginForm setIsLoggedIn={setIsLoggedIn}/>)}

        <div className='flex items-center w-full gap-x-2 mt-4 mb-4'>
            <div className='text-white w-full  height-[2px]'></div>
            <p className='text-white bg-[#0b0b0f] font-medium leading-[1.375rem] mt-4'>or</p>
            <div className='text-white w-full height-[2px]'></div>
        </div>

        <button className='flex w-full justify-center items-center text-base rounded-lg text-[#f1f1f1] border border-[#0b0b0f] px-3 py-2 gap-2 mt-4 bg-transparent appearance-none'>
          <FcGoogle/>
          <p>Sign Up With Google</p>
        </button>
      </div>
      <div className='relative w-11/12'>
        <img src={frameImage}
            alt="pattern"
            className='w-[450px] h-[450px]'
            loading='lazy'
        />
        <img src={image}
            alt="Students"
            className='absolute w-[550px] h-[450px] -top-10 right-5'
            loading='lazy'
        />
      </div>
    </div>
  )
}

export default Template
