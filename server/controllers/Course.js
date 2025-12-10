const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");


// CreateCourse ka handler function
exports.createCourse = async(req, res)=>{
    try{
        // fetch data 
        const {courseName, courseDescription, whatYouWantLearn, price, category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWantLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All feilds are required.",
            })
        }

        // check for instructor
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing in token",
        });
    }
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);

        // TODO: Verify that userId and instructorDetails._id are same or different  

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details not found",
            })
        }

        // validation of tag
        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"Category Details not found",
            })
        }
        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWantLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        // add the new course to the schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        )

        // update the tag schema
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        )
        return res.status(200).json({
            success:true,
            message:"Course created successfully!",
            data:newCourse,
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Failed to create cousre",
        })
    }
};



// getAllCourse ka handler function
exports.showAllCourses = async(req, res)=>{
    try{
        const allCourses = await Course.find({}, {
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:"Course data fetched successfully",
            data:allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Can not fetch course data",
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName email image",
        },
      })

      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails || courseDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No course found with ID ${courseId}`,
      });
    }

    const course = courseDetails[0];

    // 📌 Calculate Meta Details
    const numberOfSections = course.courseContent.length;

    let totalLectures = 0;
    let totalDuration = 0;

    course.courseContent.forEach(section => {
      section.subSection.forEach(sub => {
        totalLectures++;
        totalDuration += Number(sub.timeDuration || 0);
      });
    });

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;

    let formattedDuration = "";

    if (hours > 0) formattedDuration += `${hours}h `;
    if (minutes > 0) formattedDuration += `${minutes}m `;
    if (seconds > 0) formattedDuration += `${seconds}s`;

    // In case everything is 0
    if (formattedDuration.trim() === "") {
      formattedDuration = "0s";
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully!",
      courseDetails: courseDetails,
      meta: {
        numberOfSections,
        totalLectures,
        totalDuration: formattedDuration.trim()
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get courses created by logged-in instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await Course.find({ instructor: instructorId })
      .populate("category")
      .exec();

    return res.status(200).json({
      success: true,
      courses,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
    });
  }
};

exports.isEnrolled = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const enrolled = user.enrolledCourses.includes(courseId);

    return res.json({ success: true, enrolled });
  } 
  catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    console.log("GET COURSE BY ID HIT:", req.params.id);

    const course = await Course.findById(req.params.id)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("category")
      .populate("instructor")
      .exec();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {
    console.log("Error in getCourseById:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("courseContent")
      .populate("category");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 1️⃣ Delete all subsections
    for (const section of course.courseContent) {
      await SubSection.deleteMany({ _id: { $in: section.subSection } });
    }

    // 2️⃣ Delete all sections
    await Section.deleteMany({ _id: { $in: course.courseContent } });

    // 3️⃣ Remove course from instructor
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });

    // 4️⃣ Remove course from category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { courses: courseId },
    });

    // 5️⃣ Delete actual course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully!",
    });

  } catch (error) {
    console.log("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};



exports.markVideoCompleted = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    // Check if progress exists
    let progress = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        courseID: courseId,
        userID: userId,
        completedVideos: [subSectionId],
      });
    } else {
      if (!progress.completedVideos.includes(subSectionId)) {
        progress.completedVideos.push(subSectionId);
      }
      await progress.save();
    }

    res.status(200).json({
      success: true,
      completedVideos: progress.completedVideos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to save progress" });
  }
};


exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progress = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    res.status(200).json({
      success: true,
      completedVideos: progress ? progress.completedVideos : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching progress" });
  }
};
