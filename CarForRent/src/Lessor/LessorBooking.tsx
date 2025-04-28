import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

interface Car {
  id: number;
  name: string;
}

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total: number;
  created_at: string;
  user: User;
  car: Car;
}

const LessorBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const lessorId = localStorage.getItem("user_id");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(5);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lessor/bookings/${lessorId}`);
        console.log('API Response:', response.data);
        
        if (response.data.bookings) {
          setBookings(response.data.bookings);
        } else if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setError('Unexpected response structure');
        }
          
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [lessorId]);

  const handleStatusChange = async (id: number, newStatus: Booking['status']) => {
    try {
      await axios.put(`http://localhost:8000/api/lessor/bookings/${id}/${lessorId}`, {
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Check console for details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/lessor/bookings/${id}/${lessorId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Check console for details.');
    }
  };

  // Get current bookings
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Calculate total number of pages
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        {error}
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Booking Management</h2>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {bookings.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Car</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.user.name}</td>
                        <td>{booking.car.name}</td>
                        <td>
                          {new Date(booking.start_date).toLocaleDateString('en-US')} - 
                          {new Date(booking.end_date).toLocaleDateString('en-US')}
                        </td>
                        <td>JD{Number(booking.total).toFixed(2)}</td>

                        <td>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(
                              booking.id, 
                              e.target.value as Booking['status']
                            )}
                            className={`form-select form-select-sm ${
                              booking.status === 'pending' ? 'bg-warning text-white' :
                              booking.status === 'confirmed' ? 'bg-success text-white' :
                              'bg-danger text-white'
                            }`}
                            style={{ width: '120px' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <div className="alert alert-info">
              No bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessorBookingsPage;