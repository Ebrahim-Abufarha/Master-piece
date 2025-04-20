import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarImage {
  id: number;
  car_id: number;
  image_path: string;
}

interface Car {
  id: number;
  name: string;
  color: string;
  description: string;
  location: string;
  price_per_day: number;
  price_per_month: number | null;
  status: string;
  car_type: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  add: number | null;
  images: CarImage[];
}

interface CarCardProps {
  car: Car;
}

// Individual Car Card Component
const CarCard = ({ car }: CarCardProps) => {
  const hasImages = car.images && car.images.length > 0;

  return (
    <div className="px-2">
      <div className="blog-entry justify-content-end">
        <div className="position-relative">
          <a href={`/cars/${car.id}`} className="block-20" 
            style={{ 
              backgroundImage: hasImages 
                ? `url('http://localhost:8000/storage/${car.images[0].image_path}')`  
                : "url('/images/default-car.jpg')",
              height: "200px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative"
            }}>
          </a>
        </div>
        <div className="text pt-4">
          <div className="meta mb-3">
            <div><span>{car.car_type}</span></div>
            <div><span>{car.location}</span></div>
            <div><span className="meta-chat"><span className="icon-chat"></span> {car.seats} Seats</span></div>
          </div>
          <h3 className="heading mt-2"><a href={`car-single/${car.id}`}>{car.name}</a></h3>
          <p className="car-price">${car.price_per_day} <span>/day</span></p>
          {car.add && <p className="ad-badge">Promoted</p>}
          <p>
            <a href={`car-single/${car.id}`} className="btn btn-secondary py-2 ml-1">Details</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarsWithAds = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/add'); 
        const data = await response.json();
        console.log("Cars data:", data); // للتحقق من البيانات المستلمة
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars with ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsWithAds();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="hero-wrap ftco-degree-bg" 
           style={{ backgroundImage: "url('/images/bg_1.jpg')" }} 
           data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center">
            <div className="col-lg-8 ftco-animate">
              <div className="text w-100 text-center mb-md-5 pb-md-5">
                <h1 className="mb-4">Fast &amp; Easy Way To Rent A Car</h1>
                <p style={{ fontSize: "18px" }}>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts</p>
                <a href="cars" className="icon-wrap popup-vimeo d-flex align-items-center mt-4 justify-content-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="ion-ios-play"></span>
                  </div>
                  <div className="heading-title ml-5">
                    <span>Easy steps for renting a car</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section ftco-no-pt bg-light">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-12 featured-top">
              <div className="row no-gutters">
                <div className="col-md-4 d-flex align-items-center">
              
                </div>
                <div className="col-md-8 d-flex align-items-center">
                  <div className="services-wrap rounded-right w-100">
                    <h3 className="heading-section mb-4">Better Way to Rent Your Perfect Cars</h3>
                    <div className="row d-flex mb-4">

                      {/* 1. Explore Available Cars */}
                      <div className="col-md-4 d-flex align-self-stretch">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center mb-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/743/743965.png" alt="Explore Cars" width="60" />
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Explore Available Cars for Rent</h3>
                          </div>
                        </div>
                      </div>

                      {/* 2. Select the Best Deal */}
                      <div className="col-md-4 d-flex align-self-stretch">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center mb-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Best Deal" width="60" />
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Select the Best Deal</h3>
                          </div>
                        </div>
                      </div>

                      {/* 3. Reserve Your Rental Car */}
                      <div className="col-md-4 d-flex align-self-stretch">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center mb-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/2920/2920262.png" alt="Reserve Car" width="60" />
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Reserve Your Rental Car</h3>
                          </div>
                        </div>
                      </div>

                    </div>
                    <p><a href="cars" className="btn btn-primary py-3 px-4">Reserve Your Perfect Car</a></p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-about">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-6 p-md-5 img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url(/images/about.jpg)" }}>
            </div>
            <div className="col-md-6 wrap-about ftco-animate">
              <div className="heading-section heading-section-white pl-md-5">
                <span className="subheading">About us</span>
                <h2 className="mb-4">Welcome to Carbook</h2>

                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                <p>On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word "and" and the Little Blind Text should turn around and return to its own, safe country. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                <p><a href="cars" className="btn btn-primary py-3 px-4">Search Vehicle</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 text-center heading-section ftco-animate">
              <span className="subheading">Our Services</span>
              <h2 className="mb-3">Best Car Rental Experience</h2>
              <p>We offer reliable and flexible car services that suit all your needs.</p>
            </div>
          </div>
          <div className="row">
            {[
              {
                title: "Car Rental",
                desc: "Browse and rent from a wide range of cars easily and quickly.",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743007.png"
              },
              {
                title: "Car Hiring",
                desc: "Hire cars with or without drivers based on your preferences.",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/2554/2554973.png"
              },
              {
                title: "Add to Favorites",
                desc: "Save your favorite cars for future rental with one click.",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png"
              },
              {
                title: "Advertise Your Car",
                desc: "List your own car and start earning by renting it out.",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075896.png"
              }
            ].map((service, index) => (
              <div className="col-md-3" key={index}>
                <div className="services services-2 text-center p-4 border rounded bg-white h-100">
                  <div className="icon mb-3 d-flex align-items-center justify-content-center">
                    <img
                      src={service.iconUrl}
                      alt={service.title}
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                  <div className="text">
                    <h3 className="heading mb-2">{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-intro" style={{ backgroundImage: "url(/images/bg_3.jpg)" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-md-6 heading-section heading-section-white ftco-animate">
              <h2 className="mb-3">Do You Want to Earn by Renting Your Car?</h2>
              <p className="mb-4">Join our platform and start earning by renting your car to trusted customers today.</p>
              <a href="/register" className="btn btn-primary btn-lg">Become a Partner</a>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 heading-section text-center ftco-animate">
              <span className="subheading">Featured Cars</span>
              <h2>Premium Rental Options</h2>
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
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 2,
                    }
                  },
                  {
                    breakpoint: 576,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    }
                  }
                ]}
              >
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}