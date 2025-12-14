import React from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Navbar from './components/core/HomePage/common/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './components/core/HomePage/VerifyEmail';
import DashboardLayout from './components/core/HomePage/DashboardLayout';
import Profile from './components/core/HomePage/Profile';
import { useEffect , useState} from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "./slices/authSlice";
import { setUser } from "./slices/profileSlice";
import EditProfile from './components/core/HomePage/EditProfile';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import InstructorDashboard from './components/core/HomePage/InstructorDashboard';
import CreateCategory from './components/core/HomePage/CreateCategory';
import ResetPasswordPage from './components/core/HomePage/ResetPasswordPage';
import UpdatePasswordPage from './components/core/HomePage/UpdatePassword';
import CatalogPage from './pages/CatelogPage';
import CreateCourse from './components/core/HomePage/CreateCourse';
import CourseDetails from './pages/CourseDetails';
import InstructorCourses from './components/core/HomePage/InstructorCourses';
import PaymentSuccess from './components/core/HomePage/PaymentSuccess';
import EnrolledCourses from './components/core/HomePage/EnrolledCourses';
import PurchaseHistory from './components/core/HomePage/PurchaseHistory';
import CartPage from './pages/CartPage';
import EditCourse from './pages/EditCourse';
import ViewCourse from './pages/ViewCourse';


const App = () => {
  
  const dispatch = useDispatch();
  const [isAppReady, setIsAppReady] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    
    if (token && user) {
      dispatch(setLogin(token));
      dispatch(setUser(user));
    }
      setIsAppReady(true);

  }, [dispatch]);

    useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/`)
      .catch(() => {});
  }, []);

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar/>
      
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/contact' element={<ContactUs/>}/>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path='/update-password/:token' element={<UpdatePasswordPage/>}/>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path='InstructorDashboard' element={<InstructorDashboard/>}/>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="create-category" element={<CreateCategory/>}/>
            <Route path='create-course' element={<CreateCourse/>}/>
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="enrolled-courses" element={<EnrolledCourses />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="edit-course/:courseId" element={<EditCourse />} />





            {/* Add other dashboard routes here */}
          </Route>
          <Route path="/catelog/:categoryId" element={<CatalogPage />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/view-course/:courseId" element={<ViewCourse />} />




        </Routes>
      
      
    </div>
  )
}

export default App