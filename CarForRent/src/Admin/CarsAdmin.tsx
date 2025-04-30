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

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [carsPerPage] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/admin/cars')
      .then((response) => {
        setCars(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching cars!', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = cars.filter(
      (car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedColor ? car.color.toLowerCase() === selectedColor.toLowerCase() : true)
    );
    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedColor, cars]);

  const handleDeleteCar = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      axios
        .delete(`http://localhost:8000/api/admin/cars/${carId}`)
        .then(() => {
          const updatedCars = cars.filter((car) => car.id !== carId);
          setCars(updatedCars);
        })
        .catch((error) => {
          console.error('Error deleting car:', error);
        });
    }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <h2 className="mb-4">Cars</h2>

      {/* Search and Filter */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="">All Colors</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
        </select>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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
                      <strong>Price per day:</strong> JD{car.price_per_day}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link to={`/admin/CarDetailsPage/${car.id}`} className="btn btn-info btn-sm">
                        View Details
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
              <div className="alert alert-info">No cars found</div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CarsPage;
