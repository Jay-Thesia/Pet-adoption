import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Pet, ApiResponse, Pagination } from '../types';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import './Home.css';

const Home: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    breed: '',
    age: '',
    page: 1
  });

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.species, filters.breed, filters.age]);

  const fetchPets = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        limit: 12
      };

      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.species) {
        params.species = filters.species;
      }
      if (filters.breed) {
        params.breed = filters.breed;
      }
      if (filters.age) {
        params.age = filters.age;
      }

      const res = await api.get<ApiResponse<Pet[]>>('/pets', { params });
      if (res.data.data) {
        setPets(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchPets();
  };

  const handleFilterChange = (key: string, value: string): void => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>Find Your Perfect Pet</h1>
        <p>Browse our available pets and find your new best friend</p>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filters">
          <select
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
            className="filter-select"
          >
            <option value="">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Breed"
            value={filters.breed}
            onChange={(e) => handleFilterChange('breed', e.target.value)}
            className="filter-input"
          />

          <input
            type="number"
            placeholder="Age"
            value={filters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="filter-input"
            min="0"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <img 
                  src={pet.photo || PLACEHOLDER_IMAGE} 
                  alt={pet.name} 
                  className="pet-photo"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} years</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <Link to={`/pet/${pet._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= pagination.pages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

