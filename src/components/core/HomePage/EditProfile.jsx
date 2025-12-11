import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../../slices/profileSlice";
import upload from "../../../assets/upload.jpg";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function EditProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || "");


  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function handlePasswordChangeInput(e) {
      setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  const [formData, setFormData] = useState({
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Show preview instantly
  }
  async function handleImageUpload() {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("displayPicture", imageFile);

    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/profile/updateDisplayPicture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.data));   // update redux user
        toast.success("Profile picture updated successfully!");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to upload image");
    }
  }


  async function handleSave() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/api/v1/profile/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.updatedUser));
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  }
  async function handlePasswordChange() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
        `${BASE_URL}/api/v1/auth/changePassword`,
        passwords,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (res.data.success) {
        alert("Password updated successfully");
        setPasswords({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        }
    } catch (err) {
        console.error(err);
        alert("Error changing password");
    }
 }


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      {/* image updation */}
      <div className="bg-richblack-800 p-6 rounded-xl flex items-center gap-4">
        <img
          src={imagePreview}
          alt="Profile Preview"
          className="w-12 h-12 rounded-full border object-cover"
        />

        <div className="flex flex-col gap-3">
          <p className="font-semibold">Change Profile Picture</p>

          <div className="flex gap-3 items-center">
            {/* SELECT BUTTON */}
            <label className="bg-richblack-700 py-2 px-4 rounded-md cursor-pointer">
              Select
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>

            {/* UPLOAD BUTTON */}
            <button
              onClick={handleImageUpload}
              className="bg-yellow-400 text-black px-3 py-2 rounded-md flex gap-2 items-center"
            >
              Upload
              <img src={upload} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>


      {/* Profile Information */}
      <div className="bg-richblack-800 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Display Name" className="p-2 rounded bg-richblack-700" />
          <input type="text" placeholder="Profession" className="p-2 rounded bg-richblack-700" />
          <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-2 rounded bg-richblack-700"
           />
          
          <div className="flex gap-4 items-center">
            <label>
                <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                /> Male
            </label>
            <label>
                <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                /> Female
            </label>
            <label>
                <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === "Other"}
                onChange={handleChange}
                /> Other
            </label>
          </div>


          <div className="flex gap-2">
             <select className=" p-2 rounded bg-richblack-700 text-white border border-gray-600 ">
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
            </select>
            <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="0123456789"
            className="p-2 rounded bg-richblack-700 col-span-2 border-gray-600"
            /> 
          </div>
             

            <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="About"
            className="p-2 rounded bg-richblack-700 col-span-2"
            />        
        </div>
      </div>

      

      {/* Password Section */}
      <div className="bg-richblack-800 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Password</h2>
        <div className="flex gap-4">
          {/* Current Password */}
          <div className="relative flex-1">
            {/* Current Password */}
            <input
            type={showCurrentPassword ? "text" : "password"}
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChangeInput}
            placeholder="Current Password"
            className="w-full p-2 rounded bg-richblack-700"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* New Password */}
          <div className="relative flex-1">
            <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChangeInput}
            placeholder="New Password"
            className="w-full p-2 rounded bg-richblack-700"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="relative flex-1">
            <input
            type="password"
            name="confirmNewPassword"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChangeInput}
            placeholder="Confirm New Password"
            className="w-full p-2 rounded bg-richblack-700"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <button
            onClick={handlePasswordChange}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
            >
            Update Password
          </button>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button className="bg-gray-600 px-4 py-2 rounded-lg">Cancel</button>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
          onClick={handleSave}
        >Save</button>
      </div>
    </div>
  );
}
