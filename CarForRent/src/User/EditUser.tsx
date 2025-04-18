import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditUser() {





const [errors, setErrors] = useState<{ [key: string]: string }>({});

const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (formData.phone.length < 10) {
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
    navigate(`/users/${id}`);
  } catch (error) {
    console.error("Error updating user", error);
  }
};






  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   data.append("name", formData.name);
  //   data.append("email", formData.email);
  //   data.append("phone", formData.phone);
  //   data.append("address", formData.address);

  //   if (formData.password) {
  //     data.append("password", formData.password);
  //   }

  //   if (newImage) {
  //     data.append("image", newImage);
  //   }

  //   try {
  //     await axios.post(`http://localhost:8000/api/users/${id}?_method=PUT`, data, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     navigate(`/users/${id}`);
  //   } catch (error) {
  //     console.error("Error updating user", error);
  //   }
  // };

  if (loading) return <div className="text-center py-5 fs-4 fw-bold text-muted">Loading...</div>;

  return (
    <div className="dd"id='d'>
    <div className="container py-5">
      <div className="mx-auto shadow-lg p-5 rounded-4 bg-light" id='dd' style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4 fw-bold text-success">Edit User Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-floating mb-3">
            <input type="text" name="name" className="form-control" id="nameInput" value={formData.name} onChange={handleChange} required />
            <label htmlFor="nameInput">Name</label>
          </div>

          <div className="form-floating mb-3">
            <input type="email" name="email" className="form-control" id="emailInput" value={formData.email} onChange={handleChange} required />
            <label htmlFor="emailInput">Email</label>
          </div>

          <div className="form-floating mb-3">
          <input
  type="text"
  name="phone"
  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
  id="phoneInput"
  value={formData.phone}
  onChange={handleChange}
/>
<label htmlFor="phoneInput">Phone</label>
{errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

          </div>

          <div className="form-floating mb-3">
            <input type="text" name="address" className="form-control" id="addressInput" value={formData.address} onChange={handleChange} />
            <label htmlFor="addressInput">Address</label>
          </div>

          <div className="form-floating mb-3">
          <input
  type="password"
  name="password"
  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
  id="passwordInput"
  value={formData.password}
  onChange={handleChange}
/>
<label htmlFor="passwordInput">New Password (Optional)</label>
{errors.password && <div className="invalid-feedback">{errors.password}</div>}

          </div>

          <div className="mb-4">
          <input
  type="file"
  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
  onChange={handleImageChange}
/>
{errors.image && <div className="invalid-feedback">{errors.image}</div>}

            {formData.image && (
              <div className="mt-3 text-center">
                <img
                  src={`http://localhost:8000/storage/${formData.image}`}
                  alt="User"
                  className="rounded-circle shadow"
                  width="120"
                  height="120"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn edit-btn ">💾 Save Changes</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
