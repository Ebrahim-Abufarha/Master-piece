import React, { useState, useEffect } from 'react';

const getImage = (car: Car & { images?: { image_path: string }[] }) => {
	return car.images && car.images.length > 0
	  ? `http://localhost:8000/storage/${car.images[0].image_path}`
	  : '/images/default-car.jpg';
  };
  
type Car = {
  name: string;
  image: string;
  price_per_hour: number;
  price_per_day: number;
  price_per_month: number;
};

export default function Pricing() {
  const [cars, setCars] = useState<Car[]>([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/cars')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <section className="hero-wrap hero-wrap-2 js-fullheight" style={{ backgroundImage: "url('images/bg_3.jpg')" }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs"><span className="mr-2"><a href="index.html">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Pricing <i className="ion-ios-arrow-forward"></i></span></p>
              <h1 className="mb-3 bread">Pricing</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-cart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 ftco-animate">
              <div className="car-list">
                <table className="table">
                  <thead className="thead-primary">
                    <tr className="text-center">
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                      {/* <th className="bg-primary heading">Per Hour Rate</th> */}
                      <th className="bg-dark heading">Per Day Rate</th>
                      <th className="bg-black heading">Leasing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car, index) => (
                      <tr key={index}>
                        <td className="car-image"><div className="img" style={{ backgroundImage: `url(${getImage(car)})` }}></div></td>
                        <td className="product-name">
                          <h3>{car.name}</h3>
                          <p className="mb-0 rated">
                            <span>rated:</span>
                            <span className="ion-ios-star"></span>
                            <span className="ion-ios-star"></span>
                            <span className="ion-ios-star"></span>
                            <span className="ion-ios-star"></span>
                            <span className="ion-ios-star"></span>
                          </p>
                        </td>
                        {/* <td className="price">
                          <p className="btn-custom"><a href="#">Rent a car</a></p>
                          <div className="price-rate">
                            <h3>
                              <span className="num"><small className="currency">$</small> {car.price_per_hour}</span>
                              <span className="per">/per hour</span>
                            </h3>
                          </div>
                        </td> */}
                        <td className="price">
                          <p className="btn-custom"><a href="#">Rent a car</a></p>
                          <div className="price-rate">
                            <h3>
                              <span className="num"><small className="currency">$</small> {car.price_per_day}</span>
                              <span className="per">/per day</span>
                            </h3>
                          </div>
                        </td>
                        <td className="price">
                          <p className="btn-custom"><a href="#">Rent a car</a></p>
                          <div className="price-rate">
                            <h3>
                              <span className="num"><small className="currency">$</small> {car.price_per_month}</span>
                              <span className="per">/per month</span>
                            </h3>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
