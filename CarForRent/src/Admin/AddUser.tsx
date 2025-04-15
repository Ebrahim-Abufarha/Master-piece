import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'renter',
    phone: '',
    address: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value instanceof File ? value : value.toString());
      }
    });

    try {
      await axios.post('http://localhost:8000/api/admin/users', data);
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="container" style={{ marginLeft: '270px' }}>
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Add New User</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="lessor">Lessor</option>
                <option value="renter">Renter</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" name="address" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" name="image" className="form-control" onChange={handleImageChange} />
            </div>

            <button type="submit" className="btn btn-success w-100">Add User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
