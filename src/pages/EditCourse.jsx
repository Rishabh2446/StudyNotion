import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sectionName, setSectionName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subVideo, setSubVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");

    // NEW: state for updating section
  const [editSectionId, setEditSectionId] = useState("");
  const [editSectionName, setEditSectionName] = useState("");

  // NEW: state for update subsection
  const [editSub, setEditSub] = useState(null);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/course/getCourse/${courseId}`
      );
      setCourse(res.data.data);
    } catch (err) {
      console.log("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const token = localStorage.getItem("token");
  // -------------------------
  // CREATE SECTION
  // -------------------------
  const handleAddSection = async () => {
    if (!sectionName) return alert("Enter section name");

    const res = await axios.post(
      "http://localhost:4000/api/v1/course/create-section",
      {
        sectionName,
        courseId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success(res.data.message || "Section created successfully!");
    setSectionName("");
    fetchCourse();
  };

  // Update Section 
  const handleUpdateSection = async () =>{
    if(!editSectionName) return;

    await axios.post("http://localhost:4000/api/v1/course/update-section",
      {
        sectionId: editSectionId,
        sectionName: editSectionName,
      },
      {headers: {Authorization: `Bearer ${token}`}}
    );

    toast.success("Section Updated!");
    setEditSectionId("");
    setEditSectionName("");
    fetchCourse();
  };

  const handleDeleteSection = async (id) =>{
    await axios.delete("http://localhost:4000/api/v1/course/delete-section",
      {
        data: {sectionId: id},
        headers: {Authorization: `Bearer ${token}`},
      }
      
    );

    toast.success("Section deleted!");
    fetchCourse();
  }

  // -------------------------
  // CREATE SUBSECTION
  // -------------------------
  const handleAddSubSection = async () => {
    if (!selectedSection || !subTitle || !subDesc || !subVideo)
      return alert("All fields required");

    const formData = new FormData();
    formData.append("sectionId", selectedSection);
    formData.append("title", subTitle);
    formData.append("description", subDesc);
    formData.append("videoFile", subVideo);

    const res = await axios.post(
      "http://localhost:4000/api/v1/course/create-subsection",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "SubSection created successfully!");

    setSubTitle("");
    setSubDesc("");
    setSubVideo(null);
    setSelectedSection("");
    fetchCourse();
  };

  //UPDATE SUBSECTION
  const handleUpdateSubSection = async () => {
    const fd = new FormData();
    fd.append("subSectionId", editSub._id);
    fd.append("title", editSub.title);
    fd.append("description", editSub.description);
    if (editSub.videoFile) fd.append("videoFile", editSub.videoFile);

    await axios.post(
      "http://localhost:4000/api/v1/course/update-subsection",
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Subsection updated!");
    setEditSub(null);
    fetchCourse();
  };

  //delete Section
  const handleDeleteSubSection = async (subId, sectionId) => {
    await axios.delete(
      "http://localhost:4000/api/v1/course/delete-subsection",
      {
        data: { subSectionId: subId,
          SectionId: sectionId 
         },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Subsection deleted!");
    fetchCourse();
  };

  if (loading || !course) {
    return <p className="text-white">Loading...</p>;
  }


  return (
    <div className="text-white w-11/12 mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course: {course.courseName}</h1>

      {/* SECTION: ADD NEW SECTION */}    
      <div className="bg-richblack-800 p-4 rounded border border-richblack-700 mb-10">
        <h2 className="text-xl font-bold mb-2">Add New Section</h2>

        <input
          type="text"
          className="w-full p-2 bg-richblack-700 rounded mb-3"
          placeholder="Enter section name"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
        />

        <button
          onClick={handleAddSection}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
        >
          Add Section
        </button>
      </div>

      {/* SECTION: VIEW SECTIONS & ADD SUBSECTIONS */}
      <div className="bg-richblack-800 p-4 rounded border border-richblack-700">
        <h2 className="text-xl font-bold mb-4">Course Content</h2>

        {course.courseContent.length === 0 && (
          <p className="text-gray-400">No sections added yet.</p>
        )}

        {course.courseContent.map((sec) => (
          <div key={sec._id} className="border-b border-richblack-700 pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">{sec.sectionName}</h3>

            <div className="flex gap-3">
                {/* Edit Section Button */}
                <button
                  onClick={() => {
                    setEditSectionId(sec._id);
                    setEditSectionName(sec.sectionName);
                  }}
                  className="text-blue-300 underline"
                >
                  Edit
                </button>

                {/* Delete Section */}
                <button
                  onClick={() => handleDeleteSection(sec._id)}
                  className="text-red-400 underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedSection(sec._id)}
                  className="text-yellow-300 underline"
                >
                  Add Subsection
                </button>
            </div>
            {/* List Subsections */}
            <ul className="mt-3 ml-4">
              {sec.subSection.map((sub) => (
                <li key={sub._id} className="text-sm text-richblack-300">
                  <span>▶ {sub.title}</span> 
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setEditSub({
                          ...sub,
                          videoFile: null,
                        })
                      }
                      className="text-blue-300 underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteSubSection(sub._id, sec._id)}
                      className="text-red-400 underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ============================= */}
      {/* SECTION: ADD SUBSECTION FORM */}
      {/* ============================= */}
      {selectedSection && (
        <div className="bg-richblack-800 p-4 rounded border border-richblack-700 mt-10">
          <h2 className="text-xl font-bold mb-2">Add SubSection</h2>

          <input
            type="text"
            placeholder="Subsection Title"
            className="w-full p-2 bg-richblack-700 rounded mb-3"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 bg-richblack-700 rounded mb-3"
            placeholder="Subsection Description"
            value={subDesc}
            onChange={(e) => setSubDesc(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setSubVideo(e.target.files[0])}
            className="w-full p-2 bg-richblack-700 rounded mb-3"
          />

          <button
            onClick={handleAddSubSection}
            className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
          >
            Create SubSection
          </button>
        </div>
      )}
      {/*  edit section form */}
      {editSectionId && (
        <div className="bg-richblack-800 p-4 rounded border mt-10">
          <h2 className="text-xl mb-2">Edit Section</h2>

          <input
            type="text"
            className="w-full p-2 bg-richblack-700 rounded mb-3"
            value={editSectionName}
            onChange={(e) => setEditSectionName(e.target.value)}
          />

          <button
            onClick={handleUpdateSection}
            className="bg-blue-400 text-black px-4 py-2 rounded mr-3"
          >
            Save
          </button>

          <button
            onClick={() => setEditSectionId("")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* EDIT SUBSECTION FORM */}
      {editSub && (
        <div className="bg-richblack-800 p-4 rounded border mt-10">
          <h2 className="text-xl mb-2">Edit Subsection</h2>

          <input
            type="text"
            className="w-full p-2 bg-richblack-700 rounded mb-3"
            value={editSub.title}
            onChange={(e) =>
              setEditSub({ ...editSub, title: e.target.value })
            }
          />

          <textarea
            className="w-full p-2 bg-richblack-700 rounded mb-3"
            value={editSub.description}
            onChange={(e) =>
              setEditSub({ ...editSub, description: e.target.value })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setEditSub({ ...editSub, videoFile: e.target.files[0] })
            }
            className="w-full p-2 bg-richblack-700 rounded mb-3"
          />

          <button
            onClick={handleUpdateSubSection}
            className="bg-blue-400 text-black px-4 py-2 rounded mr-3"
          >
            Save
          </button>

           <button
            onClick={() => setEditSub(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
