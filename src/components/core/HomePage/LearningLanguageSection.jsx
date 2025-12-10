import React from 'react'
import HighlightText from "./HighlightText";
import Know_Your_Progress from "../../../assets/knowYourProgress.png"
import Compare_With_Others from "../../../assets/CompareWithOthers.png"
import Plan_Your_lessons from "../../../assets/planYourLessions.png"
import CTAButton from "./Button"

const LearningLanguageSection = () => {
  return (
    <div className='mt-[150px]'>
      <div className='flex flex-col gap-5 items-center'>

         <div className='text-4xl font-semibold text-center '>
          Your Swiss Knife for
          <HighlightText text={" learning any language "}/>
         </div>

         <div className='text-center text-richblack-700 mx-auto text-base w-[70%] font-medium mt-10'>
          Using spin making learning multiple language easy, with 20+ languages realistic voice-over,
          peogress tracking, custom schedule and more. 
         </div>

         <div className='flex flex-row items-center justify-between mt-12 '>
           <img
            src={Know_Your_Progress}
            alt='knowYourProgress'
            className='w-[230px] h-[300px] rotate-12 shadow-lg z-10 ml-32 '
           />

           <img
            src={Compare_With_Others}
            alt='compareWithOthers'
            className='h-[300px] shadow-xl z-20 -mt-5 -rotate-12 mr-36 '
           />

           <img
            src={Plan_Your_lessons}
            alt='planYourLessons'
            className='w-[250px] rotate-12 shadow-lg z-10  mr-32 -ml-36'
           />
         </div>

         <div className='flex items-center mt-12 mb-6'>
          <CTAButton active={true} linkto={"/signup"}>
             <div>
              Learn More
             </div>
          </CTAButton>

         </div>
      </div>
    </div>
  )
}

export default LearningLanguageSection