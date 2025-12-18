import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { Pet, Adoption, ApiResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { PLACEHOLDER_IMAGE_LARGE } from '../utils/constants';
import './PetDetail.css';

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applying, setApplying] = useState<boolean>(false);
  const [userApplication, setUserApplication] = useState<Adoption | null>(null);

  useEffect(() => {
    fetchPet();
    if (user) {
      fetchUserApplication();
    }
  }, [id, user]);

  const fetchPet = async (): Promise<void> => {
    try {
      const res = await api.get<ApiResponse<Pet>>(`/pets/${id}`);
      if (res.data.data) {
        setPet(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplication = async (): Promise<void> => {
    try {
      const res = await api.get<ApiResponse<Adoption[]>>('/adoptions/my-applications');
      if (res.data.data) {
        const application = res.data.data.find((app: Adoption) => {
          const petId = typeof app.pet === 'object' ? app.pet._id : app.pet;
          return petId === id;
        });
        if (application) {
          setUserApplication(application);
        }
      }
    } catch (error) {
    }
  };

  const handleApply = async (): Promise<void> => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      await api.post('/adoptions', { petId: id });
      toast.success('Application submitted successfully!');
      await fetchUserApplication();
    } catch (error: any) {
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!pet) {
    return <div className="container"><h2>Pet not found</h2></div>;
  }

  return (
    <div className="container">
      <div className="pet-detail">
        <div className="pet-detail-image">
          <img 
            src={pet.photo || PLACEHOLDER_IMAGE_LARGE} 
            alt={pet.name}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE_LARGE;
            }}
          />
        </div>
        <div className="pet-detail-info">
          <h1>{pet.name}</h1>
          <div className="pet-details">
            <p><strong>Species:</strong> {pet.species}</p>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age} years</p>
            <p><strong>Gender:</strong> {pet.gender}</p>
            <p><strong>Status:</strong> <span className={`status-${pet.status}`}>{pet.status}</span></p>
            {pet.description && (
              <div className="description">
                <h3>Description</h3>
                <p>{pet.description}</p>
              </div>
            )}
          </div>

          {userApplication ? (
            <div className="application-status-section">
              <h3>Your Application Status</h3>
              <div className="application-status-card">
                <p><strong>Application Date:</strong> {new Date(userApplication.applicationDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-${userApplication.status} application-status`}>
                    {userApplication.status.charAt(0).toUpperCase() + userApplication.status.slice(1)}
                  </span>
                </p>
                {userApplication.notes && (
                  <p><strong>Notes:</strong> {userApplication.notes}</p>
                )}
                {userApplication.reviewedAt && (
                  <p><strong>Reviewed on:</strong> {new Date(userApplication.reviewedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ) : pet.status === 'available' && user && (
            <div className="apply-section">
              <button
                onClick={handleApply}
                className="btn btn-primary"
                disabled={applying}
              >
                {applying ? 'Applying...' : 'Apply to Adopt'}
              </button>
            </div>
          )}

          {!user && pet.status === 'available' && (
            <div className="apply-section">
              <p style={{ marginBottom: '10px', color: '#666' }}>Please login to apply for adoption</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Login to Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetail;

