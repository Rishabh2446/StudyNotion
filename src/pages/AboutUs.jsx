import React from "react";
import about1 from '../assets/about1.jpg';
import about2 from '../assets/about2.jpg';
import about3 from '../assets/about3.webp';
import about4 from '../assets/about4.jpg';
import CTAButton from '../components/core/HomePage/Button';
import ReviewSlider from "../components/core/HomePage/common/ReviewSlider";
import Footer from "../components/core/HomePage/common/Footer";


const AboutUs = () => {
  return (
    <div>
      <div className="bg-richblack-900 text-white mx-auto flex flex-col w-11/12 items-center justify-between max-w-7xl gap-28 py-12">
      {/* Section Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Driving Innovation in Online Education for a{" "}
          <span className="text-blue-400">Brighter Future</span>
        </h1>
        <p className="mt-4 text-richblack-200 max-w-3xl mx-auto">
          StudyNotion is at the forefront of driving innovation in online
          education. We’re passionate about creating a brighter future by
          offering cutting-edge courses, leveraging emerging technologies, and
          nurturing a vibrant learning community.
        </p>
      </div>

      {/* Images Section */}
      <div className="flex flex-col md:flex-row justify-center gap-6 px-6 md:px-20">
        <img
          src={about1}
          alt="Student 1"
          className="rounded-lg shadow-lg w-full md:w-1/3 object-cover"
        />
        <img
          src={about2}
          alt="Student 2"
          className="rounded-lg shadow-lg w-full md:w-1/3 object-cover"
        />
        <img
          src={about3}
          alt="Student 3"
          className="rounded-lg shadow-lg w-full md:w-1/3 object-cover"
        />
      </div>

      {/* Mission Statement */}
      <div className="text-center py-16 px-6 max-w-4xl mx-auto">
        <p className="text-lg md:text-xl italic text-richblack-100">
          “ We are passionate about revolutionizing the way we learn. Our
          innovative platform{" "}
          <span className="text-blue-400">combines technology</span>,{" "}
          <span className="text-yellow-400">expertise</span>, and community to
          create an{" "}
          <span className="text-orange-400">
            unparalleled educational experience.
          </span>
          ”
        </p>
      </div>

      {/* Founding Story */}
      <div className="flex flex-col md:flex-row items-center gap-10 px-6 md:px-20 py-16">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Our Founding Story
          </h2>
          <p className="text-richblack-200">
            Our e-learning platform was born out of a shared vision and passion
            for transforming education. It all started with a simple idea: to
            make high-quality learning accessible to anyone, anywhere. As
            educators and learners ourselves, we understood the challenges
            people face in accessing traditional education. Fueled by the belief
            in the power of technology to bridge gaps, we embarked on this
            journey to build a platform that empowers learners from all walks of
            life.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={about4}
            alt="Founding Story"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-20 py-16">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Our Vision</h2>
          <p className="text-richblack-200">
            With our vision in mind, we set out on a journey to create a dynamic
            and engaging e-learning platform that transcends geographical
            boundaries and connects learners from all corners of the globe. Our
            vision is to empower individuals to unlock their full potential and
            become lifelong learners.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Our Mission</h2>
          <p className="text-richblack-200">
            Our mission goes beyond just delivering courses online. We wanted to
            create a vibrant community of learners, where collaboration and
            knowledge-sharing thrive. We believe that learning is not a solitary
            journey but a collaborative adventure that is enriched by connecting
            with others who share similar passions.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-16 px-6 md:px-20 bg-richblack-800 w-full">
        <div>
          <h3 className="text-3xl font-bold text-blue-400">5K+</h3>
          <p className="text-richblack-200">Active Students</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-yellow-400">10+</h3>
          <p className="text-richblack-200">Mentors</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-orange-400">200+</h3>
          <p className="text-richblack-200">Courses</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-red-400">50+</h3>
          <p className="text-richblack-200">Awards</p>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20 px-6 md:px-20 items-center">
        {/* Left Side */}
        <div className="flex items-start flex-col">
          <h2 className="text-3xl font-bold">
            World-Class Learning for{" "}
            <span className="text-blue-400">Anyone, Anywhere</span>
          </h2>
          <p className="mt-4 text-richblack-200 mb-6">
            StudyNotion partners with more than 275+ leading universities and
            companies to bring flexible, affordable, job-relevant online
            learning to individuals and organizations worldwide.
          </p>
          <CTAButton linkto={"/signup"} active={true}
          className="mt-20 bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-300 transition inline-block">
            Learn More
          </CTAButton>
        </div>

        {/* Right Side - Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-richblack-800 p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Curriculum Based on Industry Needs</h3>
            <p className="text-richblack-300 text-sm">
              Save time and money! The StudyNotion curriculum is tailored to
              industry skills and needs.
            </p>
          </div>
          <div className="bg-richblack-800 p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Our Learning Methods</h3>
            <p className="text-richblack-300 text-sm">
              The learning process uses a mix of online and offline methods.
            </p>
          </div>
          <div className="bg-richblack-800 p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Certification</h3>
            <p className="text-richblack-300 text-sm">
              Earn certificates that can boost your career opportunities.
            </p>
          </div>
          <div className="bg-richblack-800 p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Rating “Auto-grading”</h3>
            <p className="text-richblack-300 text-sm">
              Get instant feedback during learning, no delays from mentors.
            </p>
          </div>

          <div className="bg-richblack-800 p-6 rounded-lg shadow col-span-2">
            <h3 className="font-bold text-lg mb-2">Ready to Work</h3>
            <p className="text-richblack-300 text-sm">
              Connected with 150+ hiring partners, giving you job opportunities
              after graduation.
            </p>
          </div>

        </div>
      </div>
      <div className='w-full mx-auto max-w-5xl flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white first-letter'>

           <h2 className='text-center text-4xl font-semibold mt-10'> review from other learner</h2>
           {/* review slider here */}
           <ReviewSlider/>
        </div>
      
    </div>
    <Footer/>
    </div>

        
    
  


    
  );
};

export default AboutUs;
