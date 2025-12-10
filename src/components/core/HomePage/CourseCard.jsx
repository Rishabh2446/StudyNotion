import React from 'react'
import { FaSignal } from 'react-icons/fa6';
import { BsBook } from 'react-icons/bs';

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {

  const isActive = currentCard === cardData.heading;
  return (
    <div
    onClick={() => setCurrentCard(cardData.heading)}
    className='relative w-[280px] min-h-[280px] cursor-pointer h-fit'
    >
       

        <div 
        
        className={` relative  p-6 flex flex-col justify-between rounded-xl border 
                  ${isActive ? 'bg-white text-richblack-900 border-r-8 border-b-8 border-yellow-400' : 'bg-richblack-800 text-richblack-200 border-richblack-700'}
                  transition-all duration-300 hover:scale-105`}
                  
        >
          <h3 className='text-lg font-bold mb-2'>
            {cardData.heading}
          </h3>

          <p className='text-sm mb-4 text-richblack-200 '>
            {cardData.description?.slice(0,40)}..
          </p>

          {/* footer */}
          <div className='flex justify-between text-sm items-center border-t border-richblack-700 pt-2'>
            <div className='flex items-center gap-2'>
              <FaSignal className='text-yellow-500'/>
              <span>{cardData.level }</span>
            </div>

            <div className='flex items-center gap-2'>
              <BsBook className='text-yellow-500'/>
              <span>{cardData.lessonNumber}</span>
            </div>
          </div>

        </div>
    </div>
  )
}

export default CourseCard