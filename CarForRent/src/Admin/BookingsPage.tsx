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
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
 
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/bookings');
        console.log('API Response:', response.data);
        
        let fetchedBookings: Booking[] = [];
        if (response.data.data) {
          fetchedBookings = response.data.data;
        } else if (response.data) {
          fetchedBookings = response.data;
        } else {
          setError('Unexpected response structure');
        }
        
        // Sort bookings by date (newest first by default)
        const sortedBookings = fetchedBookings.sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [sortOrder]);

  // Apply filters and search whenever they change
  useEffect(() => {
    let result = [...bookings];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.user.name.toLowerCase().includes(term) || 
        booking.car.name.toLowerCase().includes(term)
      );
    }
    

    
    // Apply sorting
    result = result.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bookings, statusFilter, searchTerm, sortOrder]);

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

  // Get current bookings
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

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

      {/* Filter and Search Controls */}
      <div className="card shadow-sm mb-4"
      
      >
        <div className="card-body"
>
<div className="row g-3 align-items-center" style={{ padding: '0 15px' }}>
  {/* Status Filter */}
  <div className="col-md-3">
    <div className="form-group">
      <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
      <div className="input-group">
        <select
          id="statusFilter"
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Booking['status'])}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  </div>
  
  {/* Search Input */}
  <div className="col-md-3">
    <div className="form-group">
      <label htmlFor="searchTerm" className="form-label">Search</label>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          id="searchTerm"
          className="form-control"
          placeholder="User or car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  </div>
  
  {/* Sort Order */}
  <div className="col-md-3">
    <div className="form-group">
      <label htmlFor="sortOrder" className="form-label">Sort by Date</label>
      <div className="input-group">
        <select
          id="sortOrder"
          className="form-control"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  </div>
  
  {/* Clear Filters */}
  <div className="col-md-3">
    <div className="form-group">
      <label className="form-label" style={{ visibility: 'hidden' }}>Action</label>
      <button
        className="btn btn-outline-secondary w-100"
        onClick={() => {
          setStatusFilter('all');
          setSearchTerm('');
          setSortOrder('newest');
        }}
      >
        Clear Filters
      </button>
    </div>
  </div>
</div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {filteredBookings.length > 0 ? (
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
              {totalPages > 1 && (
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
              )}
            </>
          ) : (
            <div className="alert alert-info">
              No bookings found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;