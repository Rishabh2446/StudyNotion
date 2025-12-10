// src/components/core/Dashboard/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/authSlice";
import { clearUser } from "../../../slices/profileSlice";
import { useNavigate } from "react-router-dom";


const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.profile.user);

  const studentLinks = [
    { name: "My Profile", path: "/dashboard/profile" },
    { name: "Enrolled Courses", path: "/dashboard/enrolled-courses" },
    { name: "Wishlist", path: "/dashboard/cart" },
    { name: "Purchase History", path: "/dashboard/purchase-history" },
    
  ];

  const instructorLinks = [
    { name: "My Profile", path: "/dashboard/profile" },
    { name: "Dashboard", path: "/dashboard/instructorDashboard" },
    { name: "My Courses", path: "/dashboard/courses"},
    { name: "Create Course", path: "/dashboard/create-course"},
    { name: "Create Category", path: "/dashboard/create-category"},
    
  ];

  const sidebarLinks = user?.accountType?.toLowerCase() === "instructor" ? instructorLinks : studentLinks;

  return (
    <div className="flex min-h-screen bg-richblack-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-richblack-800 p-4 flex flex-col gap-4">
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive ? "bg-yellow-400 text-black" : "hover:bg-richblack-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <hr className="text-richblack-900"></hr>
        {/* Logout button */}
        <button
          onClick={() => {
            dispatch(logout());
            dispatch(clearUser());
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-richblack-700 text-red-400"
        >
          <IoMdLogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
