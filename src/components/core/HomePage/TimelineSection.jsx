import React from 'react'
import Logo1 from "../../../assets/logo1.svg"
import Logo2 from "../../../assets/logo2.svg"
import Logo3 from "../../../assets/logo3.svg"
import Logo4 from "../../../assets/logo4.svg"
import timelineImage from "../../../assets/timelineImage.jpg"

const timeline =[
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully commited to the success company"
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority"
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability of is switch an inportant skill"
  },
  {
    Logo: Logo4,
    Heading: "Solve the problem",
    Description: "Code your way to a solution"
  },
];


const TimelineSection = () => {
  return (
    <div>
      <div className='flex flex-row gap-12 items-center'>
        
        <div className='w-[45%] flex flex-col gap-12'>
          {
             timeline.map( (element, index) => {
               return(
                <div key={index}  className={`flex flex-row gap-6 pb-4 ${
                   index !== timeline.length - 1 ? "border-b-2 border-dotted border-gray-400" : ""
                   }`} >
                   
                   <div className=' w-[40px] h-[40px] bg-white flex items-center'>
                      <img src={element.Logo} alt='logo'/>

                      
                   </div>

                   <div className='flex flex-col'>
                    <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                    <p className='text-base'>{element.Description}</p>
                   </div>
                </div>
               )
             })
          }
        </div>

        <div className='relative shadow-blue-200 w-[60%]'>
          <img src={timelineImage} alt='timelineImage'
            className='shadow-white object-cover h-fit'
          />

          {/* green section */}
          <div className='absolute bg-caribbeangreen-800 flex flex-row text-white uppercase py-6 
                 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            <div className='flex flex-row gap-5 items-center border-r px-7 border-caribbeangreen-300'>
              <p className='text-3xl font-bold'>10</p>
              <p className='text-sm text-caribbeangreen-300'>Years of Experience</p>
            </div>

            <div className='flex gap-5 items-center px-7'>
              <p className='text-3xl font-bold'>250</p>
              <p className='text-sm text-caribbeangreen-300'>Type of courses</p>
            </div>
            
          </div>
        </div>

        

      </div>
    </div>
  )
}

export default TimelineSection