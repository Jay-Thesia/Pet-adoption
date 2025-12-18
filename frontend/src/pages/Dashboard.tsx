import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Adoption, ApiResponse } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async (): Promise<void> => {
    try {
      const res = await api.get<ApiResponse<Adoption[]>>('/adoptions/my-applications');
      if (res.data.data) {
        setAdoptions(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My Adoption Applications</h1>
      </div>

      {adoptions.length === 0 ? (
        <div className="no-applications">
          <p>You haven't applied for any pets yet.</p>
          <Link to="/" className="btn btn-primary">Browse Pets</Link>
        </div>
      ) : (
        <div className="applications-list">
          {adoptions.map((adoption) => {
            const pet = typeof adoption.pet === 'object' ? adoption.pet : null;
            return (
              <div key={adoption._id} className="application-card">
                <div className="application-info">
                  <h3>{pet?.name || 'Pet'}</h3>
                  <p><strong>Species:</strong> {pet?.species}</p>
                  <p><strong>Breed:</strong> {pet?.breed}</p>
                  <p><strong>Applied on:</strong> {new Date(adoption.applicationDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={getStatusClass(adoption.status)}>{adoption.status}</span></p>
                  {adoption.notes && (
                    <p><strong>Notes:</strong> {adoption.notes}</p>
                  )}
                </div>
                {pet && (
                  <Link to={`/pet/${pet._id}`} className="btn btn-secondary">
                    View Pet
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

