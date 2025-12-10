const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.updateProfile = async (req, res)=>{
    try{
        //get data
        const { firstName, lastName, dateOfBirth="", about="", contactNumber, gender} = req.body;

        //getuserId
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        //find profile
        const userDetails = await User.findById(id);

        if (firstName) userDetails.firstName = firstName;
        if (lastName) userDetails.lastName = lastName;
        await userDetails.save();


        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }


        //updateProfile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        await profileDetails.save();

        // Return updated user with profile populated
        const updatedUser = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            updatedUser,
        });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Profile could not updated",
        });
    }
}

// delete account handler
// explore -> How can we schedule this deletion operation & cronjob
exports.deleteAccount = async(req, res)=>{
    try{
        console.log("req.user from token:", req.user);
        //get id
        const id = req.user.id;
         console.log("User id from token:", id);
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found",
            });
        }
        //delete profile
        const profileDetails = await Profile.findByIdAndDelete(userDetails.additionalDetails);
        
        // unenroll user from all enroll courses
        await Course.updateMany(
            {studentsEnrolled:id},
            {
                $pull:{
                    studentsEnrolled:id
                }
            }
        );
        //delete user
        await User.findByIdAndDelete(id);
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully",
            profileDetails,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Profile could not deleted successfully",
            error: error.message,
        });
    }
};

// get all details of user
exports.getAllUserDetails = async (req, res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            userDetails,
        });
        

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Couold not fetch user details!",
        });
    }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "enrolledCourses",
        populate:[
          {
            path: "instructor",
            select: "firstName lastName"
          },
          {
            path: "category",
            select: "name"
          },
          {
            path: "courseContent",
            populate: {
              path: "subSection",
              select: "_id"
            }
          }
        ]
      })
      .exec();

      if(!user){
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      const finalCourses = [];
      for(const course of user.enrolledCourses){

        // count total videos
        let totalVideos = 0;
        course.courseContent.forEach(section => {
          totalVideos += section.subSection.length;
        });

        // check complete videos
        const progress = await CourseProgress.findOne({
          userID: userId,
          courseID: course._id,
        });

        const completedVideos = progress?.completedVideos?.length || 0;

        // calculate percentage
        const percentage = totalVideos === 0 ? 0: Math.round((completedVideos / totalVideos) * 100);

        //push final course
        finalCourses.push({
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          category: course.category,
          progress: percentage,
        });
      }
      

    return res.status(200).json({
      success: true,
      courses: finalCourses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch enrolled courses",
    });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("purchaseHistory");

    return res.json({
      success: true,
      purchases: user.purchaseHistory,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};


// --- UPDATE PROFILE PICTURE ---
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const image = req.files.displayPicture;

    // Upload to Cloudinary
    const uploadResponse = await uploadImageToCloudinary(image, "StudyNotion");

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadResponse.secure_url },
      { new: true }
    ).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.log("Error uploading profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
    });
  }
};
