import React from 'react'
import Template from '../components/core/HomePage/Template'
import signupimg from '../assets/employees.png'


const Signup = ({setIsLoggedIn}) => {
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      desc1="Build skills for today, tomorrow and beyond."
      desc2="Education is future proof your carrer."
      image={signupimg}
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Signup
