import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SidebarAdmin: React.FC = () => {

        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('user_id');
    
        if (role !== 'admin' || !userId) {
          window.location.href = '/';
        }



  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    // Redirect if needed
    window.location.href = '/register'; 
  };

  const links = [
    { path: '/admin/AdminDashboard', label: 'AdminDashboard', icon: 'bi-people' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
    { path: '/admin/cars', label: 'Cars', icon: 'bi-car-front' },
    { path: '/admin/ContactsPage', label: 'Contacts', icon: 'bi-envelope' },
    { path: '/admin/AdminReviewsPage', label: 'Reviews', icon: 'bi-chat-square-text' },
    { path: '/admin/AdminBookingsPage', label: 'Bookings', icon: 'bi-calendar-check' },
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
      <h4 className="text-center mb-4">🚀 Admin Panel</h4>
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

export default SidebarAdmin;
