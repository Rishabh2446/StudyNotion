import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../../slices/cartSlice";
import { resetCart } from "../../../slices/cartSlice";

const EnrolledCourses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const courseId = new URLSearchParams(location.search).get("courseId");

  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();

  // 1️⃣ ENROLL AFTER STRIPE REDIRECT — ONLY ONCE (FIXED)
const hasEnrolledRef = useRef(false);

useEffect(() => {
  if (hasEnrolledRef.current) return; // ⛔ Prevent second execution
  hasEnrolledRef.current = true;

  const params = new URLSearchParams(location.search);
  const coursesFromQuery = params.get("courses");

  if (!coursesFromQuery) return;

  const courseIds = JSON.parse(decodeURIComponent(coursesFromQuery));
  console.log("📌 Stripe returned with courses:", courseIds);

  enrollUser(courseIds).then(() => {
    toast.success("Enrollment Successful!");
    if (localStorage.getItem("cartCheckout")) {
      dispatch(resetCart());
      localStorage.removeItem("cartCheckout");
    }


    // Remove query params so useEffect does NOT re-trigger
    window.history.replaceState({}, "", "/dashboard/enrolled-courses");
  });

}, []);


  async function enrollUser(courseIds) {
  try {
    const res = await fetch(
      "http://localhost:4000/api/v1/payment/verify-and-enroll",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courses: courseIds }),
      }
    );

    const data = await res.json();
    console.log("Enrollment Response:", data);

    return fetchEnrolledCourses();
  } catch (err) {
    console.log("Enrollment Error:", err);
  }
}


  // 2️⃣ LOAD ENROLLED COURSES INITIALLY
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  async function fetchEnrolledCourses() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/profile/enrolled-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("Enrolled Courses:", data);

      setCourses(data.courses || []);
    } catch (error) {
      console.log("❌ Fetch Error:", error);
    }
  }

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Enrolled Courses
      </h1>

      {courses.length === 0 ? (
        <p>No enrolled courses found.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/view-course/${course._id}`)}
              style={{
                background: "#1a1a1a",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                display: "flex",
                gap: "15px",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <div className="flex gap-4">
                <img
                src={course.thumbnail}
                style={{ width: "120px", borderRadius: "8px" }}
              />
              <div>
                <h2 style={{ fontSize: "20px" }}>{course.courseName}</h2>
                <p style={{ opacity: 0.7 }}>
                  {course.courseDescription.substring(0, 100)}...
                </p>
              </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                  Progress: {course.progress}%
                </p>

                <div
                  style={{
                    width: "120px",
                    height: "8px",
                    background: "#333",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${course.progress}%`,
                      height: "100%",
                      background: "#00ff9d",
                    }}
                  />
                  </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
