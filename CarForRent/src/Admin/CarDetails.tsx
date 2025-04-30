import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface Car {
  id: number;
  name: string;
  color: string;
  price_per_day: string;
  description: string;
  images: { id: number, image_path: string }[];
  status?: string;
}
interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  total_price: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/cars/${id}`);
        setCar(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/cars/${id}/bookings`);
        setBookings(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setLoadingBookings(false);
      }
    };
  
    fetchBookings();
  }, [id]);
  const navigate = useNavigate();

  const handleDeleteCar = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      axios.delete(`http://localhost:8000/api/admin/cars/${carId}`)
        .then(() => {
        })
        .catch(error => {
          console.error('Error deleting car:', error);
        });
        navigate('/admin/cars');

    }
  };

  const nextImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="main-content">
        <div className="alert alert-danger">Car not found</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Car Details</h2>
            <Link to="/admin/cars" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>Back to Cars
            </Link>
          </div>
        </div>

        <div className="card shadow-sm">
          {/* Image Gallery */}
          <div className="image-gallery-container">
            {car.images.length > 0 && (
              <>
                <div className="image-slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                  {car.images.map((image, index) => (
                    <div key={image.id} className="slide">
                      <img
                        src={`http://localhost:8000/storage/${image.image_path}`}
                        alt={`Car ${index + 1}`}
                        className="slide-image"
                      />
                    </div>
                  ))}
                </div>

                <button className="nav-button prev" onClick={prevImage}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button className="nav-button next" onClick={nextImage}>
                  <i className="bi bi-chevron-right"></i>
                </button>

                <div className="indicators">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Car Details */}
          <div className="card-body">
            <h3 className="card-title mb-4">{car.name}</h3>
            
            <div className="row">
              <div className="col-md-6">
                <div className="detail-item">
                  <span className="detail-label">Color:</span>
                  <span className="detail-value">{car.color}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price per day:</span>
                  <span className="detail-value">JD{car.price_per_day}</span>
                </div>
                {car.status && (
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`badge ${car.status === 'available' ? 'bg-success' : 'bg-warning'}`}>
                      {car.status}
                    </span>
                  </div>
                )}
              </div>
              <a
                                    style={{ height:"40px",marginLeft:"200px"}}

                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        Delete
                      </a>
              <div className="col-md-6">
                <h5 className="section-title">Description</h5>
                <p className="description-text">{car.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-sm mt-4">
  <div className="card-header">
    <h4 className="mb-0">Car Bookings</h4>
  </div>
  <div className="card-body">
    {loadingBookings ? (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : error ? (
      <div className="alert alert-danger">{error}</div>
    ) : bookings.length === 0 ? (
      <div className="alert alert-info">No bookings found for this car</div>
    ) : (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>
                  <div>{booking.user.name}</div>
                  <small className="text-muted">{booking.user.email}</small>
                </td>
                <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                <td>JD{booking.total_price}</td>
                <td>
                  <span className={`badge ${
                    booking.status === 'confirmed' ? 'bg-success' : 
                    booking.status === 'pending' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default CarDetailsPage;