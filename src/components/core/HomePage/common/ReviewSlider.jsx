import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);

  // ---- Fetch All Reviews from Backend ----
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/course/getAllReviews", {
        method: "GET",
      });

      const data = await response.json();
      console.log("Backend response:", data);  // <-- IMPORTANT

      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 }},
      { breakpoint: 768, settings: { slidesToShow: 1 }},
    ],
  };

  return (
    <div className="w-11/12 max-w-[1200px] mx-auto my-20 text-white gap-x-3">
      

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400">Loading reviews...</p>
      ) : (
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review._id} className="px-4"    >
            <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-lg w-[360px] mx-auto">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review?.user?.image}
                  alt="user"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-white">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{review?.course?.courseName}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    color={i < review.rating ? "#FFD700" : "#555"}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 text-sm">{review.review}</p>
            </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ReviewSlider;
