export default function Footer() {
  return (
    <>
      <footer className="ftco-footer ftco-bg-dark ftco-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2">
                  <a href="/" className="logo">
                    Car<span>Rental</span>
                  </a>
                </h2>
                <p>
                  We provide the best car rental experience with competitive prices and high-quality vehicles. 
                  Choose from our wide range of cars to suit all your needs.
                </p>
                <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                  <li className="ftco-animate">
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li className="ftco-animate">
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li className="ftco-animate">
                    <a href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="ftco-footer-widget mb-4 ml-md-5">
                <h2 className="ftco-heading-2">Information</h2>
                <ul className="list-unstyled">
                  <li>
                    <a href="/about" className="py-2 d-block">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="py-2 d-block">
                      Our Services
                    </a>
                  </li>
                  {/* <li>
                    <a href="/pricing" className="py-2 d-block">
                      Pricing Plans
                    </a>
                  </li> */}
                  <li>
                    <a href="/cars" className="py-2 d-block">
                      Our Fleet
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="py-2 d-block">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2">Customer Support</h2>
                <ul className="list-unstyled">
                  <li>
                    <a href="/faq" className="py-2 d-block">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/register" className="py-2 d-block">
                      How to Register
                    </a>
                  </li>
                  <li>
                    <a href="/favorites" className="py-2 d-block">
                      Your Favorites
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="py-2 d-block">
                      Rental Policies
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="py-2 d-block">
                      24/7 Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2">Have a Question?</h2>
                <div className="block-23 mb-3">
                  <ul>
                    <li>
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span className="text">
                        123 Rental Street, Downtown, City, Country
                      </span>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-phone mr-2"></i>
                        <span className="text">+1 234 567 8900</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-envelope mr-2"></i>
                        <span className="text">info@carrental.com</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <p>
                &copy; {new Date().getFullYear()} CarRental. All rights reserved | 
                Made with <i className="fas fa-heart text-danger"></i> by CarRental Team
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}