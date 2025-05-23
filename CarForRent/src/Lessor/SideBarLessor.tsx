import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SideBarLessor: React.FC = () => {

        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('user_id');
    
        if (role !== 'lessor' || !userId) {
          window.location.href = '/';
        }



  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    window.location.href = '/register'; 
  };

  const links = [
    { path: '/lessor/Profile', label: 'My-Profile', icon: 'bi-calendar-check' },

    { path: '/lessor/LessorDashboard', label: 'LessorDashboard', icon: 'bi-people' },
    { path: '/lessor/LessorCarsPage', label: 'Cars', icon: 'bi-car-front' },
    // { path: '/lessor/Review', label: 'Reviews', icon: 'bi-chat-square-text' },
    { path: '/lessor/Booking', label: 'Bookings', icon: 'bi-calendar-check' },
  ];

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#212529',
        color: '#fff',
        position: 'fixed',
        paddingTop: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
      }}
    >
      <h4 style={{ color:"white" }} className="text-center mb-4">🚀 Lessor Panel</h4>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <Link
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: location.pathname === link.path ? '#0d6efd' : '#fff',
                textDecoration: 'none',
                padding: '12px 20px',
                backgroundColor: location.pathname === link.path ? '#343a40' : 'transparent',
                borderRadius: '8px',
              }}
            >
              <i className={`bi ${link.icon}`}></i> {link.label}
            </Link>
          </li>
        ))}
        <li className="mt-4 px-3">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideBarLessor;
