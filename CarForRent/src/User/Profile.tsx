import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image: string;
}

export interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  total: number;
  car?: {
    name: string;
    id: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    user: User;
    bookings: Booking[];
  };
}

const BOOKINGS_PER_PAGE = 4;

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/users/${id}`);
        if (response.data.success) {
          setUser(response.data.data.user);
          setBookings(response.data.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!user) return <div className="text-center py-5">User not found</div>;

  // Pagination Logic
  const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const paginatedBookings = bookings.slice(startIndex, startIndex + BOOKINGS_PER_PAGE);
  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
  
  <>
  <div className="profile-section">
  <div className="container">
    <h1 className="display-4 fw-bold">My Profile</h1>
    <p className="lead">Manage your account and view booking history</p>
  </div>
</div>

<div className="container mb-5">
  {/* Profile Card */}
  <div className="profile-content mb-5">
    <div className="row g-0">
      <div className="col-md-4 profile-img-container">
        <img
          src={`http://localhost:8000/storage/${user.image}`}
          className="profile-img rounded-circle"
          alt={user.name}
        />
      </div>
      <div className="col-md-8 profile-info">
        <h2 className="profile-title">{user.name}</h2>
        <div className="profile-detail">
          <i className="bi bi-envelope"></i> {user.email}
        </div>
        {user.phone && (
          <div className="profile-detail">
            <i className="bi bi-telephone"></i> {user.phone}
          </div>
        )}
        {user.address && (
          <div className="profile-detail">
            <i className="bi bi-geo-alt"></i> {user.address}
          </div>
        )}
        <Link to={`/users/${user.id}/edit`} className="btn edit-btn">
          <i className="bi bi-pencil-square me-2"></i> Edit Profile
        </Link>
      </div>
    </div>
  </div>

  {/* Booking History */}
  <h3 className="section-title">
    <i className="bi bi-calendar-check me-2"></i> Booking History
  </h3>
  
  {bookings.length > 0 ? (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {paginatedBookings.map((booking) => (
          <div key={booking.id} className="col">
            <div className="card booking-card">
              <div className="booking-header">
                <i className="bi bi-calendar-event me-2"></i>
                Booking #{booking.id}
              </div>
              <div className="booking-body">
                {booking.car && (
                  <>
                    <h5 className="car-title">
                      <i className="bi bi-car-front me-2"></i>
                      <a href={`/car-single/${booking.car.id}`}>{booking.car.name}</a>
                    </h5>
                    <div className="booking-detail">
                      <i className="bi bi-calendar"></i>
                      <strong>From:</strong> {new Date(booking.start_date).toLocaleDateString()}
                    </div>
                    <div className="booking-detail">
                      <i className="bi bi-calendar-check"></i>
                      <strong>To:</strong> {new Date(booking.end_date).toLocaleDateString()}
                    </div>
                    <div className="booking-price">
                      <i className="bi bi-currency-dollar me-2"></i>
                      Total: jd {booking.total}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  ) : (
    <div className="text-center py-5">
      <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#01d28e' }}></i>
      <h4 className="mt-3">No bookings yet</h4>
      <p className="text-muted">You haven't made any bookings yet. Start exploring our cars!</p>
      <Link to="/cars" className="btn edit-btn mt-3">
        <i className="bi bi-search me-2"></i> Browse Cars
      </Link>
    </div>
  )}
</div>
  </>
  );
}
