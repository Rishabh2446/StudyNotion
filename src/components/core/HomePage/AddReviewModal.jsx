import React from "react";

const AddReviewModal = ({
  user,
  rating,
  setRating,
  review,
  setReview,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#111827] w-[500px] rounded-lg p-6 relative shadow-xl">

        {/* Close Button */}
        <div className="bg-[#1f2937] flex justify-between w-full rounded items-center p-3">

            <h2 className="text-xl font-semibold mb-5 text-gray-300 ">Add Review</h2>
            <button
             onClick={onClose}
             className=" text-gray-300 text-xl"
            >
              ✕
            </button>
        </div>

        <div className="flex items-center flex-col mt-3">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
            </div>

            <div>
                <p className="font-semibold text-gray-300">
                {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-400 text-sm">Posting Publicly</p>
            </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-500"
                }`}
                >
                ★
                </span>
            ))}
            </div>
        </div>

        {/* Review Input */}
        <label htmlFor="AddExpierence" className="text-white"> Add Your Expierence</label>
        <textarea
          id="AddExpierence"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Add your experience..."
          className="w-full p-3 rounded  bg-[#1f2937] text-white outline-none border border-gray-600 h-28"
        />

        {/* Buttons */}
        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-yellow-400 text-black rounded-md font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
