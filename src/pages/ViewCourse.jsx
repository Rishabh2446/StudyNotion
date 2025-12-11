import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import AddReviewModal from "../components/core/HomePage/AddReviewModal";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;



const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // STATE (always at top)
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentSection, setCurrentSection] = useState(0);
  const [currentSub, setCurrentSub] = useState(0);

  const [openSection, setOpenSection] = useState(null);

  const videoRef = useRef(null);
  const [videoCompleted, setVideoCompleted] = useState(false);

  const [completedSet, setCompletedSet] = useState(new Set());
  const [completedCount, setCompletedCount] = useState(0);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));


  // ---------------------------
  // 1️⃣ Fetch course on load
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${BASE_URL}/api/v1/course/getCourse/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.success) {
          navigate("/dashboard/enrolled-courses");
          return;
        }

        setCourse(res.data.data);
      } catch (err) {
        console.log("Fetch error:", err);
        navigate("/dashboard/enrolled-courses");
      }

      setLoading(false);
    };

    if (courseId) fetchData();
  }, [courseId, navigate]);


  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/v1/course/progress/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          const completed = new Set(res.data.completedVideos);
          setCompletedSet(completed);
          setCompletedCount(completed.size);
        }
      } catch (error) {
        console.log("Progress fetch error:", error);
      }
    };

    fetchProgress();
  }, [courseId]);

  const handleSaveReview = async () => {
  if (rating === 0) {
    alert("Please give a rating.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/v1/course/addRating`,
      {
        rating,
        review,
        courseId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Review submitted!");
      setShowReviewModal(false);
      setReview("");
      setRating(0);
    }
  } catch (error) {
    console.log(error);
    alert("Could not submit review.");
  }
};


  // ---------------------------
  // 2️⃣ Reset video when lecture changes
  // ---------------------------
  useEffect(() => {
    if (videoRef.current) {
      setVideoCompleted(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentSection, currentSub]);

  // ---------------------------
  // 3️⃣ SAFE DATA GUARDS
  // ---------------------------
  const sections =
    Array.isArray(course?.courseContent) ? course.courseContent : [];

  const totalLectures = sections.reduce((acc, sec) => {
    return acc + (Array.isArray(sec.subSection) ? sec.subSection.length : 0);
  }, 0);

  const hasValidCurrent =
    sections.length > 0 &&
    sections[currentSection] &&
    sections[currentSection].subSection &&
    sections[currentSection].subSection[currentSub];

  // ---------------------------
  // ❗ RETURN LOADING UI
  // ---------------------------
  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  // ❗ RETURN EMPTY COURSE UI
  if (!course) {
    return <div className="text-white p-6">Course not found.</div>;
  }

  if (!hasValidCurrent) {
    return (
      <div className="text-white p-6">
        <h2 className="text-xl font-semibold">{course.courseName}</h2>
        <p className="text-gray-300 mt-2">
          This course has no video content yet.
        </p>
      </div>
    );
  }

  const currentVideo =
    sections[currentSection].subSection[currentSub];

  // ---------------------------
  // 4️⃣ VIDEO HANDLERS
  // ---------------------------
  const handleVideoEnded = async () => {
    setVideoCompleted(true);

    const subSectionId = currentVideo._id;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/api/v1/course/mark-completed`,
        {
          courseId,
          subSectionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const set = new Set(res.data.completedVideos);
        setCompletedSet(set);
        setCompletedCount(set.size);
      }
    } catch (err) {
      console.log("Save progress error:", err);
    }
  };


  const handleRewatch = () => {
    setVideoCompleted(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const goNext = () => {
    let nextSub = currentSub + 1;
    let nextSec = currentSection;

    const subs = sections[currentSection].subSection;

    if (nextSub >= subs.length) {
      nextSub = 0;
      nextSec++;

      if (nextSec >= sections.length) {
        toast.success("You completed the course!");
        return;
      }
    }

    setCurrentSection(nextSec);
    setCurrentSub(nextSub);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 210);

    setVideoCompleted(false);
  };

  // ---------------------------
  // 5️⃣ UI RETURN
  // ---------------------------
  return (
    <>
      {/* REVIEW MODAL */}
    {showReviewModal && (
      <AddReviewModal
        user={user}
        rating={rating}
        setRating={setRating}
        review={review}
        setReview={setReview}
        onClose={() => setShowReviewModal(false)}
        onSave={handleSaveReview}
      />
    )}

      <div className="flex h-screen bg-black text-white">
      {/* LEFT SIDEBAR */}
      <div className="w-[22%] bg-[#111827] border-r border-gray-700 p-4 flex flex-col">
        <div className="flex justify-between">
          <button
          onClick={() => navigate(-1)}
          className="text-white text-xl mb-4"
          >
          <FaRegArrowAltCircleLeft />
          </button>
          <button onClick={() => setShowReviewModal(true)}
          className="text-black bg-yellow-400 rounded-md py-3 px-4 font-semibold">Add Review</button>
        </div>

        <h2 className="font-semibold text-lg mb-1 mt-3">{course.courseName}</h2>

        <p className="text-yellow-400 text-sm mb-4">
          {completedCount}/{totalLectures} completed
        </p>

        {/* Accordion Sidebar */}
        <div className="overflow-y-auto">
          {sections.map((sec, sIndex) => {
            const isOpen = openSection === sIndex;

            return (
              <div key={sec._id || sIndex} className="mb-2">
                {/* Section Header */}
                <div
                  className="bg-gray-700 px-3 py-2 rounded-t flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setOpenSection(isOpen ? null : sIndex)
                  }
                >
                  <span>{sec.sectionName}</span>
                  {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </div>

                {/* Subsections */}
                {isOpen &&
                  sec.subSection?.map((sub, subIndex) => {
                    const key = sub._id;
                    const active =
                      currentSection === sIndex &&
                      currentSub === subIndex;

                    return (
                      <div
                        key={sub._id || key}
                        className={`px-3 py-2 flex justify-between cursor-pointer ${
                          active
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-800 hover:bg-gray-600"
                        }`}
                        onClick={() => {
                          setCurrentSection(sIndex);
                          setCurrentSub(subIndex);
                          setVideoCompleted(false);

                          setTimeout(() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              videoRef.current
                                .play()
                                .catch(() => {});
                            }
                          }, 200);
                        }}
                      >
                        <span>{sub.title}</span>
                        {completedSet.has(sub._id) && <span>✓</span>}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT VIDEO AREA */}
      <div className="w-[78%] flex flex-col items-center">
        <div className="relative w-full h-[80%]">
          <video
            controls
            ref={videoRef}
            key={currentVideo.videoUrl}
            src={currentVideo.videoUrl}
            className="w-full h-full bg-black"
            onEnded={handleVideoEnded}
            onPlay={() => setVideoCompleted(false)}
          />

          {videoCompleted && (
            <div className="absolute inset-0 flex justify-center items-center gap-4">
              <button
                onClick={handleRewatch}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
              >
                Rewatch
              </button>

              <button
                onClick={goNext}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold border border-white"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="w-full p-4">
          <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
          <p className="text-gray-300 mt-2">{currentVideo.description}</p>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ViewCourse;
