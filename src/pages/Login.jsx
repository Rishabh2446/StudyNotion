import React from 'react'
import Template from '../components/core/HomePage/Template'
import logingimg from '../assets/girl.png'

const Login = ({setIsLoggedIn}) => {
  return (
    <Template
      title="Welcome Back"
      desc1="Build skills for today, tomorrow and beyond."
      desc2="Education is future proof your carrer."
      image={logingimg}
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Login
