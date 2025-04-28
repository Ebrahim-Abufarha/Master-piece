import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button, Form } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarImage {
  id: number;
  car_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Car {
  id: number;
  user_id: number;
  name: string;
  color: string;
  description: string;
  location: string;
  price_per_day: number;
  price_per_month: number | null;
  status: 'available' | 'rented';
  car_type: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Coupe' | 'Convertible' | 'Other';
  seats: number;
  transmission: string;
  fuel_type: string;
  add: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  images?: CarImage[];
  lessor?: User;
}

interface Booking {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: number;
  user_id: number;
  car_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  paymentType: 'card' | 'cash';
  depositPaymentDetails?: string;
}

const getImage = (car: Car & { images?: { image_path: string }[] }) => {
  return car.images && car.images.length > 0
    ? `http://localhost:8000/storage/${car.images[0].image_path}`
    : '/images/default-car.jpg';
};

export default function CarSingle() {

   const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paymentType: 'card'
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams<{ id: string }>();

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setEndDate(null);
  };

  const isDateBooked = (date: Date): boolean => {
    try {
      if (!date) return false;
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      return bookings.some(booking => {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date);
        bookingStart.setHours(0, 0, 0, 0);
        bookingEnd.setHours(0, 0, 0, 0);
        return checkDate >= bookingStart && checkDate <= bookingEnd;
      });
    } catch (error) {
      console.error("Error in isDateBooked:", error);
      return false;
    }
  };
  
  const isEndDateDisabled = (date: Date): boolean => {
    if (!startDate) return true;
    if (date < startDate) return true;
    
    const tempDate = new Date(startDate);
    tempDate.setDate(tempDate.getDate() + 1);
    
    while (tempDate <= date) {
      if (isDateBooked(new Date(tempDate))) {
        return true;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return false;
  };
  
  const handleProceedToPayment = () => {
    if (!termsAccepted) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }
  
    if (!startDate || !endDate || !car) {
      alert("Please select a start and end date.");
      return;
    }
    
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You must be logged in to book a car.");
      return;
    }
    
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!startDate || !endDate || !car) {
      alert("Please select a start and end date.");
      return;
    }
  
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You must be logged in to book a car.");
      return;
    }
  
    // Validate payment information
    if (paymentInfo.paymentType === 'card') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        alert("Please fill in all payment details.");
        return;
      }
  
      // Basic card number validation (should be 16 digits)
      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }
  
      // Basic CVV validation (should be 3 or 4 digits)
      if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        alert("Please enter a valid CVV (3 or 4 digits).");
        return;
      }
    } else if (paymentInfo.paymentType === 'cash') {
      // Ensure deposit is paid for cash payment
      // Removed the alert and confirmation logic
    }
  
    setPaymentProcessing(true);
  
    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      alert("Invalid user ID. Please login again.");
      setPaymentProcessing(false);
      return;
    }
  
    const days = Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * (car.price_per_day || 0);
  
    const paymentType = paymentInfo.paymentType;
    const totalAmount = paymentType === 'cash' ? totalPrice + 5 : totalPrice;

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create the booking
      await axios.post('http://localhost:8000/api/bookings', {
        user_id: userIdNumber,
        car_id: car.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total: totalAmount,
        status: 'confirmed',
        payment_method: paymentType
      });
  
      alert("Payment successful! Your booking has been confirmed.");
      setShowPaymentModal(false);
      setPaymentProcessing(false);
      
      // Reset payment form
      setPaymentInfo({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        paymentType: 'card'
      });
      
      // Reset date selection
      setStartDate(null);
      setEndDate(null);
      
      if (car) {
        fetchBookings(car.id);
      }
    } catch (error: unknown) {
      setPaymentProcessing(false);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "There was an error processing your payment.");
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred during payment processing");
      }
    }
  };

  const fetchBookings = async (carId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings/car-single/${carId}`);
      const bookingsData = Array.isArray(response.data?.bookedDates) 
        ? response.data.bookedDates 
        : [];

      setBookings(bookingsData);

      const disabledDatesArray: Date[] = [];
      bookingsData.forEach((booking: Booking) => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        
        const currentDate = new Date(start);
        while (currentDate <= end) {
          disabledDatesArray.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      setDisabledDates(disabledDatesArray);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setDisabledDates([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to fetch reviews. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Car>(`http://localhost:8000/api/cars/${id}?with_lessor=true`);
        setCar(response.data);
        await fetchBookings(response.data.id);
        await fetchReviews();
        
        const allCarsResponse = await axios.get<Car[]>('http://localhost:8000/api/add');
        const filtered = allCarsResponse.data.filter(c => c.id !== parseInt(id || '0'));
        setRelatedCars(filtered);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const highlightWithRed = (date: Date): string => {
    return isDateBooked(date) ? "booked-date" : "";
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h2>Loading car details...</h2>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container text-center py-5">
        <h2>Car not found</h2>
      </div>
    );
  }

  async function handleAddComment(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();

    if (!newComment.trim() || rating === 0) {
      alert("Please provide a rating and a comment.");
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You must be logged in to add a comment.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/reviews', {
        user_id: parseInt(userId, 10),
        car_id: car?.id,
        rating,
        comment: newComment.trim(),
      });

      if (response.status === 201) {
        alert("Your review has been added successfully.");
        setReviews((prevReviews) => [...prevReviews, response.data]);
        setNewComment('');
        setRating(0);
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("There was an error adding your comment. Please try again.");
    }
  }

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
          .star-rating {
            font-size: 1.5rem;
            cursor: pointer;
          }
          .star-rating .star {
            color: #e4e5e9;
          }
          .star-rating .star.active {
            color: #ffc107;
          }
          .payment-form .form-group {
            margin-bottom: 20px;
          }
          .payment-form label {
            font-weight: 600;
          }
          .card-element {
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
          }
          .payment-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .payment-header {
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .payment-summary {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        `}
      </style>
      
      <section className="hero-wrap hero-wrap-2 js-fullheight" style={{ backgroundImage: "url('/images/bg_3.jpg')" }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Car details <i className="ion-ios-arrow-forward"></i></span></p>
              <h1 className="mb-3 bread">Car Details</h1>
            </div>
          </div>
        </div>
      </section>
      
      <section className="ftco-section ftco-car-details">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="car-details">
                <div className="car-images position-relative d-flex align-items-center justify-content-center mb-3" style={{ gap: '1rem' }}>
                  {car.images && car.images.length > 0 ? (
                    <>
                      <button
                        className="btn btn-dark position-absolute"
                        style={{ left: '10px', zIndex: 10 }}
                        onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (car.images?.length || 1) - 1 : prevIndex - 1))}
                      >
                        &lt;
                      </button>
                      <div
                        className="img rounded"
                        style={{
                          width: '100%',
                          height: '400px',
                          backgroundImage: `url(http://localhost:8000/storage/${car.images[currentImageIndex].image_path})`,
                          backgroundSize: 'contain', 
                          backgroundRepeat: 'no-repeat', 
                          backgroundPosition: 'center', 
                        }}
                      ></div>
                      <button
                        className="btn btn-dark position-absolute"
                        style={{ right: '10px', zIndex: 10 }}
                        onClick={() => setCurrentImageIndex((prevIndex) => (car.images && prevIndex === car.images.length - 1 ? 0 : (prevIndex + 1) % (car.images?.length || 1)))}
                      >
                        &gt;
                      </button>
                    </>
                  ) : (
                    <div                 
                      className="img rounded"
                      style={{
                        width: '100%',
                        height: '400px',
                        backgroundImage: `url(/images/default-car.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      
                    </div>
                  )}
                </div>
                <div className="row">
   <div className="col-md d-flex align-self-stretch ftco-animate">
     <div className="media block-6 services">
       <div className="media-body py-md-4">
         <div className="d-flex mb-3 align-items-center">
           <div className="icon d-flex align-items-center justify-content-center">
             <i className="fas fa-palette"></i>
           </div>
           <div className="text">
             <h3 className="heading mb-0 pl-3">
               Color
               <span> {car.color}</span>
             </h3>
           </div>
         </div>
       </div>
     </div>
   </div>
 
   <div className="col-md d-flex align-self-stretch ftco-animate">
     <div className="media block-6 services">
       <div className="media-body py-md-4">
         <div className="d-flex mb-3 align-items-center">
           <div className="icon d-flex align-items-center justify-content-center">
             <i className="fas fa-cogs"></i>
           </div>
           <div className="text">
             <h3 className="heading mb-0 pl-3">
               Transmission
               <span> {car.transmission}</span>
             </h3>
           </div>
         </div>
       </div>
     </div>
   </div>
 
   <div className="col-md d-flex align-self-stretch ftco-animate">
     <div className="media block-6 services">
       <div className="media-body py-md-4">
         <div className="d-flex mb-3 align-items-center">
           <div className="icon d-flex align-items-center justify-content-center">
             <i className="fas fa-chair"></i>
           </div>
           <div className="text">
             <h3 className="heading mb-0 pl-3">
               Seats
               <span> {car.seats} Adults</span>
             </h3>
           </div>
         </div>
       </div>
     </div>
   </div>
{/*  
   <div className="col-md d-flex align-self-stretch ftco-animate">
     <div className="media block-6 services">
       <div className="media-body py-md-4">
         <div className="d-flex mb-3 align-items-center">
           <div className="icon d-flex align-items-center justify-content-center">
             <i className="fas fa-circle"></i>
           </div>
           <div className="text">
             <h3 className="heading mb-0 pl-3">
               Status
               <span> {car.status}</span>
             </h3>
           </div>
         </div>
       </div>
     </div>
   </div> */}
 
   <div className="col-md d-flex align-self-stretch ftco-animate">
     <div className="media block-6 services">
       <div className="media-body py-md-4">
         <div className="d-flex mb-3 align-items-center">
           <div className="icon d-flex align-items-center justify-content-center">
             <i className="fas fa-gas-pump"></i>
           </div>
           <div className="text">
             <h3 className="heading mb-0 pl-3">
               Fuel
               <span> {car.fuel_type}</span>
             </h3>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
                <div className="text text-center">
                  <span className="subheading">{car.car_type}</span>
                  <h2>{car.name}</h2>
                  {car.lessor && (
                    <div className="lessor-info mb-3">
                      <p className="mb-0">Rented by:<a href={`/Carlessors/${car.lessor.id}`}>{car.lessor.name}</a>
                      </p>
                    </div>
                  )}
                  <p className="price">
                    <span>JD{car.price_per_day}</span> / day
                    <a onClick={() => setShowModal(true)} className="btn btn-primary py-2 mr-1" role="button">Book Now</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-12 pills">
              <div className="bd-example bd-example-tabs">
                <div className="d-flex justify-content-center">
                  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="pills-description-tab" data-toggle="pill" href="#pills-description" role="tab" aria-controls="pills-description" aria-expanded="true">Comments</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="pills-manufacturer-tab" data-toggle="pill" href="#pills-manufacturer" role="tab" aria-controls="pills-manufacturer" aria-expanded="true">Description</a>
                    </li>
                  </ul>
                </div>

                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-description" role="tabpanel" aria-labelledby="pills-description-tab">
                    <div className="row">
                      <div className="col-md-12">
                        <h4>Customer Reviews</h4>
                        
                        {reviews.length === 0 ? (
                          <p>No reviews yet</p>
                        ) : (
                          reviews.map(review => (
                            <div key={review.id} className="card mb-3">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <h5 className="card-title">{review.user?.name || 'Anonymous'}</h5>
                                  <div>
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e4e5e9' }}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="card-text">{review.comment}</p>
                                <small className="text-muted">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          ))
                        )}
                        
                        {localStorage.getItem('token') && !showCommentForm && (
                          <button 
                            onClick={() => setShowCommentForm(true)}
                            className="btn btn-primary mt-3"
                          >
                            Add Review
                          </button>
                        )}
                        
                        {showCommentForm && (
                          <div className="card mt-3">
                            <div className="card-body">
                              <h5 className="card-title">Write a Review</h5>
                              <div className="form-group">
                                <label>Rating</label>
                                <div>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      style={{ 
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        color: star <= rating ? '#ffc107' : '#e4e5e9'
                                      }}
                                      onClick={() => setRating(star)}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Your Review</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                />
                              </div>
                              <button 
                                onClick={handleAddComment}
                                className="btn btn-primary mr-2"
                              >
                                Submit
                              </button>
                              <button 
                                onClick={() => setShowCommentForm(false)}
                                className="btn btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="pills-manufacturer" role="tabpanel" aria-labelledby="pills-manufacturer-tab">
                    <p>{car.description}</p>
                    <p>Location: {car.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-no-pt">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 heading-section text-center ftco-animate mb-5">
              <span className="subheading">Choose Car</span>
              <h2 className="mb-2">Related Cars</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={4}
                slidesToScroll={4}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      infinite: true,
                      dots: true
                    }
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 2
                    }
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1
                    }
                  }
                ]}
              >
                {relatedCars.map((relatedCar) => (
                  <div className="px-2" key={relatedCar.id}>
                    <div className="car-wrap rounded ftco-animate">
                      <div
                        className="img rounded d-flex align-items-end"
                        style={{
                          backgroundImage: `url(${getImage(relatedCar)})`,
                          height: "200px",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div className="text p-3">
                        <h2 className="mb-0">
                          <a href={`/cars/${relatedCar.id}`} className="text-dark">
                            {relatedCar.name}
                          </a>
                        </h2>
                        <div className="d-flex mb-3">
                          <span className="cat text-muted">{relatedCar.car_type}</span>
                          <p className="price ml-auto mb-0">
                            JD{relatedCar.price_per_day} <span>/day</span>
                          </p>
                        </div>
                        <div className="d-flex">
                          <a href={`/car-single/${car.id}`} className="btn btn-secondary py-2 ml-1">Details</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book This Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              excludeDates={disabledDates}
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
        <input type="checkbox" required id="terms"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)} />
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
              {/* <li>Insurance is mandatory for all rentals.</li> */}
              <li>Late returns will incur additional fees.</li>
              {/* <li>Fuel policy: return with a full tank.</li> */}
              {/* <li>No smoking allowed in the vehicle.</li> */}
              <li>Damage to the car will be the renter's responsibility.</li>
            </ul>
            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <button
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 bg-blue-600 text-dark rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>)}
          
          {startDate && endDate && (
            <div className="mt-3 p-3 bg-light rounded">
              <p className="mb-1"><strong>Booking Summary:</strong></p>
              <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>
              <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>
              <p className="mb-1">
                Duration: {Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24))} days
              </p>
              <p className="mb-0 font-weight-bold">
                Total Price: JD{Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * car.price_per_day}
              </p>
            </div>
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

      {/* Payment Modal */}
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
                    checked={paymentInfo.paymentType === 'card'}
                    onChange={() => setPaymentInfo({ ...paymentInfo, paymentType: 'card' })}
                    id="payment-card"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Cash on Delivery (+JD5 fee)"
                    name="paymentType"
                    value="cash"
                    checked={paymentInfo.paymentType === 'cash'}
                    onChange={() => setPaymentInfo({ ...paymentInfo, paymentType: 'cash' })}
                    id="payment-cash"
                  />
                </div>
              </Form.Group>

              {paymentInfo.paymentType === 'card' && (
                <>
                  <Form.Group>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
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
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
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
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
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
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                </>
              )}

              {paymentInfo.paymentType === 'cash' && (
                <>
                  <div className="alert alert-info">
                    <p className="mb-0">
                      Pay a JD20 deposit now to secure your booking. The remaining amount will be collected at pickup. A JD5 processing fee applies to cash payments.
                    </p>
                  </div>
                  <Form.Group>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
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
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
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
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
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
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                </>
              )}

              {startDate && endDate && car && (
                <div className="payment-summary">
                  <h6 className="mb-3">Payment Summary</h6>
                  <p className="mb-1">Vehicle: {car.name}</p>
                  <p className="mb-1">Duration: {Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24))} days</p>
                  <p className="mb-1">Start Date: {startDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">End Date: {endDate.toISOString().split('T')[0]}</p>
                  <p className="mb-1">Base Price: JD{Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * car.price_per_day}</p>
                  {paymentInfo.paymentType === 'cash' && (
                    <>
                      <p className="mb-1">Cash Processing Fee: +JD5</p>
                      <p className="mb-1">Total Amount: JD{Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * car.price_per_day + 5}</p>
                      <hr />
                      <p className="mb-1 font-weight-bold">Due Now (Deposit): JD20</p>
                      <p className="mb-0 font-weight-bold">Due at Pickup: JD{Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) * car.price_per_day + 5 - 20}</p>
                    </>
                  )}
                </div>
              )}
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleProcessPayment}
            disabled={
              paymentInfo.paymentType === 'card' &&
              (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv || paymentProcessing)
            }
          >
            {paymentProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              paymentInfo.paymentType === 'cash' ? 'Pay Deposit' : 'Complete Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


