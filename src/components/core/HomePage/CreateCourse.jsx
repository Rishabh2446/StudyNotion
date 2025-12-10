import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [whatYouWantLearn, setWhatYouWantLearn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // LOAD ALL CATEGORIES
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/course/showAllCategory")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.allCategory || []);
      })
      .catch((err) => console.log("Error loading categories:", err));
  }, []);

  // -----------------------------
  // CREATE COURSE HANDLER
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DEBUG:", {
    courseName,
    courseDescription,
    price,
    category,
    thumbnail,
  });

    if (!courseName || !courseDescription || !price || !category || !thumbnail) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("whatYouWantLearn", whatYouWantLearn);
    formData.append("thumbnailImage", thumbnail);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/api/v1/course/createCourse",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("CATEGORY PAGE DATA:", result);
      console.log("CREATE COURSE RESPONSE:", result);

      if (result.success) {
        toast.success("Course created successfully!");
        navigate("/dashboard/InstructorDashboard");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.log("Error creating course:", error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="text-white w-11/12 mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Create New Course</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-richblack-800 p-6 rounded-lg border border-richblack-700"
      >
        {/* Course Name */}
        <label className="block mb-2 font-semibold">Course Title</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 mb-4 bg-richblack-700 rounded"
          placeholder="Enter course title"
        />

        {/* What you will learn */}
            <label className="block mb-2 font-semibold">What You Will Learn</label>
            <textarea
            value={whatYouWantLearn}
            onChange={(e) => setWhatYouWantLearn(e.target.value)}
            className="w-full p-2 mb-4 bg-richblack-700 rounded"
            rows="3"
            placeholder="Write what students will learn"
            ></textarea>


        {/* Description */}
        <label className="block mb-2 font-semibold">Course Description</label>
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          className="w-full p-2 mb-4 bg-richblack-700 rounded"
          rows="4"
          placeholder="Enter course description"
        />

        {/* Price */}
        <label className="block mb-2 font-semibold">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 mb-4 bg-richblack-700 rounded"
          placeholder="Enter price"
        />

        {/* Category */}
        <label className="block mb-2 font-semibold">Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-4 bg-richblack-700 rounded"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Thumbnail */}
        <label className="block mb-2 font-semibold">Course Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full p-2 mb-4 bg-richblack-700 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
