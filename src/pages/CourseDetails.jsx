/* global Cashfree */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import Footer from "../components/core/HomePage/common/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import toast from "react-hot-toast";

import { MdArrowDropDown } from "react-icons/md";


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.profile.user);
  const isInstructor = user?.accountType === "Instructor";
  const [meta, setMeta] = useState(null);


  const dispatch = useDispatch();

  // ⭐ ALL HOOKS AT TOP (NO CONDITIONS BEFORE THEM)
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false); 

  // ⭐ FETCH COURSE DETAILS
  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/course/getCourseDetails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setCourse(data.courseDetails[0]);
        setMeta(data.meta);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // ⭐ CHECK ENROLLMENT
  const checkEnrollment = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/course/is-enrolled/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAlreadyEnrolled(data.enrolled);
    } catch (error) {
      console.log("Check enrollment error:", error);
    }
  };

  // ⭐ RUN HOOKS ONCE
  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, []);

  // ⭐ BUY COURSE
  const buyCourse = async () => {
    if (!token) {
      toast.error("Please login to purchase this course!");
      navigate("/login");
      return;
    }
    
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/payment/create-stripe-session",
        {
          courseName: course.courseName,
          price: course.price,
          courseId: course._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.href = res.data.url;
    } catch (error) {
      console.log("Stripe Payment Error:", error);
    }
  };

  // ⭐ SAFE CONDITIONAL RENDER — AFTER ALL HOOKS
  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (!course) {
    return <p className="text-center text-white">Course not found.</p>;
  }

  const avgRating = course.ratingAndReviews?.length>0?(
    course.ratingAndReviews.reduce((sum, r) => sum + r.rating, 0)/
    course.ratingAndReviews.length
  ).toFixed(1)
  : 0;

  const ratingCount = course.ratingAndReviews?.length || 0;
  const studentCount = course.studentsEnrolled?.length || 0;

  const handleAddToCart = () =>{
    if(!token){
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(course));
  }

  return (
    <div>
      <div className="text-white w-11/12 max-w-6xl mx-auto py-10">
        {/* Breadcrumb */}
        <p className="text-richblack-300 text-sm">
          Home / {course.category?.name} /{" "}
          <span className="text-yellow-300">{course.courseName}</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-10 mt-5">

          {/* LEFT SECTION */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.courseName}</h1>
            <p className="mt-3 text-richblack-200">{course.courseDescription}</p>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-3">
              <AiFillStar className="text-yellow-300 text-xl" />
              <span>{avgRating}</span>
              <span className="text-richblack-300">({ratingCount} ratings)</span>
              <span className="text-richblack-300 ml-2">{studentCount} students</span>
            </div>

            {/* Instructor */}
            <p className="mt-2 text-sm">
              Created by{" "}
              <span className="text-yellow-300 font-semibold">
                {course.instructor.firstName} {course.instructor.lastName}
              </span>
            </p>

            <div className="mt-10 bg-richblack-800 p-6 rounded-lg border border-richblack-700">
              <h2 className="text-xl font-bold mb-3">What you'll learn</h2>
              <p className="text-richblack-200">{course.whatYouWantLearn}</p>
            </div>

            {/* Content */}
            <div className="mt-10">
            <h2 className="text-xl font-bold mb-2">Course content</h2>

            {meta && (
              <div className="flex gap-x-3 text-richblack-300 mb-3">
                <span>{meta.numberOfSections} section(s)</span>
                <span>{meta.totalLectures} lecture(s)</span>
                <span>{meta.totalDuration} total length</span>
              </div>
            )}

            <div className="space-y-3">
                {course.courseContent?.map((section) => (
                  <details
                    key={section._id}
                    className="group bg-richblack-800 border border-richblack-700 rounded-lg"
                  >
                    <summary className="cursor-pointer flex justify-between items-center px-4 py-3">
                      {/* Section Name */}
                      <div className="flex items-center gap-2">
                        <span className="text-md"><MdArrowDropDown /></span>
                      <span className="font-semibold text-white">{section.sectionName}</span>
                      </div>

                      {/* Lecture Count */}
                      <span className="text-yellow-300 text-sm">
                        {section.subSection.length} lecture(s)
                      </span>
                    </summary>

                    {/* Subsections */}
                    <ul className="px-6 py-2 space-y-2 text-richblack-200 bg-richblack-900">
                      {section.subSection.map((sub) => (
                        <li
                          key={sub._id}
                          className="flex justify-between items-center border-b border-richblack-700 pb-1"
                        >
                          {/* Subsection Title */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm"><MdArrowDropDown /></span>
                            <span className="text-sm font-medium">{sub.title}</span>
                          </div>

                          {/* Duration */}
                          <span className="text-xs text-yellow-300">
                            {sub.timeDuration ? `${sub.timeDuration}s` : "0s"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-14">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {ratingCount > 0 ? (
                course.ratingAndReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-richblack-800 p-4 rounded-lg border border-richblack-700"
                  >
                    <img
                      src={rev?.user?.image }
                      alt="user"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="font-semibold">{rev.user.firstName}</p>
                    <p className="text-richblack-300 text-sm mt-2">{rev.review}</p>

                    <div className="flex items-center gap-1 mt-3">
                      <AiFillStar className="text-yellow-300" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-richblack-300 col-span-3">No reviews yet.</p>
              )}
            </div>

          </div>
          </div>

          

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[320px] bg-richblack-800 p-4 rounded-lg border border-richblack-700 h-fit">
            <img
              src={course.thumbnail}
              className="w-full h-50 object-contain rounded-lg"
            />

            <p className="text-3xl font-bold mt-4">₹ {course.price}</p>

            {!alreadyEnrolled && !isInstructor && (
              <button onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded mt-3 cursor-pointer transition-all">
              Add to Cart
              </button>
            )}

            {alreadyEnrolled ? (
              <button
                onClick={() => navigate(`/view-course/${course._id}`)}
                className="bg-green-400 w-full py-2 text-black font-bold rounded mt-3"
              >
                Go to Course
              </button>
            ) : !isInstructor ?(
              <button
                onClick={buyCourse}
                className="bg-yellow-400 w-full py-2 text-black font-bold rounded mt-3"
              >
                Buy Now
              </button>
            ):(
              <p className="mt-3 text-yellow-400 font-semibold text-center">
                Instructors cannot purchase courses
              </p>
            )}

            <hr className="my-4 border-richblack-600" />

            <p className="text-sm text-richblack-200">This course includes:</p>
            <ul className="mt-2 text-sm text-richblack-300 space-y-1">
              <li>✓ Lifetime access</li>
              <li>✓ Certificate of completion</li>
              <li>✓ Access on mobile & TV</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetails;
