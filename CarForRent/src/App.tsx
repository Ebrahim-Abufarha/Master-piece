import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './layout/navbar';
import Footer from './layout/footer';
import Home from './User/Home';
import Cars from './User/Cars';
import Contact from './User/Contact';
import CarSingle from './User/CarSingle';
import About from './User/About';
import Pricing from './User/Pricing';
import Services from './User/Services';
import Register from './User/Register';
import LessorProfile from './User/LessorProfile';
import UserProfile from './User/Profile';
import EditUser from './User/EditUser';
import FavoriteCars from './User/Favorite';
import SidebarAdmin from './Admin/Sidebar';
import Users from './Admin/Users';
import AddUser from './Admin/AddUser';
import EditUsers from './Admin/EditUser';
import CarsPage from './Admin/CarsAdmin';
import CarDetailsPage from './Admin/CarDetails';
import ContactsPage from './Admin/ContactsPage';
import AdminReviewsPage from './Admin/ReviewsPage';
import AdminBookingsPage from './Admin/BookingsPage';
import AdminContactDetailsPage from './Admin/SingleContacts';
import AdminDashboard from './Admin/AdminDashboard';
import SideBarLessor from './Lessor/SideBarLessor';
import LessorDashboard from './Lessor/LessorDashboard';
import LessorCarsPage from './Lessor/CarsLessor';
import LessorCarDetailsPage from './Lessor/CarDetailsLessor';
import EditCar from './Lessor/EditCar';
import LessorBookingsPage from './Lessor/LessorBooking';
import LessorReviewsPage from './Lessor/LessorReview';
import AddCarPage from './Lessor/AddCar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLessorPath = location.pathname.startsWith('/lessor');

  return (
    <>
{!isAdminPath && !isLessorPath && <Navbar />}
{isAdminPath && <SidebarAdmin />}
      {isLessorPath && <SideBarLessor />}

      <div className="content">{children}</div>

      {!isAdminPath && !isLessorPath && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="contact" element={<Contact />} />
          <Route path="car-single/:id" element={<CarSingle />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="services" element={<Services />} />
          <Route path="register" element={<Register />} />
          <Route path="/lessors/:id" element={<LessorProfile />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
          <Route path="/favorites" element={<FavoriteCars />} />

          {/* صفحات الأدمن */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/users/create" element={<AddUser />} />
          <Route path="/admin/users/edit/:id" element={<EditUsers />} />
          <Route path="/admin/cars" element={<CarsPage />} />
          <Route path="/admin/CarDetailsPage/:id" element={<CarDetailsPage />} />
          <Route path="/admin/ContactsPage" element={<ContactsPage />} />
          <Route path="/admin/AdminReviewsPage" element={<AdminReviewsPage />} />
          <Route path="/admin/AdminBookingsPage" element={<AdminBookingsPage />} />
          <Route path="/admin/ContactDetailsPage/:id" element={<AdminContactDetailsPage />} />




          <Route path="/lessor/LessorDashboard" element={<LessorDashboard />} />
          <Route path="/lessor/LessorCarsPage" element={<LessorCarsPage />} />
          <Route path="/lessor/CarDetailsPage/:id" element={<LessorCarDetailsPage />} />
          <Route path="/lessor/EditCar/:id" element={<EditCar />} />
          <Route path="/lessor/Booking" element={<LessorBookingsPage />} />
          <Route path="/lessor/Review" element={<LessorReviewsPage />} />
          <Route path="/lessor/add-car" element={<AddCarPage />} />






        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
