import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
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
  location:string;
}

interface Booking {
  start_date: string;
  end_date: string;
}

interface PaymentSummary {
  days: number;
  basePrice: number;
  totalPrice: number;
  deposit: number;
  additionalFee: number;
}

const ITEMS_PER_PAGE = 6;

const getImage = (car: Car & { images?: { image_path: string }[] }): string => {
  return car.images && car.images.length > 0
    ? `http://localhost:8000/storage/${car.images[0].image_path}`
    : '/images/default-car.jpg';
};

export default function Cars() {
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<'cash' | 'card'>('card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch cars data on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/cars') 
      .then(response => response.json())
      .then(data => {
        setCars(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      })
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      const user_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (!user_id || !token) return;

      try {
        const response = await fetch(`http://localhost:8000/api/favorites/${user_id}`, {
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

  // Filter cars based on search term and category
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const carName = car.name ? car.name.toLowerCase() : '';
      const carCategory = car.car_type ? car.car_type.toLowerCase() : '';
    
      return (
        (carName.includes(searchTerm.toLowerCase()) || 
        carCategory.includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'All' || car.car_type === selectedCategory)
      );
    });
  }, [cars, searchTerm, selectedCategory]);
  
  // Update total pages and reset to first page when filters change
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);
    setCurrentPage(1);
  }, [filteredCars.length]);

  // Calculate current page's cars
  const currentCars = useMemo(() => {
    console.log('Recalculating currentCars for page:', currentPage);
    const indexOfLastCar = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstCar = indexOfLastCar - ITEMS_PER_PAGE;
    return filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  }, [currentPage, filteredCars, ITEMS_PER_PAGE]);

  // Log when current page changes for debugging
  useEffect(() => {
    console.log('Current page changed to:', currentPage);
    console.log('Current cars:', currentCars);
  }, [currentPage, currentCars]);

  const fetchBookings = async (carId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/car-single/${carId}`);
      const data = await response.json();
      setBookings(data?.bookedDates || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookingClick = (car: Car): void => {
    setSelectedCar(car);
    fetchBookings(car.id);
    setShowModal(true);
  };

  const handleStartDateChange = (date: Date | null): void => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleFavoriteClick = async (carId: number): Promise<void> => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
  
    if (!user_id || !token) {
      alert("Please login");
      return;
    }
  
    try {
      if (favorites.includes(carId)) {
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

  const handleProceedToPayment = (): void => {
    if (!startDate || !endDate || !selectedCar) {
      alert("Please select a start and end date.");
      return;
    }
    if (!termsAccepted) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProcessPayment = async (): Promise<void> => {
    if (!startDate || !endDate || !selectedCar) {
      alert("Please select a start and end date.");
      return;
    }
  
    if (paymentType === 'card') {
      if (
        !paymentInfo.cardNumber ||
        !paymentInfo.cardHolder ||
        !paymentInfo.expiryDate ||
        !paymentInfo.cvv
      ) {
        alert("Please fill in all payment details.");
        return;
      }
  
      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }
  
      if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        alert("Please enter a valid CVV.");
        return;
      }
    }
  
    setPaymentProcessing(true);
  
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You must be logged in to book a car.");
      setPaymentProcessing(false);
      return;
    }
  
    const days = Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24));
    const basePrice = days * selectedCar.price_per_day;
    const totalPrice = paymentType === 'cash' ? basePrice + 5 : basePrice;
    const status = 'confirmed';
    const amountToSend = paymentType === 'cash' ? 20 : totalPrice;
  
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
          total: amountToSend,
          status: status,
          payment_type: paymentType,
        })
      });
  
      alert(`Booking confirmed successfully!`);
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

  // Pagination handler - extracted for clarity and stability
  const paginate = (pageNumber: number): void => {
    console.log('Paginating to page:', pageNumber);
    setCurrentPage(pageNumber);
  };

  // Render pagination items with improved event handling
  const renderPaginationItems = (): JSX.Element[] => {
    const maxVisiblePages = 5;
    const items: JSX.Element[] = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item 
            key={number} 
            active={number === currentPage}
            onClick={() => {
              console.log('Clicked on page:', number);
              paginate(number);
            }}
            style={{ cursor: 'pointer' }}
          >
            {number}
          </Pagination.Item>
        );
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);
      
      if (leftBound > 1) {
        items.push(
          <Pagination.Item key={1} onClick={() => paginate(1)}>
            1
          </Pagination.Item>
        );
        if (leftBound > 2) {
          items.push(<Pagination.Ellipsis key="left-ellipsis" />);
        }
      }
      
      for (let number = leftBound; number <= rightBound; number++) {
        items.push(
          <Pagination.Item 
            key={number} 
            active={number === currentPage}
            onClick={() => {
              console.log('Clicked on page:', number);
              paginate(number);
            }}
          >
            {number}
          </Pagination.Item>
        );
      }
      
      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          items.push(<Pagination.Ellipsis key="right-ellipsis" />);
        }
        items.push(
          <Pagination.Item key={totalPages} onClick={() => paginate(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      }
    }
    
    return items;
  };

  const calculatePaymentSummary = (): PaymentSummary | null => {
    if (!startDate || !endDate || !selectedCar) return null;
    
    const days = Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24));
    const basePrice = days * selectedCar.price_per_day;
    const totalPrice = paymentType === 'cash' ? basePrice + 5 : basePrice;
    const deposit = paymentType === 'cash' ? 20 : totalPrice;
    
    return {
      days,
      basePrice,
      totalPrice,
      deposit,
      additionalFee: paymentType === 'cash' ? 5 : 0
    };
  };

  const paymentSummary = calculatePaymentSummary();
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
          .pagination-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
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
            
            {currentCars.length > 0 ? (
              currentCars.map((car) => (
                <div key={car.id} className="col-md-4">
                  <div className="car-wrap rounded ftco-animate">
                    <div
                      className="img rounded d-flex align-items-end"
                      style={{ backgroundImage: `url(${getImage(car)})` }}
                    >
                    </div>
                    <div className="text">
                      <h2 className="mb-0">
                        <a href={`car-single/${car.id}`}>{car.name}</a>
                        <span 
                          style={{ paddingLeft: "150px", cursor: "pointer" }} 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavoriteClick(car.id);
                          }}
                        >
                                                    {/* <FaHeart color={favorites.includes(car.id) ? "#01d28e" : "#ccc"} /> */}


                        </span>
                      </h2>
                      
                      {car.lessor && (<>
                      <div className="" style={{ display:"flex",justifyContent:"space-between" }}>
                        <div
                        className="lessor-info mb-2">
                          <span className="text-muted">By: </span>    
                          <a href={`Carlessors/${car.lessor.id}`}>{car.lessor.name}</a>

                        </div>
                        <div className="zzzzz">
  <span 
                          style={{ paddingLeft: "150px", cursor: "pointer" }} 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavoriteClick(car.id);
                          }}
                        >
                                                    <FaHeart color={favorites.includes(car.id) ? "#01d28e" : "#ccc"} />


                        </span>
                        </div>
                        
                        </div>
                        </>
                      )}
                      
                      <div
                       className="d-flex mb-3"
                       style={{ justifyContent:"space-between" }}>
                        <span className="cat">color: {car.color}</span>
                        <span className="cat">location: {car.location}</span>
                        {/* <span className="cat">{car.description}</span> */}
                      </div>                      
                      
                        <p className="price ml-auto">JD{car.price_per_day} <span>/day</span></p>

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
              ))
            ) : (
              <div className="col-12 text-center">
                <h4>No cars found matching your criteria</h4>
              </div>
            )}
          </div>
          
          {filteredCars.length > ITEMS_PER_PAGE && (
            <div className="pagination-container">
             <Pagination>
  {renderPaginationItems()}
</Pagination>

            </div>
          )}
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
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  required 
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                />
                <label htmlFor="terms">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTerms(true);
                    }}
                    className="text-blue-600 underline"
                  >
                    I accept the terms
                  </a>
                </label>
              </div>

              {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl max-w-lg shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Car Rental Terms</h2>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                      <li>The renter must be at least 21 years old.</li>
                      <li>A valid driver's license is required.</li>
                      <li>Late returns will incur additional fees.</li>
                      <li>Damage to the car will be the renter's responsibility.</li>
                    </ul>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      <button
                        onClick={() => setShowTerms(false)}
                        className="px-4 py-2 bg-blue-600 text-dark rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {startDate && endDate && selectedCar && (
                <div className="mt-3 p-3 bg-light rounded">
                  <p className="mb-1"><strong>Booking Summary:</strong></p>
                  <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">
                    Duration: {Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24))} days
                  </p>
                  <p className="mb-0 font-weight-bold">
                    Total Price: JD{Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * selectedCar.price_per_day}
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
                <Form.Label>Payment Method</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Credit/Debit Card"
                    name="paymentType"
                    value="card"
                    checked={paymentType === 'card'}
                    onChange={() => setPaymentType('card')}
                    id="payment-card"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Cash on Delivery (+JD 5 fee)"
                    name="paymentType"
                    value="cash"
                    checked={paymentType === 'cash'}
                    onChange={() => setPaymentType('cash')}
                    id="payment-cash"
                  />
                </div>
              </Form.Group>
              
              {paymentType === 'card' && (
                <>
                  <Form.Group>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={16}
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
                </>
              )}
              
              {paymentType === 'cash' && (
                <>
                  <div className="alert alert-info">
                    <p className="mb-0">Pay a JD 20 deposit now to secure your booking. 
                    The remaining amount will be collected at pickup. A JD 5 processing fee applies to cash payments.</p>
                  </div>
                  
                  <Form.Group>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={16}
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
                </>
              )}
            </Form>
            
            {paymentSummary && (
              <div className="payment-summary mt-4 p-3 bg-light rounded">
                <h6 className="mb-3">Payment Summary</h6>
                <p className="mb-1">Vehicle: {selectedCar?.name}</p>
                <p className="mb-1">Duration: {paymentSummary.days} days</p>
                {startDate && <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>}
                {endDate && <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>}
                <p className="mb-1">Base Price: JD{paymentSummary.basePrice}</p>
                
                {paymentType === 'cash' && (
                  <>
                    <p className="mb-1">Cash Processing Fee: +JD{paymentSummary.additionalFee}</p>
                    <p className="mb-1">Total Amount: JD{paymentSummary.totalPrice}</p>
                    <p className="mb-1 font-weight-bold">Due Now (Deposit): JD{paymentSummary.deposit}</p>
                    <p className="mb-0">Due at Pickup: JD{paymentSummary.totalPrice - paymentSummary.deposit}</p>
                  </>
                )}
                
                {paymentType === 'card' && (
                  <p className="mb-0 font-weight-bold">
                    Total Amount Due Now: JD{paymentSummary.totalPrice}
                  </p>
                )}
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
            disabled={(paymentType === 'card' && (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv)) 
              || (paymentType === 'cash' && (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv))
              || paymentProcessing}
          >
            {paymentProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              paymentType === 'cash' ? 'Pay JD 20 Deposit' : 'Complete Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}