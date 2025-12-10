const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res)=>{
    try{
        // fetch data
        const {sectionName, courseId} = req.body;

        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"<issing properties",
            })
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        )
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            },
        })
        //  use populate to replace sections/sub-sections both in the updatedCourseDetails 

        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
        })

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"unable to create section, please try again",
        })
    }
}

// updatesection handler function
exports.updateSection = async (req, res)=>{
    try{
        // data input
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"missing properties",
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        // return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"unable to update section, please try again",
        })
    }

}

// delete handler
exports.deleteSection = async(req, res)=>{
    try{
        // get ID - assuming that we aare ssending ID in params
        const {sectionId, courseId} = req.body;

        // find the section first (so we know which course it belongs to)
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(400).json({
                success:false,
                message:"Section not found",
            })
        }
        // remove sectionId from the course Schema
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull:{
                    courseContent:sectionId,
                },
            },
            {new:true},

        );
        //delete all subsections of this section
        await SubSection.deleteMany({_id:{$in:section.subSection}});

        // use findByIdAndDelete to delete section
        await Section.findByIdAndDelete(sectionId);
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully!",
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"unable to delete section, please try again",
        })
    }
}