export default function Contact() {
    return (
<>

<section className="hero-wrap hero-wrap-2 js-fullheight" style={{backgroundImage: "url('images/bg_3.jpg')"}} data-stellar-background-ratio="0.5">
      <div className="overlay"></div>
      <div className="container">
        <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
          <div className="col-md-9 ftco-animate pb-5">
          	<p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Contact <i className="ion-ios-arrow-forward"></i></span></p>
            <h1 className="mb-3 bread">Contact Us</h1>
          </div>
        </div>
      </div>
    </section>

    <section className="ftco-section contact-section">
      <div className="container">
        <div className="row d-flex mb-5 contact-info">
        	<div className="col-md-4">
        		<div className="row mb-5">
		          <div className="col-md-12">
		          	<div className="border w-100 p-4 rounded mb-2 d-flex">
			          	<div className="icon mr-3">
			          		<span className="icon-map-o"></span>
			          	</div>
			            <p><span>Address:</span> 198 West 21th Street, Suite 721 New York NY 10016</p>
			          </div>
		          </div>
		          <div className="col-md-12">
		          	<div className="border w-100 p-4 rounded mb-2 d-flex">
			          	<div className="icon mr-3">
			          		<span className="icon-mobile-phone"></span>
			          	</div>
			            <p><span>Phone:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
			          </div>
		          </div>
		          <div className="col-md-12">
		          	<div className="border w-100 p-4 rounded mb-2 d-flex">
			          	<div className="icon mr-3">
			          		<span className="icon-envelope-o"></span>
			          	</div>
			            <p><span>Email:</span> <a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
			          </div>
		          </div>
		        </div>
          </div>
          <div className="col-md-8 block-9 mb-md-5">
            <form action="#" className="bg-light p-5 contact-form">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Your Name"/>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Your Email"/>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Subject"/>
              </div>
              <div className="form-group">
              <textarea
      name="message"
      id="message"
      cols={30}
      rows={7}
      className="form-control"
      placeholder="Message"
    //   value={message}
    //   onChange={(e) => setMessage(e.target.value)}
    />              </div>
              <div className="form-group">
                <input type="submit" value="Send Message" className="btn btn-primary py-3 px-5"/>
              </div>
            </form>
          
          </div>
        </div>
        <div className="row justify-content-center">
        	<div className="col-md-12">
        		<div id="map" className="bg-white"></div>
        	</div>
        </div>
      </div>
    </section>



</>




    )
}