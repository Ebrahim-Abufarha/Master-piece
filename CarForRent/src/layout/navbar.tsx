import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';


const Navbar: React.FC = () => {

  const role = localStorage.getItem('role');

  if (role == 'lessor' ) {
    window.location.href = '/lessor/LessorDashboard';
  }
  if (role == 'admin' ) {
    window.location.href = '/admin/AdminDashboard';
  }


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    

    setIsLoggedIn(false);
    navigate('/register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top then navigate
  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
      <div className="container">
        <a className="navbar-brand" href="/" onClick={(e) => {
          e.preventDefault();
          handleNavClick('/');
        }}>Car<span>Book</span></a>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="oi oi-menu"></span> Menu
        </button>

        <div className="collapse navbar-collapse" id="ftco-nav">
          <ul className="navbar-nav ml-auto">
          {[
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  // { path: '/services', label: 'Services' },
  // { path: '/pricing', label: 'Pricing' },
  { path: '/cars', label: 'Cars' },
  { path: '/contact', label: 'Contact' },
  ...(localStorage.getItem('user_id') ? [
    { path: `/users/${localStorage.getItem('user_id')}`, label: 'Profile' },
    { path: `/favorites`, label: <FaHeart color="#01d28e" /> },
  ] : []),
].map(({ path, label }) => (
  <li className="nav-item" key={path}>
    <NavLink
      to={path}
      className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      {label}
    </NavLink>
  </li>
))}


            <li className="nav-item">
              {isLoggedIn ? (
                <button className="nav-link btn btn-link text-white" onClick={handleLogout}>Log Out</button>
              ) : (
                <NavLink
                  to="/register"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Log In
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
