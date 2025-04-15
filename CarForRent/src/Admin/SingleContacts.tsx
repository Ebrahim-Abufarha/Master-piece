// src/pages/admin/ContactDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminContactDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/contactsSingle/${id}`);
        setContact(response.data.data);
      } catch (error) {
        console.error('Error fetching contact details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

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

  if (!contact) {
    return (
      <div className="main-content">
        <div className="alert alert-danger m-4">Contact not found</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Contact Details</h2>
            <Link to="/admin/ContactsPage" className="btn btn-secondary btn-sm">
              Back to List
            </Link>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <p><strong>Name:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Subject:</strong> {contact.subject}</p>
            <p><strong>Date:</strong> {new Date(contact.created_at).toLocaleString()}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p className="bg-light p-3 rounded">{contact.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactDetailsPage;
