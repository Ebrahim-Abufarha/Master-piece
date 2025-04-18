import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface CarImage {
  id: number;
  image_path: string;
}

interface CarData {
  name: string;
  color: string;
  description: string;
  price_per_day: string;
  images?: CarImage[];
}

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carData, setCarData] = useState<CarData>({
    name: '',
    color: '',
    description: '',
    price_per_day: '',
  });
  const [newImages, setNewImages] = useState<File[]>([]);

  const [images, setImages] = useState<CarImage[]>([]);
  const [loading, setLoading] = useState(true);
  const lessorId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!lessorId) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    const fetchCar = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/lessor/cars/${id}/${lessorId}`
          );
          
          console.log("Full response:", response);
          
          if (response.data && response.data.data) {
            const carData = response.data.data;
            console.log("Car data:", carData);
            
            setCarData({
              name: carData.name || '',
              color: carData.color || '',
              description: carData.description || '',
              price_per_day: carData.price_per_day || '',
            });
            
            if (carData.images && carData.images.length > 0) {
              console.log("Images:", carData.images);
              setImages(carData.images);
            } else {
              console.log("No images found");
              setImages([]);
            }
          } else {
            console.error("Unexpected response structure:", response.data);
            alert('Unexpected data structure received from server');
          }
        } catch (error) {
          console.error('Error fetching car:', error);
          alert('Failed to load car data');
          navigate('/lessor/LessorCarsPage');
        } finally {
          setLoading(false);
        }
      };

    fetchCar();
  }, [id, lessorId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

const handleDeleteImage = (imageId: number) => {
  setImagesToDelete([...imagesToDelete, imageId]);
  setImages(images.filter(img => img.id !== imageId));
};
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!lessorId) {
      alert('Please login first');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('color', carData.color);
    formData.append('description', carData.description);
    formData.append('price_per_day', carData.price_per_day);
    formData.append('_method', 'PUT');
    
    newImages.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    
    if (imagesToDelete.length > 0) {
      formData.append('images_to_delete', JSON.stringify(imagesToDelete));
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/lessor/cars/${id}/${lessorId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log('Update response:', response.data);
      alert('Car updated successfully!');
      navigate('/lessor/LessorCarsPage');
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car. Please try again.');
    }
  };
  if (loading) {
    return <div>Loading car data...</div>;
  }

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <h2>Edit Car</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label>Name</label>
    <input type="text" name="name" className="form-control" 
           value={carData.name} onChange={handleChange} required />
  </div>

  <div className="mb-3">
    <label>Color</label>
    <input type="text" name="color" className="form-control" 
           value={carData.color} onChange={handleChange} required />
  </div>
  
  <div className="mb-3">
    <label>Price Per Day</label>
    <input type="text" name="price_per_day" className="form-control" 
           value={carData.price_per_day} onChange={handleChange} required />
  </div>
  
  <div className="mb-3">
    <label>Description</label>
    <textarea name="description" className="form-control" rows={3} 
              value={carData.description} onChange={handleChange} />
  </div>
  
  <div className="mb-3">
  <label>Current Images</label><br />
  {images.length > 0 ? (
    images.map((img) => (
      <div key={img.id} style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
        <img 
          src={`http://localhost:8000/storage/${img.image_path}`} 
          alt="Car" 
          style={{ 
            width: '200px', 
            height: '150px', 
            objectFit: 'cover'
          }} 
        />
        <button 
          type="button" 
          className="btn btn-danger btn-sm" 
          style={{ position: 'absolute', top: '5px', right: '5px' }}
          onClick={() => handleDeleteImage(img.id)}
        >
          ×
        </button>
      </div>
    ))
  ) : (
    <p>No images available</p>
  )}
</div>

  <div className="mb-3">
  <label>Add New Images</label>
  <input type="file" className="form-control" multiple onChange={handleImageChange} />
</div>

  <button type="submit" className="btn btn-primary">Update</button>
  <button type="button" className="btn btn-secondary ms-2" 
          onClick={() => navigate('/lessor/LessorCarsPage')}>
    Cancel
  </button>
</form>
    </div>
  );
};

export default EditCar;