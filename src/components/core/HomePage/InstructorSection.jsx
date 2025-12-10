import React from 'react'
import InstructorImage from "../../../assets/instructorImage.jpg"
import HighlightText from './HighlightText'
import CTAButton from './Button'
import {FaArrowRight} from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-14 w-11/12'>
        <div className='flex flex-row gap-20 items-center'>
           
           <div className='w-[50%]'>
              <img
                src={InstructorImage}
                alt='InstructorImage'
                
              />
           </div>

           <div className='flex flex-col gap-10 w-[50%]'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an
                    <HighlightText text={"Instructor"}/>
                </div>

                <p className='font-md text-[16px] w-[80%] text-richblack-200'>
                    Instructor from arround the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex flex-row gap-2 items-center'>
                        Start learning today
                        <FaArrowRight/>
                        </div>
                    </CTAButton>
                </div>

            </div>

        </div>
    </div>
  )
}

export default InstructorSection