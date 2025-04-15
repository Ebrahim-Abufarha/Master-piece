import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../assets/cssNew/Register.css';

export default function Register() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loginErrors, setLoginErrors] = useState({
        email: '',
        password: ''
    });

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        setLoginErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateLogin = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!loginData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setLoginErrors(newErrors);
        return valid;
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateLogin()) return;

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: loginData.email,
                password: loginData.password
            });
    
            const userRole = response.data.user.role; 
            const user_id = response.data.user.id.toString(); 

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', userRole);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('isLoggedIn', 'true');

            if (userRole === 'admin') {
                navigate('/admin/AdminDashboard');
            } else if (userRole === 'lessor') {
                navigate('/lessor/LessorDashboard');
            } else {
                navigate('/');
            }
    
        } catch (error) {
            console.error('Login error:', error);
            setLoginErrors(prev => ({ ...prev, password: 'Invalid email or password' }));
        }
    };
    
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        profileImage: null as File | null,
        isLessor: false // Added lessor checkbox state
    });
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        profileImage: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        // Handle checkbox differently
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, profileImage: 'Only image files are allowed (JPEG, PNG, etc.)' }));
                setFormData(prev => ({ ...prev, profileImage: null }));
                
                e.target.value = ''; 
            } else {
                setFormData(prev => ({ ...prev, profileImage: file }));
                setErrors(prev => ({ ...prev, profileImage: '' }));
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setErrors({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            address: '',
            profileImage: ''
        });
        setLoginErrors({ email: '', password: '' });
    };

    const validateRegister = () => {
        let valid = true;
        const newErrors = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            address: '',
            profileImage: ''
        };

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            valid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
            valid = false;
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
            valid = false;
        }

        if (formData.profileImage && !formData.profileImage.type.startsWith('image/')) {
            newErrors.profileImage = 'Only image files are allowed';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateRegister()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('phone', formData.phoneNumber);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('role', formData.isLessor ? 'lessor' : 'renter'); // Add role to form data
    
        if (formData.profileImage) {
            formDataToSend.append('image', formData.profileImage);
        }
    
        try {
            await axios.post('http://127.0.0.1:8000/api/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            alert('User registered successfully!');
            setIsLogin(true);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data?.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
        }
    };

    return (
        <>
        <div className="d">
            <div className="main">
                <input type="checkbox" id="chk" aria-hidden="true" checked={isLogin} onChange={toggleForm} />

                <div className={`signup ${isLogin ? 'hidden' : ''}`}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="chk" aria-hidden="true">Sign up</label>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="User name" 
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            placeholder="Phone number" 
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                        <input 
                            type="text" 
                            name="address" 
                            placeholder="Address" 
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                        {errors.address && <span className="error">{errors.address}</span>}
                        <div className="checkbox-container">
                        <label style={{ fontSize:"20px",marginTop:"-10px" }} htmlFor="isLessor">Are you lessor?</label>

                            <input
                            style={{ marginTop:"-40px" }}
                                type="checkbox"
                                id="isLessor"
                                name="isLessor"
                                checked={formData.isLessor}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input 
                            className="profileImage"
                            type="file" 
                            name="profileImage" 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {errors.profileImage && <span className="error">{errors.profileImage}</span>}
                        <button type="submit">Sign up</button>
                        {error && <span className="error">{error}</span>}
                    </form>
                </div>

                <div className={`login ${!isLogin ? 'hidden' : ''}`}>
                    <form onSubmit={handleLoginSubmit}>
                        <label htmlFor="chk" aria-hidden="true">Login</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={loginData.email}
                            onChange={handleLoginInputChange}
                        />
                        {loginErrors.email && <span className="error">{loginErrors.email}</span>}
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={loginData.password}
                            onChange={handleLoginInputChange}
                        />
                        {loginErrors.password && <span className="error">{loginErrors.password}</span>}
                        <button type="submit">Login</button>
                        <p 
                            onClick={toggleForm} 
                            style={{ cursor: 'pointer', color: '#01d28e',textAlign:"center" }}
                        >
                            Don't have an account? Sign up
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}