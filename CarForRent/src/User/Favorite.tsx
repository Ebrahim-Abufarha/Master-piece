import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  color: string;
  description: string;
  location: string;
  price_per_day: number;
  price_per_month: number | null;
  status: 'available' | 'rented';
  car_type: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  images: CarImage[];
}

interface CarImage {
  id: number;
  image_path: string;
}

interface Favorite {
  id: number;
  car: Car;
}

export default function FavoriteCars() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/favorites/${localStorage.getItem('user_id')}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFavorites(response.data.data);
      } catch (err) {
        setError('Failed to fetch favorite cars');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (carId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/favorites/${carId}/${localStorage.getItem('user_id')}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFavorites(favorites.filter(fav => fav.car.id !== carId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite');
    }
  };

  const navigateToCarDetails = (carId: number) => {
    navigate(`/car-single/${carId}`);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <div className="containerr" id='d'>
      <h1 id='s' className="mb-4">Your Favorite Cars</h1>
      
      {favorites.length === 0 ? (
        <div className="alert alert-info">
          You don't have any favorite cars yet.
        </div>
      ) : (
        <div className="row">
          {favorites.map(favorite => (
            <div key={favorite.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {favorite.car.images.length > 0 && (
                  <img 
                    src={`http://localhost:8000/storage/${favorite.car.images[0].image_path}`} 
                    className="card-img-top" 
                    alt={favorite.car.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{favorite.car.name}</h5>
                  <p className="card-text text-muted">{favorite.car.car_type}</p>
                  <p className="card-text">
                    <i className="fas fa-map-marker-alt"></i> {favorite.car.location}
                  </p>
                  <p className="card-text">
                    <strong>JD{favorite.car.price_per_day}</strong> per day
                  </p>
                  <div className="d-flex justify-content-between">
                    <button 
                      onClick={() => navigateToCarDetails(favorite.car.id)}
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => removeFavorite(favorite.car.id)}
                      className="btn btn-outline-danger"
                    >
                      <i className="fas fa-heart-broken"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}