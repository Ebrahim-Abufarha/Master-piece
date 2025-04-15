import React, { useState } from 'react'
import axios from 'axios'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/api/contact', form)
      alert('Message sent successfully.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error(error)
      alert('Failed to send message.')
    }
    
  }

  return (
    <>
      <section
        className="hero-wrap hero-wrap-2 js-fullheight"
        style={{ backgroundImage: "url('images/bg_3.jpg')" }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs">
                <span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span>
                <span>Contact <i className="ion-ios-arrow-forward"></i></span>
              </p>
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
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="Location Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </div>
              <p><span>Address:</span> Jordan, Amman, Al-Jubaiha</p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="border w-100 p-4 rounded mb-2 d-flex">
              <div className="icon mr-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                  alt="Phone Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </div>
              <p><span>Phone:</span> <a href="tel:+962781808985">+962 781808985</a></p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="border w-100 p-4 rounded mb-2 d-flex">
              <div className="icon mr-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                  alt="Email Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </div>
              <p><span>Email:</span> <a href="mailto:carbooking@gmail.com">carbooking@gmail.com</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-8 block-9 mb-md-5">
        <form onSubmit={handleSubmit} className="bg-light p-5 contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              className="form-control"
              placeholder="Message"
              cols={30}
              rows={7}
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Send Message" className="btn btn-primary py-3 px-5" />
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

    </>
  )
}
