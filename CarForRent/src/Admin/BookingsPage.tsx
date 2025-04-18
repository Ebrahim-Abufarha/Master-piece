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

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/bookings');
        console.log('API Response:', response.data);
        
        if (response.data.data) {
          setBookings(response.data.data);
        } else if (response.data) {
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
  }, []);

  // const handleStatusChange = async (id: number, newStatus: Booking['status']) => {
  //   try {
  //     await axios.put(`http://localhost:8000/api/admin/bookings/${id}`, {
  //       status: newStatus
  //     });
  //     setBookings(prev => prev.map(booking => 
  //       booking.id === id ? { ...booking, status: newStatus } : booking
  //     ));
  //   } catch (error) {
  //     console.error('Error updating booking status:', error);
  //     alert('Failed to update booking status');
  //   }
  // };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/admin/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

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
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.user.name}</td>
                      <td>{booking.car.name}</td>
                      <td>
                        {new Date(booking.start_date).toLocaleDateString('en-US')} - 
                        {new Date(booking.end_date).toLocaleDateString('en-US')}
                      </td>
                      <td>${Number(booking.total).toFixed(2)}</td>
                      <td>
  <span
    className={`badge ${
      booking.status === 'pending' ? 'bg-warning text-white' :
      booking.status === 'confirmed' ? 'bg-success text-white' :
      'bg-danger text-white'
    }`}
    style={{ padding: '5px 10px', borderRadius: '5px' }}
  >
    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
  </span>
</td>
{/* <td>
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
                      </td> */}
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

export default AdminBookingsPage;