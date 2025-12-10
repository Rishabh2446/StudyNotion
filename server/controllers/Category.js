const Category = require("../models/Category")

// create Category ka handler function 
exports.createCategory = async (req, res) =>{
    try{
        // fetch data
        const {name, description} = req.body;
        console.log("req.body:", req.body);

        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            })
        }
        // create entry in db
        const tagDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"Category created successfully.",
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// getAllCategory handler
exports.showAllCategory = async(req, res)=>{
    try{
        const allCategory = await Category.find({}, {name:true, description:true});
        return res.status(200).json({
            success:true,
            message:"All Categries returned successfully.",
            allCategory,
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// categoryPageDetails
exports.categoryPageDetails = async(req, res)=>{
    try{
        // get category id
        const {categoryId} = req.body;

        // get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
        .populate("courses")
        .exec();
        console.log(selectedCategory);

        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Category not found!",
            })
        }

        // handle the case when there are no courses
        if(selectedCategory.courses.length === 0){
            return res.status(500).json({
                success:false,
                message:"No course found for the selected category.",
            });
        }
        const selectedCourses = selectedCategory.courses;

        // get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id:{$ne: categoryId},// not equal
            }).populate("courses")
            .exec();

        let differentCourses = [];
        for( const category of categoriesExceptSelected){
            differentCourses.push(...category.courses);
        }

        // get top selling courses acros all categories
        const allCategories = await Category.find().populate("courses");
        const allCourses = allCategories.flatMap((category)=> category.courses );
        const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);

        // return response
        return res.status(200).json({
            success:true,
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
        });
    }
}