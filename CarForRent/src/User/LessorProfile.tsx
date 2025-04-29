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
      <div className="card mb-5 border-0 shadow-sm">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <div className="ratio ratio-1x1">
              <img
                src={`http://localhost:8000/storage/${lessor.image}`}
                className="img-fluid rounded-start object-fit-cover"
                alt={lessor.name}
                style={{
                  borderTopLeftRadius: '0.375rem',
                  borderBottomLeftRadius: '0.375rem'
                }}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="card-body p-4 p-lg-5">
              <h2 className="card-title fw-bold mb-3">{lessor.name}</h2>
              
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-envelope-fill text-primary fs-5 me-3"></i>
                <span className="text-muted">{lessor.email}</span>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-telephone-fill text-primary fs-5 me-3"></i>
                <span className="text-muted">
                  {lessor.phone || 'Not provided'}
                </span>
              </div>
              
              <div className="d-flex align-items-center">
                <i className="bi bi-geo-alt-fill text-primary fs-5 me-3"></i>
                <span className="text-muted">
                  {lessor.address || 'Not provided'}
                </span>
              </div>
              
              <div className="mt-4 pt-2">
                <span className="badge bg-light text-dark fs-6 p-2">
                  <i className="bi bi-shield-check me-2"></i>
                  {lessor.role === 'lessor' ? 'Verified Lessor' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3
      style={{ textAlign:"center",color:"#01d28e" }} className="mb-4">Available Cars</h3>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {paginatedCars.map((car) => (
          <div key={car.id} className="col">
            <div className="card h-100">
              <div className="image-container" style={{
                height: '200px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={
                    car.images && car.images.length > 0
                      ? `http://localhost:8000/storage/${car.images[0].image_path}`
                      : '/images/default-car.jpg'
                  }
                  className="img-fluid"
                  alt={car.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{car.name}</h5>
                <p className="card-text">
                  <span className="badge bg-primary">{car.car_type}</span>
                  <span className="badge bg-secondary ms-2">{car.status}</span>
                </p>
                <p className="card-text mt-auto">
                  <strong>JD{car.price_per_day}</strong> per day
                </p>
                <div className="card-footer bg-transparent border-0 px-0 pb-0">
                  <a href={`/car-single/${car.id}`} className="btn btn-secondary w-100">
                    Details
                  </a>
                </div>
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
