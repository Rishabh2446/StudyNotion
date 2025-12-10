import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CourseCard from "../components/core/HomePage/CourseCard";
import CatalogCourseCard from "../components/core/HomePage/CatalogCourseCard";
import Footer from "../components/core/HomePage/common/Footer";

const CatalogPage = () => {
  const { categoryId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/course/categoryPageDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      });

      const response = await res.json();
      console.log("CATEGORY PAGE DATA:", response);
      setData(response);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  if (!data) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <div className="text-white w-11/12 mx-auto max-w-6xl py-10">

      {/* Page Title / Header */}
      <h1 className="text-3xl font-semibold mt-10 mb-5">
        Category Courses
      </h1>

      {/* Courses to get you started */}
      <h2 className="text-xl font-bold mt-6">Courses to get you started</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
        {data.selectedCourses?.slice(0, 4).map((course) => (
          <CatalogCourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Top Courses */}
      <h2 className="text-xl font-bold mt-10">Top Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
        {data.mostSellingCourses?.slice(0, 4).map((course) => (
          <CatalogCourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Frequently Bought */}
      <h2 className="text-xl font-bold mt-10">Frequently Bought</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
        {data.differentCourses?.slice(0, 4).map((course) => (
          <CatalogCourseCard key={course._id} course={course} />
        ))}
      </div>

    </div>
    <Footer/>
    </div>
  );
};

export default CatalogPage;
