import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Navbar from './layout/navbar';
import Footer from './layout/footer';
import Home from './User/Home';
import Cars from './User/Cars';
import Contact from './User/Contact';
import CarSingle from './User/CarSingle';
import About from './User/About';
import Pricing from './User/Pricing';
import Services from './User/Services';


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes >
        <Route path="/" element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="contact" element={<Contact />} />
        <Route path="carSingle" element={<CarSingle />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="services" element={<Services />} />
         
        </Routes >
      </div>
      <Footer />
    </Router>
  );
}

export default App;
