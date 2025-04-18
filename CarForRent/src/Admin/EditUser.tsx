import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

type UserRole = 'admin' | 'lessor' | 'renter';

interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  image: File | null;
  currentImage?: string; 
  removeImage?: boolean; 
}

const EditUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    role: 'renter',
    phone: '',
    address: '',
    image: null,
    currentImage: '',
    removeImage: false,
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/admin/users/${id}`)
        .then(response => {
          const { name, email, role, phone, address, image } = response.data;
          setFormData(prev => ({ 
            ...prev, 
            name, 
            email, 
            role, 
            phone, 
            address, 
            currentImage: image ? `http://localhost:8000/storage/${image}` : '' 
          }));
        })
        .catch(err => {
          console.error('Error fetching user:', err);
        });
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({ 
        ...prev, 
        image: e.target.files![0],
        removeImage: false 
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('role', formData.role);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (formData.removeImage) {
      data.append('remove_image', 'true');
    }

    try {
      await axios.post(`http://localhost:8000/api/admin/users/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container" style={{ marginLeft: '270px' }}>
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h4 className="mb-0">Edit User</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" name="name" value={formData.name} className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={formData.email} className="form-control" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select name="role" value={formData.role} className="form-select" onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="lessor">Lessor</option>
                <option value="renter">Renter</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={formData.phone} className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" name="address" value={formData.address} className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Current Image</label>
              {formData.currentImage && (
                <div className="mb-2">
                  <img 
                    src={formData.currentImage} 
                    alt="Current User" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                    className="img-thumbnail"
                  />
                  {/* <div className="form-check mt-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      name="removeImage" 
                      id="removeImage"
                      checked={formData.removeImage || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="removeImage">
                      Remove current image
                    </label>
                  </div> */}
                </div>
              )}
              <label className="form-label">New Image</label>
              <input type="file" name="image" className="form-control" onChange={handleImageChange} />
            </div>

            <button className="btn btn-warning w-100">Update User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;