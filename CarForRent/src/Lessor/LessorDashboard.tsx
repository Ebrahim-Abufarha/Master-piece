import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';
import { BiMoney, BiCar, BiCalendarCheck, BiCalendarX, BiStats } from 'react-icons/bi';
import { FaChartLine, FaChartPie} from 'react-icons/fa';
import { LineChart, Line, PieChart, Pie,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total: string | number;
  created_at: string;
  car: {
    id: number;
    model: string;
  };
  user: {
    id: number;
    name: string;
  };
}

interface Car {
  id: number;
  name: string;
  price_per_day: string;
  images: { id: number; image_path: string }[];
}

const LessorDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const lessorId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!lessorId) return;

    const fetchData = async () => {
      try {
        const [bookingsRes, carsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/lessor/bookings/${lessorId}`),
          axios.get(`http://localhost:8000/api/lessor/cars/${lessorId}`)
        ]);

        setBookings(bookingsRes.data.data || bookingsRes.data);
        setCars(carsRes.data.data || carsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessorId]);

  const parseToNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      return parseFloat(value) || 0;
    }
    return value || 0;
  };

  const totalBookings = bookings.length;
  const totalIncome = bookings.reduce((sum, b) => sum + parseToNumber(b.total), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const profit = totalIncome * 0.9;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const cardInfo = [
    {
      title: 'Total Cars',
      value: cars.length,
      icon: <BiCar size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #4e54c8, #8f94fb)',
      textColor: 'white'
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: <BiStats size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #11998e, #38ef7d)',
      textColor: 'white'
    },
    {
      title: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      icon: <BiMoney size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #f46b45, #eea849)',
      textColor: 'white'
    },
    {
      title: 'Profit (After 10%)',
      value: `$${profit.toFixed(2)}`,
      icon: <BiMoney size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #5c258d, #4389a2)',
      textColor: 'white'
    },
    {
      title: 'Pending Bookings',
      value: pendingBookings,
      icon: <BiCalendarCheck size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #5c258d, #4389a2)',
      textColor: 'white'
    },
    {
      title: 'Confirmed Bookings',
      value: confirmedBookings,
      icon: <BiCalendarCheck size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #614385, #516395)',
      textColor: 'white'
    },
    {
      title: 'Cancelled Bookings',
      value: cancelledBookings,
      icon: <BiCalendarX size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #c31432, #240b36)',
      textColor: 'white'
    }
  ];

  const bookingStatusData = [
    { name: 'Pending', value: pendingBookings },
    { name: 'Confirmed', value: confirmedBookings },
    { name: 'Cancelled', value: cancelledBookings }
  ];

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(0).map((_, idx) => ({
      name: months[idx],
      income: 0,
      bookings: 0,
    }));

    bookings.forEach(booking => {
      const month = new Date(booking.created_at).getMonth();
      monthlyData[month].income += parseToNumber(booking.total);
      monthlyData[month].bookings += 1;
    });

    return monthlyData;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
        <h2 className="mb-4 fw-bold text-dark">Lessor Dashboard</h2>
        
        <Row className="g-4 mb-5">
          {cardInfo.map((card, idx) => (
            <Col key={idx} xl={4} lg={4} md={6} sm={6}>
              <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
                <Card.Body style={{ background: card.bg, color: card.textColor }}>
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

        <Row className="mb-4">
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
                  <LineChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income ($)" />
                    <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="shadow border-0 h-100" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Booking Status</h5>
                  <div className="d-flex align-items-center">
                    <FaChartPie className="text-success me-2" />
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
        </Row>

        <Row>
          <Col lg={12} className="mb-4">
            <Card className="shadow border-0" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="fw-bold mb-4">Recent Bookings</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Car</th>
                        <th>Customer</th>
                        <th>Dates</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.car?.model || 'N/A'}</td>
                          <td>{booking.user?.name || 'N/A'}</td>
                          <td>
                            {new Date(booking.start_date).toLocaleDateString()} - 
                            {new Date(booking.end_date).toLocaleDateString()}
                          </td>
                          <td>${parseToNumber(booking.total).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'bg-success' :
                              booking.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LessorDashboard;