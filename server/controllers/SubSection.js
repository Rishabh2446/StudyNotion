const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create sebsection
exports.createSubSection = async(req, res) =>{
    try{
        // fetch data from req body
        const {sectionId, title, description} = req.body;

        // extract video/file
        const video = req.files.videoFile;
        // validation
        if(!sectionId || !title  || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // upload video to cloudinaary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        console.log("UPLOAD DETAILS --->", uploadDetails);
        console.log("UPLOAD MIMETYPE --->", video.mimetype);
        // create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            videoUrl:uploadDetails.secure_url,
            timeDuration: Math.floor(uploadDetails.duration), 
        })
        // update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:subSectionDetails._id,
                }
            },
            {new:true},
        )
        .populate("subSection")
        .exec();
        // log updated section here, after adding populate function

        // return response
        return res.status(200).json({
            success:true,
            message:"Sub Section created successfully!",
            updatedSection,
        });

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while creating sub section!",
            error:error.message,
        })
    }
}

// update subsection handler function
exports.updateSubSection = async (req, res)=>{
    try{
        // get data and id
        const {subSectionId, title, description} = req.body;

        // find subsection from id and validate it
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(400).json({
                success:false,
                message: "Sub Section not found!",
            });
        }

        // check if new video is uploaded
        if(req.files && req.files.videoFile){
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
        }

        //storing in DB
        if(title) subSection.title = title;
        if(description) subSection.description = description;
        await subSection.save();

        //return response
        return res.status(200).json({
            success:true,
            message: "Sub Section updated successfully!",
            subSection,
        });
    }
    catch(error){
        console.log("error in updating subsection", error);
        return res.status(400).json({
            success:false,
            message: "Error while updating Sub Section!",
        });
    }
}

// delete subsection handler function
exports.deleteSubSection = async(req, res)=>{
    try{
        // fetch id from req body
        const {subSectionId, SectionId} = req.body;
        console.log("Deleting SubSection ID:", subSectionId);


        // validation
        if(!subSectionId || !SectionId){
            return res.status(400).json({
                success:false,
                message: "SubSectionId and SectionId are required!",
            });
        }
        //delete subsection
        const deleteSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if(!deleteSubSection){
            return res.status(400).json({
                success:false,
                message: "Sub Section not found!",
            });
        }
        // remove subsection from the section
        const updatedSection = await Section.findByIdAndUpdate(
            SectionId,
            {
                $pull:{
                    subSection:subSectionId
                }
            },
            {new:true}
        ).populate("subSection");

        //return response
        return res.status(200).json({
            success:true,
            message: "Sub Section deleted successfully!",
            updatedSection,
        });

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message: "Error while deleting Sub Section!",
        });
    }
}