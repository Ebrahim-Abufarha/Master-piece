import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card} from 'react-bootstrap';
import { BiMoney, BiBarChartAlt2, BiUser, BiUserVoice, BiUserCheck } from 'react-icons/bi';
import { FaUserShield, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  address: string;
  role: string;
  image: string;
}

interface Car {
  id: number;
  model: string;
  brand: string;
}

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total: number;
  created_at: string;
  user: User;
  car: Car;
}

// Chart data interfaces
interface UserRoleData {
  name: string;
  value: number;
}

interface BookingStatusData {
  name: string;
  value: number;
}

interface MonthlyData {
  name: string;
  income: number;
  bookings: number;
}

interface PieChartLabelProps {
  name: string;
  percent: number;
}

// Card info interface
interface CardInfo {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed unused error state

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/bookings');
      if (response.data.data) {
        setBookings(response.data.data);
      } else {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Removed unused error state update
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  // Calculations
  const totalBookings = bookings?.length || 0;
  const totalIncome = bookings?.reduce((sum, b) => sum + (Number(b.total) || 0), 0) || 0;
  const profit = totalIncome * 0.10;

  // Custom label function with proper TypeScript typing
  const renderCustomPieLabel = ({ name, percent }: PieChartLabelProps) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  // Card data
  const cardInfo: CardInfo[] = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <BiUser size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #4e54c8, #8f94fb)',
      textColor: 'white'
    },
    {
      title: 'Lessors',
      value: users.filter(u => u.role === 'lessor').length,
      icon: <BiUserVoice size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #11998e, #38ef7d)',
      textColor: 'white'
    },
    {
      title: 'Renters',
      value: users.filter(u => u.role === 'renter').length,
      icon: <BiUserCheck size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #f46b45, #eea849)',
      textColor: 'white'
    },
    {
      title: 'Admins',
      value: users.filter(u => u.role === 'admin').length,
      icon: <FaUserShield size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #5c258d, #4389a2)',
      textColor: 'white'
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: <BiBarChartAlt2 size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #614385, #516395)',
      textColor: 'white'
    },
    {
      title: 'Total Income',
      value: `JD${totalIncome?.toFixed(2) || '0.00'}`,
      icon: <BiMoney size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #134e5e, #71b280)',
      textColor: 'white'
    },
    {
      title: 'Profit (10%)',
      value: `JD${profit?.toFixed(2) || '0.00'}`,
      icon: <BiMoney size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #c31432, #240b36)',
      textColor: 'white'
    },
  ];

  // Chart data preparation
  // 1. User role distribution for pie chart
  const userRoleData: UserRoleData[] = [
    { name: 'Lessors', value: users.filter(u => u.role === 'lessor').length },
    { name: 'Renters', value: users.filter(u => u.role === 'renter').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ];

  // 2. Booking status distribution for pie chart
  const bookingStatusData: BookingStatusData[] = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  // 3. Monthly income data for line chart
  const getMonthlyData = (): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: MonthlyData[] = Array(12).fill(0).map((_, idx) => ({
      name: months[idx],
      income: 0,
      bookings: 0,
    }));

    bookings.forEach(booking => {
      const date = new Date(booking.created_at);
      const month = date.getMonth();
      monthlyData[month].income += Number(booking.total) || 0;
      monthlyData[month].bookings += 1;
    });

    return monthlyData;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Loading state
  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="py-4">
        <h2 className="mb-4 fw-bold text-dark">Dashboard Overview</h2>
        
        {/* Stats Cards Row */}
        <Row className="g-4 mb-5">
          {cardInfo.map((card, idx) => (
            <Col key={idx} xl={3} lg={4} md={6} sm={6} className="mb-4">
              <Card 
                className="shadow border-0 h-100 overflow-hidden" 
                style={{ borderRadius: '15px' }}
              >
                <Card.Body style={{ 
                  background: card.bg,
                  color: card.textColor
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-2 opacity-75">{card.title}</h6>
                      <h3 className="mb-0 fw-bold">{card.value}</h3>
                    </div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center p-3"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                                                             {card.icon}
                                  </div>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          {/* Monthly Income Line Chart */}
          <Col lg={8} className="mb-4">
            <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Monthly Revenue</h5>
                  <div className="d-flex align-items-center">
                    <FaChartLine className="text-primary me-2" />
                    <span className="text-muted">Financial Overview</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={getMonthlyData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} name="Income (JD)" />
                    <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          {/* User Roles Pie Chart */}
          <Col lg={4} className="mb-4">
            <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">User Distribution</h5>
                  <div className="d-flex align-items-center">
                    <FaChartPie className="text-success me-2" />
                    <span className="text-muted">User Roles</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomPieLabel}
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Booking Status Pie Chart */}
          <Col lg={4} className="mb-4">
            <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Booking Status</h5>
                  <div className="d-flex align-items-center">
                    <FaChartPie className="text-warning me-2" />
                    <span className="text-muted">Current Status</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomPieLabel}
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Recent Bookings Bar Chart */}
          <Col lg={8} className="mb-4">
            <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Monthly Booking Count</h5>
                  <div className="d-flex align-items-center">
                    <FaChartBar className="text-danger me-2" />
                    <span className="text-muted">Booking Trends</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getMonthlyData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;