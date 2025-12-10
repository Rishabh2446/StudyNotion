import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.profile.user);

  const fetchInstructorData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/course/getInstructorCourses",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        const data = res.data.courses;

        // Store courses
        setCourses(data);

        // Calculate stats
        const totalCourses = data.length;

        const totalStudents = data.reduce(
          (sum, c) => sum + (c.studentsEnrolled?.length || 0),
          0
        );

        const totalEarnings = data.reduce(
          (sum, c) => sum + (c.studentsEnrolled?.length || 0) * c.price,
          0
        );

        const allRatings = data.flatMap((c) =>
          c.ratingAndReviews ? c.ratingAndReviews.map((r) => r.rating) : []
        );
        const averageRating =
          allRatings.length > 0
            ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
            : 0;

        setStats({
          totalCourses,
          totalStudents,
          totalEarnings,
          averageRating,
        });
      }

      setLoading(false);
    } catch (error) {
      console.log("Dashboard Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  if (loading) {
    return <p className="text-white text-center text-xl">Loading Dashboard...</p>;
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Hi {user.firstName} 👋</h2>
        <p className="text-gray-400">Here’s what’s happening with your courses</p>
      </div>

      <div className="">
      {/* Stats Cards */}
        <div className="grid grid-col-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Courses" value={stats.totalCourses} />
          <StatCard title="Students Enrolled" value={stats.totalStudents} />
          <StatCard title="Total Earnings" value={`₹${stats.totalEarnings}`} />
          
        </div>
        <div>
          <InstructorChart courses={courses}/>
        </div>
        
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold mb-4">Your Courses</h3>
        <Link to={"/dashboard/courses"}> View All</Link>
        </div>

        {courses.length === 0 ? (
          <div>
            <p className="text-gray-400">You have not created any courses yet.</p>
            <Link to={"/dashboard/courses"}>
             Create a Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.slice(0,3).map((course) => {
              const avgRating = course.ratingAndReviews?.length
                ? (
                    course.ratingAndReviews.reduce((sum, r) => sum + r.rating, 0) /
                    course.ratingAndReviews.length
                  ).toFixed(1)
                : "0";

              return (
                <CourseCard
                  key={course._id}
                  title={course.courseName}
                  thumbnail={course.thumbnail}
                  students={course.studentsEnrolled?.length || 0}
                  rating={avgRating}
                  price={`₹${course.price}`}
                />
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
    <h4 className="text-sm text-gray-400">{title}</h4>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const CourseCard = ({ title, students, rating, price, thumbnail }) => (
  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <img
      src={thumbnail}
      alt="Course Thumbnail"
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400 mb-1">👨‍🎓 {students} Students</p>
      <p className="text-sm text-gray-400 mb-3">⭐ {rating} | 💰 {price}</p>
      
    </div>
  </div>
);

export default InstructorDashboard;
