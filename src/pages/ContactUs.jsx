import React from "react";
import { IoMdCall } from "react-icons/io";
import { TiLocation } from "react-icons/ti";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";
import Footer from "../components/core/HomePage/common/Footer";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;



export default function ContactUs() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+91",
        phoneNumber: "",
        message: "",

    });


    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
                message: formData.message,
            };

            console.log("Payload being sent to backend:", payload);

            const res = await axios.post(`${BASE_URL}/api/v1/auth/contact`, payload,
                { headers: { "Content-Type": "application/json" } }
            );
            if (res.data.success) {
                toast.success("✅ Message sent successfully!");
                setFormData({
                firstName: "",
                lastName: "",
                email: "",
                countryCode: "+91",
                phoneNumber: "",
                message: "",
                });
            } else {
               toast.error("❌ " + res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("❌ Failed to send message. Please try again.");
        }
        setLoading(false);
    };
  return (
    <div className="flex flex-col">
     <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center py-10">
      <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4">
        
        {/* LEFT: Contact Info */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg space-y-6">
          <div className="rounded-lg bg-richblack-800">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 px-2 py-3">
            <IoChatboxEllipsesOutline />Chat on us
             </h2>
            <p className="text-gray-400 px-2">Our friendly team is here to help.</p>
            <p className="text-yellow-400 px-2 pb-2">support@email.com</p>
          </div>

          <div className="bg-richblack-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex gap-2 items-center py-3 px-2">
            <TiLocation /> Visit us</h2>
            <p className="text-gray-400 px-2 ">
              Come and say hello at our office HQ.
            </p>
            <p className="text-yellow-400 px-2 pb-2">123 Street, City, Country</p>
          </div>

          <div className="bg-richblack-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 py-3 px-2"> 
            <IoMdCall />Call us</h2>
            <p className="text-gray-400 px-2">Mon - Fri from 8am to 5pm</p>
            <p className="text-yellow-400 px-2 pb-2">+123 456 7890</p>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="bg-[#1e293b] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Got an Idea? We’ve got the skills. Let’s team up
          </h2>
          <p className="text-gray-400 mb-6">
            Tell us more about yourself and what you’ve got in mind.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {/* Phone */}
            <div className="flex">
              <select 
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-2 rounded-l-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="12345 67890"
                className="w-full px-4 py-2 rounded-r-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Message */}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your message"
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required            
            ></textarea>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition"
            >
             {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      
     </div>
       <div>
        <Footer/>
      </div>
    </div>
  );
}
