import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  color: string;
  price_per_day: string;
  description: string;
  images: { id: number; image_path: string }[];
}

const LessorCarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const carsPerPage = 9;

  const lessorId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!lessorId) return;

    axios
      .get(`http://localhost:8000/api/lessor/cars/${lessorId}`)
      .then((response) => {
        setCars(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lessor cars:', error);
        setLoading(false);
      });
  }, [lessorId]);

  const handleDeleteCar = (carId: number) => {
    if (!lessorId) return;

    if (window.confirm('Are you sure you want to delete this car?')) {
      axios
        .delete(`http://localhost:8000/api/lessor/cars/${carId}/${lessorId}`)
        .then(() => {
          setCars(cars.filter((car) => car.id !== carId));
        })
        .catch((error) => {
          console.error('Error deleting car:', error);
        });
    }
  };

  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <h2 className="mb-4">My Cars</h2>
      <Link to="/lessor/add-car" className="btn btn-success">
          <i className="fas fa-plus me-2"></i> Add New Car
        </Link>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {currentCars.length > 0 ? (
              currentCars.map((car) => (
                <div key={car.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={`http://localhost:8000/storage/${car.images[0].image_path}`}
                        alt={car.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-secondary" style={{ height: '200px' }}></div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{car.name}</h5>
                      <p className="card-text">
                        <strong>Color:</strong> {car.color}
                        <br />
                        <strong>Description:</strong>{' '}
                        {car.description.split(' ').slice(0, 10).join(' ')}...
                        <br />
                        <strong>Price per day:</strong> ${car.price_per_day}
                      </p>
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/lessor/CarDetailsPage/${car.id}`}
                          className="btn btn-info btn-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/lessor/EditCar/${car.id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCar(car.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No cars available</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? 'active' : ''
                      }`}
                    >
                      <button
                        onClick={() => paginate(index + 1)}
                        className="page-link"
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessorCarsPage;
