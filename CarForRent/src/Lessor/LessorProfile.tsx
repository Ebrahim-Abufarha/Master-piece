import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export default function LessorsProfile() {
  const id = localStorage.getItem("user_id");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/users/${id}`);
        if (response.data.success) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="alert alert-danger text-center p-4">
        <i className="bi bi-exclamation-triangle-fill fs-1"></i>
        <h2 className="mt-3">User not found</h2>
        <Link to="/" className="btn btn-outline-primary mt-3">
          Return to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div
        style={{ marginLeft:"50px"}}
         className="col-lg-8">
          <div
           style={{width:"950px" }} 
          className="profile-card card border-0 shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="card-header bg-success text-white py-3">
              <h2 className="h4 mb-0">
                <i className="bi bi-person-badge me-2"></i>
                Profile Information
              </h2>
            </div>
            
            {/* Card Body */}
            <div className="card-body p-0">
              <div className="row g-0">
                {/* Profile Image */}
                <div className="col-md-4 bg-light d-flex align-items-center justify-content-center p-4">
                  <div className="position-relative">
                    <img
                      src={`http://localhost:8000/storage/${user.image}`}
                      className="img-fluid rounded-circle shadow"
                      alt={user.name}
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        border: '5px solid white'
                      }}
                    />
                    <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm">
                      <i className="bi bi-camera-fill text-success fs-5"></i>
                    </div>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="col-md-8 p-4">
                  <h1 className="display-6 text-success mb-4">{user.name}</h1>
                  
                  <div className="profile-info mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-success text-white me-3">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div>
                        <h6 style={{ paddingLeft:"10px" }} className="mb-0 text-muted">Email</h6>
                        <p style={{ paddingLeft:"10px" }} className="mb-0 fw-bold">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="d-flex align-items-center mb-3">
                        <div className="icon-circle bg-success text-white me-3">
                          <i className="bi bi-telephone-fill"></i>
                        </div>
                        <div>
                          <h6 style={{ paddingLeft:"10px" }} className="mb-0 text-muted">Phone</h6>
                          <p style={{ paddingLeft:"10px" }} className="mb-0 fw-bold">{user.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.address && (
                      <div className="d-flex align-items-center mb-3">
                        <div className="icon-circle bg-success text-white me-3">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                          <h6 style={{ paddingLeft:"10px" }} className="mb-0 text-muted">Address</h6>
                          <p style={{ paddingLeft:"10px" }} className="mb-0 fw-bold">{user.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="d-flex gap-3">
                    <Link 
                      to={`/lessor/${user.id}/edit`} 
                      className="btn btn-outline-success px-4 rounded-pill fw-bold"
                    >
                      <i className="bi bi-pencil-square me-2"></i> Edit Profile
                    </Link>
                    
                    <Link to="/lessor/lessorDashboard" className="btn btn-outline-success px-4 rounded-pill fw-bold">
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="card-footer bg-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-clock-history me-1"></i>
                  Last updated: {new Date().toLocaleDateString()}
                </small>
                {/* <div className="social-icons">
                  <a href="#" className="text-success mx-2"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="text-success mx-2"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-success mx-2"><i className="bi bi-linkedin"></i></a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}