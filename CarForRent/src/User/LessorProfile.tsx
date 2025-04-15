import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Lessor {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  image: string;
  role: string;
}

interface Car {
  id: number;
  name: string;
  price_per_day: number;
  car_type: string;
  status: string;
  images?: {
    image_path: string;
  }[];
}

export default function LessorProfile() {
  const { id } = useParams<{ id: string }>();
  const [lessor, setLessor] = useState<Lessor | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const carsPerPage = 4;
  const totalPages = Math.ceil(cars.length / carsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessorRes, carsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/lessors/${id}`),
          axios.get(`http://localhost:8000/api/lessors/${id}/cars`)
        ]);
        setLessor(lessorRes.data.data);
        setCars(carsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDotClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const paginatedCars = cars.slice(
    currentPage * carsPerPage,
    currentPage * carsPerPage + carsPerPage
  );

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!lessor) return <div className="text-center py-5">Lessor not found</div>;

  return (
    <div id='d' className="containe">
      <div className="card mb-4">
        <div className="row g-0">
          <div id='r' className="col-md-4">
            <img
              src={`http://localhost:8000/storage/${lessor.image}`}
              className="img-fluid rounded-start"
              alt={lessor.name}
            />
          </div>
          <div id='ggg' className="col-md-8">
            <div className="card-body">
              <h2 className="card-title">{lessor.name}</h2>
              <p className="card-text">
                <i className="bi bi-envelope"></i> {lessor.email}<br />
                <i className="bi bi-telephone"></i> {lessor.phone}<br />
                <i className="bi bi-geo-alt"></i> {lessor.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 id='u' className="mb-4">Available Cars</h3>
      <div  className="row row-cols-1 row-cols-md-4 g-4">
        {paginatedCars.map((car) => (
          <div key={car.id} className="col">
            <div className="card h-100">
              <img
                src={
                  car.images && car.images.length > 0
                    ? `http://localhost:8000/storage/${car.images[0].image_path}`
                    : '/images/default-car.jpg'
                }
                className="card-img-top"
                alt={car.name}
              />
              <div className="card-body">
                <h5 className="card-title">{car.name}</h5>
                <p className="card-text">
                  <span  className="badge bg-primary">{car.car_type}</span>
                  <span  className="badge bg-secondary ms-2">{car.status}</span>
                </p>
                <p className="card-text">
                  <strong>${car.price_per_day}</strong> per day
                </p>
              </div>
              <div className="card-footer">
                <a href={`/car-single/${car.id}`} className="btn btn-secondary">
                  Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`dot mx-1 ${index === currentPage ? 'active' : ''}`}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === currentPage ? '#0d6efd' : '#ccc',
                border: 'none',
                cursor: 'pointer',
              }}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
