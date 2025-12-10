import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import video1 from "../assets/video1.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from '../components/core/HomePage/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/core/HomePage/common/ReviewSlider';

const Home = () => {
  return (
    <div>
        {/* section1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-max'>

          <Link to={"/signup"}>
              <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
              transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[15px]
                transition-all duration-200 group-hover:bg-richblack-900 '>
                  <p>Become an Instructor</p>
                  <FaArrowRight />
                </div>
              </div>
          </Link>

          <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future With 
            <HighlightText text={"Coding Skills"}/>
          </div>

          <div className='mt-4 max-w-7xl w-[90%] text-center text-lg font-medium text-richblack-200'>
            With our online coding courses, you can learn at your own space, from anywhere in the world, and get access to a wealth of resourses, including hands-on projects, quizzes, and personalized feedback from Instructors.
          </div>

          <div className='flex flex-row gap-7 mt-8'>
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>

              <CTAButton active={false} linkto={"/login"}>
                Book a Demo
              </CTAButton>

          </div>

          <div className=' w-3/4 mx-auto my-12'>
            <video muted loop autoPlay className='mx-3 my-12 rounded-medium drop-shadow-[-12px_-12px_30px_rgba(59,130,246,0.4)]'>
              <source src={video1} type="video/mp4"/>
            </video>

            {/* codesection1 */}
            <div>
              <CodeBlocks
                position={"lg:flex-row"}
                heading={
                  <div className='text-4xl font-semibold'>
                    Unlock Your
                    <HighlightText text={"Coding Potential"}/>
                    With Our Online Courses
                  </div>
                }
                subheading={
                  "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }

                ctabtn1={
                  {
                    btnText: "try it yourself",
                    linkto: "/signup",
                    active:true,
                  }
                }
                ctabtn2={
                  {
                    btnText: "learn more",
                    linkto: "/login",
                    active:false,
                  }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\n<head>\n<title>Basic Page</title>\n</head>\n<body>\n<h1>Hello World!</h1>\n<p>This is a basic HTML page.</p>\n</body>\n</html>`}
                codeColor={"text-yellow-50"}
              />
            </div>

            {/* codesection2 */}
            <div>
              <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                  <div className='text-4xl font-semibold'>
                    Unlock Your
                    <HighlightText text={"Coding Potential"}/>
                    With Our Online Courses
                  </div>
                }
                subheading={
                  "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }

                ctabtn1={
                  {
                    btnText: "try it yourself",
                    linkto: "/signup",
                    active:true,
                  }
                }
                ctabtn2={
                  {
                    btnText: "learn more",
                    linkto: "/login",
                    active:false,
                  }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\n<head>\n<title>Basic Page</title>\n</head>\n<body>\n<h1>Hello World!</h1>\n<p>This is a basic HTML page.</p>\n</body>\n</html>`}
                codeColor={"text-yellow-50"}
              />
            </div>

          </div>
            
          <ExploreMore/>
          

            
        </div>

        


        {/* section2 */}
        <div className='text-richblack-700 bg-pure-greys-5'>
          
          <div className='homepage_bg h-[310px]'>
             
             <div className='w-11/12 max-w-max flex flex-col items-center justify-between gap-5 mx-auto'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white'>

                   <CTAButton active={true} linkto={"/signup"}>
                     <div className='flex items-center gap-3'>
                      Explore Full Catelog
                      <FaArrowRight/>
                     </div>
                   </CTAButton>

                   <CTAButton active={false} linkto={"/signup"}>
                     <div>
                       Learn More
                     </div>
                   </CTAButton>

                </div>
             </div>
          </div>

          <div className='mx-auto  w-3/4  my-12  flex flex-col items-center justify-between gap-7'>
            
            <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                <div className='text-4xl font-semibold w-[45%]'>
                  Get the skills you need for a
                  <HighlightText text={"Job that is in demand"}/>
                </div>

                <div className='flex flex-col gap-10 w[40%] items-start'>
                  <div>
                    The modern StudyNotion is the dictates its own terms. Today to be a competitve
                    specialist require more than professional skills.
                  </div>
                  <CTAButton active={true} linkto={"/signup"}>
                      <div>
                        Learn More
                      </div>
                  </CTAButton>
                </div> 
            </div>

            <TimelineSection/>

            <LearningLanguageSection/>
            
          </div>
        </div>


        {/* section3 */}
        <div className='w-3/4 mx-auto max-w-max flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white first-letter'>
           <InstructorSection/>

           <h2 className='text-center text-4xl font-semibold mt-10'> review from other learner</h2>
           {/* review slider here */}
           <ReviewSlider/>
        </div>

        {/* footer */}
        <Footer/>
    </div>
  )
}

export default Home