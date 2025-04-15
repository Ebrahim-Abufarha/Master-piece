import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Form, Pagination, InputGroup, Table, Badge, Dropdown, Spinner } from 'react-bootstrap';
import { FiSearch, FiUserPlus, FiEdit, FiTrash2, FiMoreVertical, FiFilter } from 'react-icons/fi';
import { BiUser, BiUserVoice, BiUserCheck } from 'react-icons/bi';
import { FaUserShield } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  address: string;
  role: string;
  image: string;
  status?: 'active' | 'inactive';
  last_login?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  // const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 10;

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply search
    if (search.trim()) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    // if (statusFilter !== 'all') {
    //   result = result.filter(user => user.status === statusFilter);
    // }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page
  }, [search, roleFilter, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">{role}</Badge>;
      case 'lessor':
        return <Badge bg="primary">{role}</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  // const getStatusBadge = (status?: string) => {
  //   switch (status) {
  //     case 'active':
  //       return <Badge bg="success">Active</Badge>;
  //     case 'inactive':
  //       return <Badge bg="warning" text="dark">Inactive</Badge>;
  //     default:
  //       return <Badge bg="light" text="dark">Unknown</Badge>;
  //   }
  // };

  // Card data matching Dashboard style
  const cardInfo = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <BiUser size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #4e54c8, #8f94fb)',
      textColor: 'text-white'
    },
    {
      title: 'Lessors',
      value: users.filter(u => u.role === 'lessor').length,
      icon: <BiUserVoice size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #11998e, #38ef7d)',
      textColor: 'text-white'
    },
    {
      title: 'Renters',
      value: users.filter(u => u.role === 'renter').length,
      icon: <BiUserCheck size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #f46b45, #eea849)',
      textColor: 'text-white'
    },
    {
      title: 'Admins',
      value: users.filter(u => u.role === 'admin').length,
      icon: <FaUserShield size={28} className="text-white" />,
      bg: 'linear-gradient(to right, #5c258d, #4389a2)',
      textColor: 'text-white'
    }
  ];

  return (
    <div style={{ marginLeft: '250px', padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Users Management</h2>
          <p className="text-muted mb-0">Manage all registered users in the system</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/users/create')} className="d-flex align-items-center">
          <FiUserPlus className="me-2" /> Add User
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FiFilter />
                </InputGroup.Text>
                <Form.Select style={{ width: "200px", height: "50px" }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="renter">Renter</option>
                  <option value="lessor">Lessor</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Cards - Updated to match Dashboard style */}
        <Row className="g-4 mb-5">
        {cardInfo.map((card, idx) => (
            <Col key={idx} xl={3} lg={4} md={6} sm={6} className="mb-4">
            <Card 
            className="shadow border-0 h-100 overflow-hidden"
             style={{ borderRadius: '15px' }}>
              <Card.Body style={{ 
                background: card.bg,
                color: card.textColor,
                padding: '1.5rem'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 style={{ color:"white" }} className="mb-2 opacity-75" >{card.title}</h5>
                    <h2 className="mb-0 fw-bold">{card.value}</h2>
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

      {/* Users Table */}
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <h5 className="mt-3">No users found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>USER</th>
                    <th>EMAIL</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>ROLE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`http://localhost:8000/storage/${user.image}`}
                            alt={user.name}
                            className="rounded-circle me-3"
                            width="40"
                            height="40"
                          />
                          <div>
                            <h6 className="mb-0">{user.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="light" size="sm" className="px-2" id="dropdown-actions">
                            <FiMoreVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate(`/admin/users/edit/${user.id}`)}>
                              <FiEdit className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => deleteUser(user.id)} className="text-danger">
                              <FiTrash2 className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing <span className="fw-bold">{indexOfFirstUser + 1}</span> to{' '}
            <span className="fw-bold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
            <span className="fw-bold">{filteredUsers.length}</span> entries
          </div>
          <Pagination className="mb-0">
            <Pagination.Prev
            
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
              
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Users;