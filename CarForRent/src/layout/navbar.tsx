export default function Navbar(){
    return ( <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
	    <div className="container">
	      <a className="navbar-brand" href="/">Car<span>Book</span></a>
	      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
	        <span className="oi oi-menu"></span> Menu
	      </button>

	      <div className="collapse navbar-collapse" id="ftco-nav">
	        <ul className="navbar-nav ml-auto">
	          <li className="nav-item active"><a href="/" className="nav-link">Home</a></li>
	          <li className="nav-item"><a href="about" className="nav-link">About</a></li>
	          <li className="nav-item"><a href="services" className="nav-link">Services</a></li>
	          <li className="nav-item"><a href="pricing" className="nav-link">Pricing</a></li>
	          <li className="nav-item"><a href="cars" className="nav-link">Cars</a></li>
	          {/* <li className="nav-items"><a href="blog" className="nav-link">Blog</a></li> */}
	          <li className="nav-item"><a href="contact" className="nav-link">Contact</a></li>
	        </ul>
	      </div> 
	    </div>
	  </nav>)
}