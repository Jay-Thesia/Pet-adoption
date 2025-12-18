import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { Pet, Adoption, ApiResponse } from '../types';
import { createPetSchema, updatePetSchema } from '../validations/petValidation';
import './AdminDashboard.css';

interface PetFormData {
  name?: string;
  species?: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age?: number;
  gender?: 'male' | 'female' | 'unknown';
  description?: string;
  photo?: string;
  status?: 'available' | 'pending' | 'adopted';
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pets' | 'adoptions'>('pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPetForm, setShowPetForm] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PetFormData>({
    resolver: yupResolver(editingPet ? updatePetSchema : createPetSchema) as any,
    defaultValues: {
      name: '',
      species: 'dog',
      breed: '',
      age: 0,
      gender: 'unknown',
      description: '',
      photo: '',
      status: 'available'
    }
  });

  useEffect(() => {
    if (activeTab === 'pets') {
      fetchPets();
    } else {
      fetchAdoptions();
    }
  }, [activeTab]);

  useEffect(() => {
    if (editingPet && showPetForm) {
      setValue('name', editingPet.name);
      setValue('species', editingPet.species);
      setValue('breed', editingPet.breed);
      setValue('age', editingPet.age);
      setValue('gender', editingPet.gender);
      setValue('description', editingPet.description || '');
      setValue('photo', editingPet.photo || '');
      setValue('status', editingPet.status);
    } else if (!editingPet && showPetForm) {
      reset();
    }
  }, [editingPet, showPetForm, setValue, reset]);

  const fetchPets = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Pet[]>>('/pets');
      if (res.data.data) {
        setPets(res.data.data);
      }
    } catch (error) {
      // Error is already handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  const fetchAdoptions = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Adoption[]>>('/adoptions');
      if (res.data.data) {
        setAdoptions(res.data.data);
      }
    } catch (error) {
      // Error is already handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string): Promise<void> => {
    try {
      await api.put(`/adoptions/${id}/approve`);
      toast.success('Adoption application approved successfully!');
      fetchAdoptions();
    } catch (error) {
      // Error is already handled by API interceptor
    }
  };

  const handleReject = async (id: string): Promise<void> => {
    try {
      await api.put(`/adoptions/${id}/reject`);
      toast.success('Adoption application rejected.');
      fetchAdoptions();
    } catch (error) {
      // Error is already handled by API interceptor
    }
  };

  const handleDeletePet = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await api.delete(`/pets/${id}`);
        toast.success('Pet deleted successfully!');
        fetchPets();
      } catch (error) {
        // Error is already handled by API interceptor
      }
    }
  };

  const handleSavePet = async (data: PetFormData): Promise<void> => {
    try {
      // Ensure status is set to 'available' for new pets if not provided
      const petData = {
        ...data,
        status: data.status || 'available'
      };

      if (editingPet) {
        await api.put(`/pets/${editingPet._id}`, petData);
        toast.success('Pet updated successfully!');
      } else {
        await api.post('/pets', petData);
        toast.success('Pet added successfully!');
      }
      setShowPetForm(false);
      setEditingPet(null);
      reset();
      fetchPets();
    } catch (error) {
      // Error is already handled by API interceptor
    }
  };

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === 'pets' ? 'active' : ''}
            onClick={() => setActiveTab('pets')}
          >
            Manage Pets
          </button>
          <button
            className={activeTab === 'adoptions' ? 'active' : ''}
            onClick={() => setActiveTab('adoptions')}
          >
            Adoption Applications
          </button>
        </div>
      </div>

      {activeTab === 'pets' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Pets</h2>
            <button 
              onClick={() => { 
                setEditingPet(null); 
                reset();
                setShowPetForm(true); 
              }} 
              className="btn btn-primary"
            >
              Add New Pet
            </button>
          </div>

          {showPetForm && (
            <div className="pet-form-card">
              <h3>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h3>
              <form onSubmit={handleSubmit(handleSavePet)}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="species">Species *</label>
                  <select id="species" {...register('species')}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.species && (
                    <div className="error-message">{errors.species.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="breed">Breed *</label>
                  <input
                    type="text"
                    id="breed"
                    {...register('breed')}
                  />
                  {errors.breed && (
                    <div className="error-message">{errors.breed.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    min="0"
                  />
                  {errors.age && (
                    <div className="error-message">{errors.age.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" {...register('gender')}>
                    <option value="unknown">Unknown</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <div className="error-message">{errors.gender.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <div className="error-message">{errors.description.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="photo">Photo URL</label>
                  <input
                    type="url"
                    id="photo"
                    {...register('photo')}
                  />
                  {errors.photo && (
                    <div className="error-message">{errors.photo.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select id="status" {...register('status')} defaultValue="available">
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                  {errors.status && (
                    <div className="error-message">{errors.status.message}</div>
                  )}
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Note: Only pets with "Available" status will be visible on the public page.
                  </small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingPet ? 'Update Pet' : 'Add Pet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPetForm(false);
                      setEditingPet(null);
                      reset();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="pets-list">
              {pets.map((pet) => (
                <div key={pet._id} className="pet-item">
                  <div className="pet-item-info">
                    <h3>{pet.name}</h3>
                    <p>{pet.species} - {pet.breed} - {pet.age} years</p>
                    <p>Status: <span className={`status-${pet.status}`}>{pet.status}</span></p>
                  </div>
                  <div className="pet-item-actions">
                    <button
                      onClick={() => { 
                        setEditingPet(pet); 
                        setShowPetForm(true); 
                      }}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePet(pet._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'adoptions' && (
        <div className="admin-section">
          <h2>Adoption Applications</h2>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="adoptions-list">
              {adoptions.map((adoption) => {
                const pet = typeof adoption.pet === 'object' ? adoption.pet : null;
                const applicant = typeof adoption.applicant === 'object' ? adoption.applicant : null;
                return (
                  <div key={adoption._id} className="adoption-item">
                    <div className="adoption-info">
                      <h3>{pet?.name || 'Pet'}</h3>
                      <p><strong>Applicant:</strong> {applicant?.name} ({applicant?.email})</p>
                      <p><strong>Applied on:</strong> {new Date(adoption.applicationDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span className={`status-${adoption.status}`}>{adoption.status}</span></p>
                      {adoption.notes && <p><strong>Notes:</strong> {adoption.notes}</p>}
                    </div>
                    {adoption.status === 'pending' && (
                      <div className="adoption-actions">
                        <button
                          onClick={() => handleApprove(adoption._id)}
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(adoption._id)}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
