import React from "react";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from '../../../../assets/StudyNotionLogo.svg'

const Footer = () => {
  return (
    <footer className="bg-richblack-800 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6">
        
        
        {/* Company */}
        <div>
            <div className="w-[150px] flex flex-row gap-3 ">
            <img
                src={logo}
                alt='StudyNotionLogo'
            />
            </div>
          <h2 className="text-lg font-semibold mb-4 text-white">Company</h2>
          <ul className="space-y-2 text-sm text-richblack-200">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Affiliates</a></li>
          </ul>
          <div className="flex gap-3 mt-4 text-richblack-200 ">
            <FaFacebook className="cursor-pointer hover:text-blue-500" />
            <FaGoogle className="cursor-pointer hover:text-red-500" />
            <FaTwitter className="cursor-pointer hover:text-sky-400" />
            <FaYoutube className="cursor-pointer hover:text-red-600" />
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Resources</h2>
          <ul className="space-y-2 text-sm text-richblack-200">
            <li><a href="#">Articles</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Chart Sheet</a></li>
            <li><a href="#">Code Challenges</a></li>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Videos</a></li>
            <li><a href="#">Workspaces</a></li>
          </ul>
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Plans</h2>
          <ul className="space-y-2 text-sm text-richblack-200">
            <li><a href="#">Paid Memberships</a></li>
            <li><a href="#">For Students</a></li>
            <li><a href="#">Business Solutions</a></li>
          </ul>

          <h2 className="text-lg font-semibold mt-6 mb-4 text-white">Community</h2>
          <ul className="space-y-2 text-sm text-richblack-200">
            <li><a href="#">Forums</a></li>
            <li><a href="#">Chapters</a></li>
            <li><a href="#">Events</a></li>
          </ul>
        </div>

        {/* Subjects */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Subjects</h2>
          <ul className="space-y-2 text-sm text-richblack-200">
            {[
              "AI","Cloud Computing","Code Foundations","Computer Science",
              "Cybersecurity","Data Analytics","Data Science","Data Visualization",
              "Developer Tools","DevOps","Game Development","IT",
              "Machine Learning","Math","Mobile Development",
              "Web Design","Web Development"
            ].map((sub, i) => (
              <li key={i}><a href="#">{sub}</a></li>
            ))}
          </ul>
        </div>

           {/* Languages & Career */}
            <div className="grid grid-cols-2 gap-10">
            {/* Languages */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-white">Languages</h2>
                <ul className="space-y-2 text-sm text-richblack-200">
                {[
                    "Bash","C++","C#","Go","HTML & CSS","Java","JavaScript",
                    "Kotlin","PHP","Python","R","Ruby","SQL","Swift"
                ].map((lang, i) => (
                    <li key={i}><a href="#">{lang}</a></li>
                ))}
                </ul>
            </div>

            {/* Career Building */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-white">Career Building</h2>
                <ul className="space-y-2 text-sm text-richblack-200">
                <li><a href="#">Career Paths</a></li>
                <li><a href="#">Career Services</a></li>
                <li><a href="#">Interview Prep</a></li>
                <li><a href="#">Professional Certification</a></li>
                <li><a href="#">Full Catalog</a></li>
                <li><a href="#">Beta Content</a></li>
                </ul>
            </div>
            </div>


      </div>

      {/* Bottom Section */}
      <div className="border-t border-richblack-700 mt-10 pt-4  text-sm text-richblack-400 flex flex-row justify-evenly">
        
        <div className="flex justify-center gap-4 mt-2 text-richblack-200">
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Terms</a>
        </div>

        <p className="text-richblack-200">
          Made with <span className="text-red-500">❤</span> CodeHelp © 2023 StudyNotion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
