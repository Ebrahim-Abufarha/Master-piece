import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Row, Col, Modal, InputGroup } from 'react-bootstrap';
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
  add: boolean;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
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
    images: [],
    add: false
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentDetails>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const lessorId = localStorage.getItem('user_id');

  // Current year for expiry validation
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Show popup when checkbox is checked
    if (name === 'add' && checked) {
      setShowAdModal(true);
    }
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name as keyof PaymentDetails]: value }));
    
    // Clear validation error when field is edited
    if (paymentErrors[name as keyof PaymentDetails]) {
      setPaymentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof PaymentDetails];
        return newErrors;
      });
    }
  };

  const handleModalClose = (): void => {
    setShowAdModal(false);
  };

  const handleModalConfirm = (): void => {
    setShowAdModal(false);
    setShowPaymentModal(true);
  };

  const handleModalCancel = (): void => {
    setFormData(prev => ({ ...prev, add: false }));
    setShowAdModal(false);
  };

  const handlePaymentModalClose = (): void => {
    if (!paymentSuccess) {
      setFormData(prev => ({ ...prev, add: false }));
    }
    setShowPaymentModal(false);
  };

  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentDetails(prev => ({ ...prev, cardNumber: formattedValue }));
    
    // Clear validation error
    if (paymentErrors.cardNumber) {
      setPaymentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  const validatePayment = (): boolean => {
    const errors: Partial<PaymentDetails> = {};
    
    // Card number validation (16 digits)
    const cardDigits = paymentDetails.cardNumber.replace(/\s/g, '');
    if (!cardDigits || cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Card holder validation
    if (!paymentDetails.cardHolder.trim()) {
      errors.cardHolder = 'Please enter the cardholder name';
    }
    
    // CVV validation (3 or 4 digits)
    if (!paymentDetails.cvv || !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = 'Please enter a valid CVV code (3-4 digits)';
    }
    
    // Expiry date validation
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const selectedYear = parseInt(paymentDetails.expiryYear);
    const selectedMonth = parseInt(paymentDetails.expiryMonth);
    
    if (!paymentDetails.expiryMonth) {
      errors.expiryMonth = 'Please select a month';
    }
    
    if (!paymentDetails.expiryYear) {
      errors.expiryYear = 'Please select a year';
    }
    
    if (selectedYear === currentYear && selectedMonth < currentMonth) {
      errors.expiryMonth = 'Card has expired';
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processPayment = async (): Promise<boolean> => {
    // This would connect to your payment processor in a real application
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Simulate successful payment
      }, 1500);
    });
  };

  const handlePaymentSubmit = async (): Promise<void> => {
    if (!validatePayment()) {
      return;
    }
    
    setPaymentLoading(true);
    
    try {
      const paymentResult = await processPayment();
      
      if (paymentResult) {
        setPaymentSuccess(true);
        // Set timeout to close the modal after showing success message
        setTimeout(() => {
          setShowPaymentModal(false);
        }, 2000);
      } else {
        setPaymentErrors({ cardNumber: 'Payment failed. Please try again.' });
      }
    } catch {
      setPaymentErrors({ cardNumber: 'Payment processing error. Please try again.' });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
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

  const removeImage = (index: number): void => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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
      
      formDataToSend.append('add', formData.add ? '20.00' : '');
      
      if (formData.add) {
        formDataToSend.append('ad_fee', '20');
      }

      if (formData.add) {
        formDataToSend.append('advertisement_fee', '20');
      }

      formData.images.forEach(image => {
        formDataToSend.append('images[]', image);
      });

      console.log('Sending data to server:', Object.fromEntries(formDataToSend));
      
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
                    <Form.Label>Price per Day (JD)</Form.Label>
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

              {/* Advertisement Checkbox */}
              <Form.Group className="mb-3" controlId="add">
                <Form.Check
                  type="checkbox"
                  name="add"
                  label="Add advertisement for this car (JD20/month)"
                  checked={formData.add}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>

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

      {/* Advertisement Confirmation Modal */}
      <Modal show={showAdModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Advertisement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to add an advertisement for this car listing.</p>
          <p>This will cost <strong>JD 20 per month</strong> and will be charged with your registration.</p>
          <p>Would you like to continue to payment?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalConfirm}>
            Continue to Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal - تصميم محسّن */}
      <Modal show={showPaymentModal} onHide={handlePaymentModalClose} backdrop="static" size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-credit-card me-2"></i>
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentSuccess ? (
            <div className="text-center py-4">
              <div className="mb-4" style={{ fontSize: '60px', color: '#28a745' }}>
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <Alert variant="success" className="mb-4">
                <Alert.Heading className="text-center">Payment Successful!</Alert.Heading>
                <p className="text-center mb-0">Your advertisement has been added to your car listing.</p>
              </Alert>
            </div>
          ) : (
            <Form>
              <div className="mb-4 bg-light p-3 rounded border">
                <h5 className="text-primary">Advertisement Fee</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Monthly Advertisement</span>
                  <span className="fw-bold">JD 20.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-primary fs-5">JD 20.00</span>
                </div>
              </div>
              
              <Row className="mb-4">
                <Col>
                  <div className="mb-3 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <i className="bi bi-credit-card fs-4 text-primary"></i>
                      <i className="bi bi-paypal fs-4 text-primary"></i>
                      <i className="bi bi-currency-bitcoin fs-4 text-primary"></i>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Form.Group className="mb-3" controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-credit-card"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    isInvalid={!!paymentErrors.cardNumber}
                    maxLength={19}
                  />
                  <Form.Control.Feedback type="invalid">
                    {paymentErrors.cardNumber}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cardHolder">
                <Form.Label>Cardholder Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-person"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="cardHolder"
                    value={paymentDetails.cardHolder}
                    onChange={handlePaymentChange}
                    placeholder="Name as appears on card"
                    isInvalid={!!paymentErrors.cardHolder}
                  />
                  <Form.Control.Feedback type="invalid">
                    {paymentErrors.cardHolder}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Row className="mb-3">
                <Col md={8}>
                  <Form.Label>Expiry Date</Form.Label>
                  <Row>
                    <Col>
                      <Form.Group controlId="expiryMonth">
                        <InputGroup>
                          <InputGroup.Text><i className="bi bi-calendar-month"></i></InputGroup.Text>
                          <Form.Select
                            name="expiryMonth"
                            value={paymentDetails.expiryMonth}
                            onChange={handlePaymentChange}
                            isInvalid={!!paymentErrors.expiryMonth}
                          >
                            <option value="">Month</option>
                            {months.map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {paymentErrors.expiryMonth}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="expiryYear">
                        <Form.Select
                          name="expiryYear"
                          value={paymentDetails.expiryYear}
                          onChange={handlePaymentChange}
                          isInvalid={!!paymentErrors.expiryYear}
                        >
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {paymentErrors.expiryYear}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="cvv">
                    <Form.Label>CVV</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><i className="bi bi-lock"></i></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength={4}
                        isInvalid={!!paymentErrors.cvv}
                      />
                      <Form.Control.Feedback type="invalid">
                        {paymentErrors.cvv}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="mb-3 text-muted small">
                <i className="bi bi-shield-lock me-1"></i>
                Your payment information is encrypted and secure.
              </div>
            </Form>
          )}
        </Modal.Body>
        {!paymentSuccess && (
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handlePaymentModalClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePaymentSubmit}
              disabled={paymentLoading}
              className="px-4"
            >
              {paymentLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>Pay JD 20.00</>
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default AddCarPage;