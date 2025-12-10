import React from "react";
import { Link } from "react-router-dom";

const CatalogCourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course._id}`}>
      <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-4 hover:scale-105 transition-all duration-200">
        
        {/* Thumbnail */}
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="w-full h-40 object-contain rounded-md"
        />

        {/* Course Title */}
        <h3 className="text-lg font-bold mt-3">{course.courseName?.slice(0,30)}...</h3>

        {/* Description */}
        <p className="text-sm text-richblack-300 mt-1">
          {course.courseDescription?.slice(0, 30)}...
        </p>

        {/* Instructor */}
        <p className="text-sm text-richblack-400 mt-2">
          By <span className="text-yellow-300 font-semibold">{course.instructor?.firstName}</span>
        </p>

        {/* Price */}
        <p className="text-lg font-bold text-yellow-300 mt-3">₹{course.price}</p>

      </div>
    </Link>
  );
};

export default CatalogCourseCard;
