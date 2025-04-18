import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditLessorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    image: '',
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}`);
        const user = res.data.data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          password: '',
          image: user.image || '',
        });
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }

    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[@*#]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters, include one uppercase letter and one symbol (@, *, #).";
      }
    }

    if (newImage && !newImage.type.startsWith("image/")) {
      newErrors.image = "Only image files are allowed (jpeg, png, etc.).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    if (formData.password) {
      data.append("password", formData.password);
    }

    if (newImage) {
      data.append("image", newImage);
    }

    try {
      await axios.post(`http://localhost:8000/api/users/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/lessor/profile`);
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div         style={{ marginLeft:"150px"}}
 className="row justify-content-center">
        <div 
         className="col-lg-8">
          <div className="profile-card card border-0 shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="card-header bg-success text-white py-3">
              <h2 className="h4 mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Profile
              </h2>
            </div>
            
            {/* Card Body */}
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  {/* Left Column - Image Upload */}
                  <div className="col-md-5 mb-4 mb-md-0">
                    <div className="image-upload-container text-center">
                      <div className="position-relative mx-auto" style={{ width: '200px' }}>
                        <img
                          src={
                            newImage 
                              ? URL.createObjectURL(newImage)
                              : formData.image
                                ? `http://localhost:8000/storage/${formData.image}`
                                : 'https://via.placeholder.com/200'
                          }
                          className="img-fluid rounded-circle shadow"
                          alt="Profile"
                          style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            border: '5px solid #f8f9fa'
                          }}
                        />
                        <label 
                          htmlFor="imageUpload" 
                          className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm cursor-pointer"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-camera-fill text-success fs-5"></i>
                        </label>
                        <input
                          type="file"
                          id="imageUpload"
                          className="d-none"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </div>
                      {errors.image && (
                        <div className="alert alert-danger mt-3 p-2">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {errors.image}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Form Fields */}
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label htmlFor="nameInput" className="form-label text-muted">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-lg"
                        id="nameInput"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="emailInput" className="form-label text-muted">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        id="emailInput"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="phoneInput" className="form-label text-muted">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                        id="phoneInput"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="addressInput" className="form-label text-muted">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control form-control-lg"
                        id="addressInput"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="passwordInput" className="form-label text-muted">New Password (Optional)</label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        id="passwordInput"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      <small className="text-muted">
                        Must be 8+ chars with uppercase and symbol (@, *, #)
                      </small>
                    </div>
                  </div>
                </div>
                
                {/* Form Footer */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary px-4 rounded-pill"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success px-4 rounded-pill fw-bold"
                  >
                    <i className="bi bi-check-circle me-2"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}