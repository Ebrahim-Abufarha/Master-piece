import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaHeart } from 'react-icons/fa';


interface CarImage {
  image_path: string;
}
interface Lessor {
  id: number;
  name: string;
}
interface Car {
  id: number;
  name: string;
  color: string;
  description: string;
  car_type: string;
  price_per_day: number;
  images?: CarImage[];
  lessor?: Lessor;
}

interface Booking {
  start_date: string;
  end_date: string;
}

const getImage = (car: Car & { images?: { image_path: string }[] }) => {
  return car.images && car.images.length > 0
    ? `http://localhost:8000/storage/${car.images[0].image_path}`
    : '/images/default-car.jpg';
};

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/cars') 
      .then(response => response.json())
      .then(data => {
        setCars(data);
      })
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (!user_id || !token) return;

      try {
        const response = await fetch(`http://localhost:8000/api/favorites/  ${user_id}`, {
          headers: {
            
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFavorites(data.data.map((fav: { car_id: number }) => fav.car_id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const fetchBookings = async (carId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/car-single/${carId}`);
      const data = await response.json();
      setBookings(data?.bookedDates || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookingClick = (car: Car) => {
    setSelectedCar(car);
    fetchBookings(car.id);
    setShowModal(true);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleFavoriteClick = async (carId: number) => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
  
    if (!user_id || !token) {
      alert("Please login");
      return;
    }
  
    try {
      if (favorites.includes(carId)) {
        // إزالة السيارة من المفضلة
        const response = await fetch(`http://localhost:8000/api/favorites/${carId}/${user_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          setFavorites(favorites.filter((id) => id !== carId));
        } else {
          alert("Failed to remove from favorites.");
        }
      } else {
        // إضافة السيارة إلى المفضلة
        const response = await fetch("http://localhost:8000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            car_id: carId,
            user_id: user_id,
          }),
        });
  
        if (response.ok) {
          setFavorites([...favorites, carId]);
        } else {
          alert("Failed to add to favorites.");
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("An error occurred while updating favorites.");
    }
  };

  const isDateBooked = (date: Date): boolean => {
    return bookings.some(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      return date >= start && date <= end;
    });
  };

  const isEndDateDisabled = (date: Date): boolean => {
    if (!startDate) return true;
    if (date < startDate) return true;
    
    const tempDate = new Date(startDate);
    while (tempDate <= date) {
      if (isDateBooked(tempDate)) return true;
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return false;
  };

  const handleProceedToPayment = () => {
    if (!startDate || !endDate || !selectedCar) {
      alert("Please select a start and end date.");
      return;
    }
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProcessPayment = async () => {
    if (!startDate || !endDate || !selectedCar) {
      alert("Please select a start and end date.");
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }

    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      alert("Please enter a valid CVV (3 or 4 digits).");
      return;
    }

    setPaymentProcessing(true);

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You must be logged in to book a car.");
      setPaymentProcessing(false);
      return;
    }

    const days = Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * selectedCar.price_per_day;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          car_id: selectedCar.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          total: totalPrice,
          status: 'confirmed'
        })
      });

      alert("Payment successful! Your booking has been confirmed.");
      setShowPaymentModal(false);
      setPaymentProcessing(false);

      setPaymentInfo({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });

      setStartDate(null);
      setEndDate(null);

      fetchBookings(selectedCar.id);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  const highlightWithRed = (date: Date): string => {
    return isDateBooked(date) ? "booked-date" : "";
  };

  const filteredCars = cars.filter(car => {
    const carName = car.name ? car.name.toLowerCase() : '';
    const carCategory = car.car_type ? car.car_type.toLowerCase() : '';
  
    return (
      (carName.includes(searchTerm.toLowerCase()) || carCategory.includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All' || car.car_type === selectedCategory)
    );
  });

  return (
    <>
      <style>
        {`
          .booked-date {
            background-color: #ffcccb !important;
            border-radius: 0;
            color: #999 !important;
            text-decoration: line-through;
          }
          .react-datepicker__day--disabled {
            color: #ccc !important;
            text-decoration: line-through;
          }
        `}
      </style>

      <section
      id='le'
        className="hero-wrap hero-wrap-2 js-fullheight"
        style={{ backgroundImage: "url('/images/bg_3.jpg')" }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <a href="/">Home <i className="ion-ios-arrow-forward"></i></a>
                </span>
                <span>Cars <i className="ion-ios-arrow-forward"></i></span>
              </p>
              <h1 className="mb-3 bread">Choose Your Car</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by car name or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-12 mb-4">
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          {filteredCars.map((car) => (
  <div key={car.id} className="col-md-4">
    <div className="car-wrap rounded ftco-animate">
      <div
        className="img rounded d-flex align-items-end"
        style={{ backgroundImage: `url(${getImage(car)})` }}
      >
      </div>
      <div className="text">
        <h2 className="mb-0"><a href={`car-single/${car.id}`}>{car.name}</a><span 
  style={{ paddingLeft: "150px", cursor: "pointer" }} 
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFavoriteClick(car.id);
  }}
>
  <FaHeart color={favorites.includes(car.id) ? "#01d28e" : "#ccc"} />
</span></h2>
        {/*  */}
        {car.lessor && (
    <div key={car.id} className="lessor-info mb-2">
      <span className="text-muted">By: </span>    
      <a href={`lessors/${car.lessor.id}`}>{car.lessor.name}</a>
      </div>
  )}
  
        
        <div className="d-flex mb-3">
          <span className="cat">color: {car.color}</span>
          <span className="cat">{car.description}</span>
          <p className="price ml-auto">${car.price_per_day} <span>/day</span></p>
        </div>
        <p className="d-flex mb-0 d-block">
          <a 
            href="#" 
            className="btn btn-primary py-2 mr-1" 
            onClick={(e) => {
              e.preventDefault();
              handleBookingClick(car);
            }}
          >
            Book Now
          </a>
          <a href={`car-single/${car.id}`} className="btn btn-secondary py-2 ml-1">Details</a>
        </p>
      </div>
    </div>
  </div>
))}
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book This Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <>
              <div className="form-group mb-3">
                <label>Start Date</label>
                <DatePicker 
                  selected={startDate} 
                  onChange={handleStartDateChange}
                  className="form-control"
                  minDate={new Date()}
                  dayClassName={highlightWithRed}
                  filterDate={(date) => !isDateBooked(date)}
                  placeholderText="Select start date"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  required
                />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <DatePicker 
                  selected={endDate} 
                  onChange={(date: Date | null) => setEndDate(date)}
                  className="form-control"
                  minDate={startDate ? new Date(startDate.getTime() + 86400000) : new Date()}
                  filterDate={(date) => !isEndDateDisabled(date)}
                  placeholderText="Select end date"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  disabled={!startDate}
                  required
                  dayClassName={highlightWithRed}
                />
              </div>
              
              {startDate && endDate && selectedCar && (
                <div className="mt-3 p-3 bg-light rounded">
                  <p className="mb-1"><strong>Booking Summary:</strong></p>
                  <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">
                    Duration: {Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24))} days
                  </p>
                  <p className="mb-0 font-weight-bold">
                    Total Price: ${Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * selectedCar.price_per_day}
                  </p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleProceedToPayment} 
            disabled={!startDate || !endDate}
          >
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Payment Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="payment-card">
            <div className="payment-header">
              <h5>Car Rental Payment</h5>
            </div>
            
            <Form className="payment-form">
              <Form.Group>
                <Form.Label>Card Number</Form.Label>
                <Form.Control 
                  type="text" 
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Card Holder Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="cardHolder"
                  value={paymentInfo.cardHolder}
                  onChange={handlePaymentInfoChange}
                  placeholder="John Doe"
                  required
                />
              </Form.Group>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentInfoChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
            
            {startDate && endDate && selectedCar && (
              <div className="payment-summary">
                <h6 className="mb-3">Payment Summary</h6>
                <p className="mb-1">Vehicle: {selectedCar.name}</p>
                <p className="mb-1">Duration: {Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24))} days</p>
                <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>
                <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>
                <hr />
                <p className="mb-0 font-weight-bold">
                  Total Amount: ${Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * selectedCar.price_per_day}
                </p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleProcessPayment}
            disabled={!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv || paymentProcessing}
          >
            {paymentProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              'Complete Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}