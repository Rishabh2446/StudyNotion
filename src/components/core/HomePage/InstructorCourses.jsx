import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/course/getInstructorCourses`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setCourses(res.data.courses);
      }
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (courseId) => {
  if (!window.confirm("Are you sure you want to delete this course?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `${BASE_URL}/api/v1/course/deleteCourse/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      toast.success(res.data.message);
      fetchCourses(); // refresh list
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete course");
    }
  };


  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-richblack-300">You have not created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-richblack-800 border border-richblack-700 p-4 rounded-xl"
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded-lg"
              />

              <h3 className="mt-3 text-xl font-semibold">
                {course.courseName?.slice(0, 30)}...
              </h3>

              <p className="text-sm text-richblack-300 mt-1">
                {course.courseDescription?.slice(0, 40)}...
              </p>

              <p className="mt-2 text-richblack-400">
                Category: <span className="text-yellow-300">{course.category?.name}</span>
              </p>

              <p className="font-bold text-yellow-300 mt-3 text-lg">
                ₹{course.price}
              </p>

              <p className="text-sm text-richblack-400 mt-1">
                Students Enrolled: {course.studentsEnrolled.length}
              </p>

              <div className="mt-4 flex gap-2">
                <button onClick={ () =>navigate(`/dashboard/edit-course/${course._id}`)}
                className="bg-yellow-400 text-black px-4 py-1 rounded-md font-semibold">
                  Edit
                </button>
                <button onClick={() => deleteCourse(course._id)}
                 className="bg-red-500 text-black px-4 py-1 rounded-md font-semibold">
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
