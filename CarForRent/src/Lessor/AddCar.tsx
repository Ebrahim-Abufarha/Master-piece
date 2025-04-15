import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface CarFormData {
  name: string;
  color: string;
  description: string;
  price_per_day: string;
  location: string;
  car_type: string;
  seats: string;
  transmission: string;
  fuel_type: string;
  images: File[];
}

const AddCarPage: React.FC = () => {
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    color: '',
    description: '',
    price_per_day: '',
    location: '',
    car_type: 'Sedan',
    seats: '4',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    images: []
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const lessorId = localStorage.getItem('user_id');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate image types
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        setError('Only JPG, JPEG, PNG & GIF files are allowed');
        return;
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...previews]);
      setError('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', lessorId || '');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price_per_day', formData.price_per_day);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('car_type', formData.car_type);
      formDataToSend.append('seats', formData.seats);
      formDataToSend.append('transmission', formData.transmission);
      formDataToSend.append('fuel_type', formData.fuel_type);

      formData.images.forEach(image => {
        formDataToSend.append('images[]', image);
      });

      await axios.post(`http://localhost:8000/api/lessor/cars`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/lessor/LessorCarsPage');
    } catch (err) {
      setError('Failed to add car. Please try again.');
      console.error('Error adding car:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <Container>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="mb-4">Add New Car</Card.Title>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Car Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="color">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="price_per_day">
                    <Form.Label>Price per Day ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price_per_day"
                      value={formData.price_per_day}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="car_type">
                    <Form.Label>Car Type</Form.Label>
                    <Form.Select
                      name="car_type"
                      value={formData.car_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Convertible">Convertible</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="seats">
                    <Form.Label>Seats</Form.Label>
                    <Form.Control
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="transmission">
                    <Form.Label>Transmission</Form.Label>
                    <Form.Select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      required
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="fuel_type">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="images">
                <Form.Label>Car Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleImageChange}
                  required
                />
                <Form.Text className="text-muted">
                  Upload at least one image (JPG, JPEG, PNG, GIF only)
                </Form.Text>
              </Form.Group>

              {previewImages.length > 0 && (
                <div className="mb-3">
                  <h6>Image Previews:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="position-relative" style={{ width: '100px' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          style={{ height: '80px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                          onClick={() => removeImage(index)}
                          style={{ transform: 'translate(50%, -50%)' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/lessor/cars')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || formData.images.length === 0}
                >
                  {loading ? 'Adding...' : 'Add Car'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddCarPage;