import React from 'react';
import axios from "axios";
import { useState } from 'react';
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;


const CreateCategory = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        const token = localStorage.getItem("token");
        console.log("categorytoken", token);
        const res = await axios.post(`${BASE_URL}/api/v1/course/createCategory`, {
            name,
            description,
        },
        {
        headers: {
        Authorization: `Bearer ${token}` // because of auth middleware
        }
    }
    );

        if(res.data.success){
            toast.success(res.data.message || "Category created successfully 🎉");
            setName("");
            setDescription("");
        }
    }
    catch(error){
        toast.error(error.response?.data?.message || "❌ Error creating category");
    }
  }
  

  return (
    <div className='space-y-6'>
      <h2 className="text-xl font-bold mb-3">Create Category</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-11/12">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded bg-richblack-800 border-gray-600"
        />

        <textarea
          placeholder="Category Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded bg-richblack-800 border-gray-600"
        />

        <button
          type="submit"
          className="bg-yellow-400 text-black px-4 py-2  items-center rounded-md font-semibold hover:bg-yellow-300 transition self-end "
        >
          Create
        </button>
      </form>


    </div>
  )
}

export default CreateCategory