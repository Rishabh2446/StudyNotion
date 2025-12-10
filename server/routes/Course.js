const express = require("express");
const router = express.Router();

// import controllers for categories
const {createCategory,
    showAllCategory,
    categoryPageDetails
} = require("../controllers/Category");

// import controllers for courses
const {createCourse,
    showAllCourses,
    getCourseDetails,
    isEnrolled,
    deleteCourse,
    markVideoCompleted,
    getCourseProgress
} = require("../controllers/Course");

// import controllers for ratingAndReview ->
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// import controllers for section
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// import controllers for sub-section
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const { getInstructorCourses, getCourseById } = require("../controllers/Course");

// middleware 
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// routes for categories
router.post("/createCategory",auth, isInstructor, createCategory);
router.get("/showAllCategory", showAllCategory);
router.post("/categoryPageDetails", categoryPageDetails);

// routes for courses
router.post("/createCourse",auth, isInstructor, createCourse);
router.get("/showAllCourses", showAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.get("/is-enrolled/:courseId", auth, isStudent, isEnrolled);
router.delete("/deleteCourse/:courseId", auth, isInstructor, deleteCourse);
router.post("/mark-completed", auth, isStudent, markVideoCompleted);
router.get("/progress/:courseId", auth, isStudent, getCourseProgress);




// add rating & review (only logged-in users allowed)
router.post("/addRating", auth, createRating);

// get average rating of a course
router.get("/getAverageRating/:courseId", getAverageRating);

// get all reviews (no auth needed, public)
router.get("/getAllReviews", getAllRating);

// routes for sections
router.post("/create-section", auth, isInstructor, createSection);
router.post("/update-section", auth, isInstructor, updateSection);
router.delete("/delete-section", auth, isInstructor, deleteSection);

// routes for sun-sections
router.post("/create-subsection", auth, isInstructor, createSubSection);
router.post("/update-subsection", auth, isInstructor, updateSubSection);
router.delete("/delete-subsection", auth, isInstructor, deleteSubSection);

router.get("/getCourse/:id", getCourseById);


module.exports = router;
