import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/profileSlice";
import { setLogin } from "../../../slices/authSlice";
import { useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const  user = useSelector((state) => state.profile.user);
  const  navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async ()=>{
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
  const token = localStorage.getItem("token");
  console.log("Sending token:", token, typeof token);
    try{
      setLoading(true);
      const res = await axios.delete("http://localhost:4000/api/v1/profile/deleteAccount",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
         withCredentials:true,

      });

      if(res.data.success){
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        dispatch(setUser(null));
        dispatch(setLogin(null)); 

        toast.success("Account deleted successfully.");
        navigate("/signup");
      }
    }
    catch(error){
      console.error("Delete account Failed", error);
      alert("Failed to delete account");
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Top Card */}
      
      <div className="bg-richblack-800 p-4 rounded-xl flex items-center justify-between">
      
        {/* Left: Profile Image + Info */}
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border cursor-pointer"
          />

          <div>
            <h2 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => navigate("/dashboard/edit-profile")}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
          Edit
        </button>
      </div>

      {/* Personal Details */}
      <div className="bg-richblack-800 p-4 rounded-xl flex flex-col">
        <h2 className="font-semibold">Personal Details :</h2>
        <div className="flex items-center justify-between ">
        
          <div className="flex items-center justify-between gap-28">
            <p>First Name: {user?.firstName} </p>
            <p>Last Name: {user?.lastName}</p>
            
          </div>
          <p>Email: {user?.email}</p>

          <button onClick={() => navigate("/dashboard/edit-profile")}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
            Edit
          </button>
        </div>
      </div>
      

       {/* Billing Details */}
      <div className="bg-richblack-800 p-4 rounded-xl flex justify-between">
        <p>Account Type: {user?.accountType}</p>
        
      </div>

      {/* Password Section */}
      <div className="bg-richblack-800 p-4 rounded-xl flex justify-between">
        <p>*********</p>
        <button onClick={() => navigate("/dashboard/edit-profile")}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
          Change Password
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-red-700 p-4 rounded-xl">
        <h3 className="text-lg font-bold">Delete Account</h3>
        <p className="text-sm text-gray-200">
          Would you like to delete your account? This action is permanent and
          cannot be undone.
        </p>
        <button onClick={handleDelete}
        disabled={loading}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg">
          {loading ? "Deleting...": "Delete My Account"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
