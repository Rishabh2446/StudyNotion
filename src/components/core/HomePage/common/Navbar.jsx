import React, { useEffect, useState } from 'react'
import logo from "../../../../assets/StudyNotionLogo.svg";
import { Link, matchPath } from 'react-router-dom';
import { NavbarLinks } from '../../../../data/navbar-links';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { apiConnector } from '../../../../services/api.connector';
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from 'axios';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;



// const subLinks = [
//   {
//     title:"python",
//     link:"/catelog/python"
//   },
//   {
//     title:"web dev",
//     link:"/catelog/web-development"
//   },
// ]
const Navbar = () => {

    const user = useSelector((state) => state.profile.user);
    const {totalItems} = useSelector( (state) => state.cart)
    const location = useLocation();



    const [subLinks, setSubLinks] = useState([]);


    console.log("Navbar accountType:", user);
    console.log("Navbar accountType:", user?.accountType);

    const fetchCategories = async ()=>{
        try{
          const res = await axios.get(`${BASE_URL}/api/v1/course/showAllCategory`);
          console.log("Fetched categories:", res.data);

          if(res.data?.success){
            setSubLinks(res.data.allCategory );
          }else{
          setSubLinks([]);
          }


        }
        catch(error){
          console.log("Could not fetch category list", error);
          setSubLinks([]);
        }
    }


    useEffect( () =>{
      fetchCategories();
    }, [])


    const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; 
};



    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

  return (
    <div className='flex h-14 items-center border-b-[1px] border-b-richblack-700 bg-richblack-800'>
        <div className='mx-auto flex w-11/12 items-center justify-between max-w-5xl'>
          
          <Link to="/" className='flex items-center gap-2 font-bold'>
            <img src={logo} width={150} height={150} loading='lazy' />
          </Link>
          

          {/* navlinks */}
          <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
            {
                NavbarLinks.map( (link, index) => (

                    <li key={index}>
                       {
                          link.title === "Catelog" ?
                           (<div className='relative flex items-center gap-1 group'>
                              <p>{link.title}</p>
                              <RiArrowDropDownLine/>

                              <div className='invisible absolute left-[50%] top-[80%] translate-x-[-50%] translate-y-[10%]
                              flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                              opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[280px] shadow-md z-50'>

                              <div className='absolute left-[50%] top-0 h-7 w-6 rotate-45
                              translate-x-[80%] translate-y-[-35%] rounded bg-richblack-5 '>

                              </div>

                              {
                                 Array.isArray(subLinks) && subLinks.length > 0 ? (
                                  
                                    subLinks.map( (subLink, index) => (
                                      <Link to={`/catelog/${subLink._id}`} key={index}>
                                          <p className="px-4 py-2 text-sm hover:bg-gray-300 transition rounded text-semibold"
                                          >{subLink.name}</p>
                                      </Link>
                                    ))
                                  
                                 ) : (<div>
                                  <div className="text-gray-500">No categories found</div>
                                 </div>)
                              }
                                 
                              </div>

                           </div>) 
                           :(
                              <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-400" : "text-richblack-25"}`}>
                                  {link.title}
                                </p>
                                
                              </Link>
                            )
                          
                       }
                    </li>
                ))
            }

            </ul>
          </nav>

          {/* Login/signup/dashboard */}
           <div className="flex gap-x-4 items-center">
        {!localStorage.getItem("token") ? (
          // If not logged in → Show Signup & Login
          <>
            <Link to="/signup">
              <button className="text-white border px-4 py-2 rounded-md">Signup</button>
            </Link>
            <Link to="/login">
              <button className="text-white border px-4 py-2 rounded-md">Login</button>
            </Link>
          </>
        ) : (
          // If logged in → Show Cart & Profile
          <>
            {/* Show cart only if user is NOT an instructor */}
            {user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-white text-2xl" />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <div className="relative group">

              {/* Profile section (image + arrow) */}
              <div className="flex gap-2 items-center cursor-pointer">
                <Link to="/dashboard/profile">
                  <img
                    src={user?.image || "https://via.placeholder.com/30"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border"
                  />
                </Link>
                <FaChevronDown className="text-white" />
              </div>

            {/* Dropdown menu */}
            <div className="
                invisible opacity-0 
                group-hover:visible group-hover:opacity-100 
                transition-all duration-200
                absolute right-0 mt-2 w-40 
                bg-richblack-800 text-white rounded-md p-2 z-50 shadow-lg
              "
            >
              <Link
                to="/dashboard/profile"
                className="block px-4 py-2 hover:bg-richblack-700 rounded"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-richblack-700 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          </>
        )}
        </div>

        </div>
    </div>
  )
}

export default Navbar