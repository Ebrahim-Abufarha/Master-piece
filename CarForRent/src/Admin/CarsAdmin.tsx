import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  color: string;
  price_per_day: string;
  description: string;
//   status: string;
  images: { id: number, image_path: string }[];  // Array of images related to the car
  
}

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetching the list of cars from the API
    axios.get('http://localhost:8000/api/admin/cars')
      .then(response => {
        setCars(response.data.data);
                setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching cars!', error);
        setLoading(false);
      });
  }, []);

  const handleDeleteCar = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      axios.delete(`http://localhost:8000/api/admin/cars/${carId}`)
        .then(() => {
          setCars(cars.filter(car => car.id !== carId));  // Remove the deleted car from the state
        })
        .catch(error => {
          console.error('Error deleting car:', error);
        });
    }
  };

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <h2 className="mb-4">Cars</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {cars.length > 0 ? (
            cars.map((car) => (
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
                      <strong>Color:</strong> {car.color}<br />
                      <strong>Description:</strong> {car.description.split(' ').slice(0, 10).join(' ')}...<br />
                      <strong>Price per day:</strong> JD{car.price_per_day}<br />
                      {/* <strong>Status:</strong> {car.status} */}
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
              <div className="alert alert-info">No cars available</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarsPage;
