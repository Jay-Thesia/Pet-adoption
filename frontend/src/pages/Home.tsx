import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Pet, ApiResponse, Pagination } from '../types';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import { useDebounce } from '../hooks/useDebounce';
import './Home.css';

const Home: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  const [searchInput, setSearchInput] = useState<string>('');
  const [breedInput, setBreedInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('');
  
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    breed: '',
    age: '',
    page: 1
  });

  const debouncedSearch = useDebounce(searchInput.trim(), 500);
  const debouncedBreed = useDebounce(breedInput.trim(), 500);
  const debouncedAge = useDebounce(ageInput.trim(), 500);

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      search: debouncedSearch, 
      page: 1 
    }));
  }, [debouncedSearch]);

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      breed: debouncedBreed, 
      page: 1 
    }));
  }, [debouncedBreed]);

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      age: debouncedAge, 
      page: 1 
    }));
  }, [debouncedAge]);

  useEffect(() => {
    fetchPets();
  }, [filters.page, filters.search, filters.species, filters.breed, filters.age]);

  const fetchPets = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        limit: 10
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

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput.trim(), page: 1 }));
  };

  const handleSpeciesChange = (value: string): void => {
    setFilters({ ...filters, species: value, page: 1 });
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>Find Your Perfect Pet</h1>
        <p>Browse our available pets and find your new best friend</p>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filters">
          <select
            value={filters.species}
            onChange={(e) => handleSpeciesChange(e.target.value)}
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
            value={breedInput}
            onChange={(e) => setBreedInput(e.target.value)}
            className="filter-input"
          />

          <input
            type="number"
            placeholder="Age"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
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
            {pets.length > 0 ? pets.map((pet) => (
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
            )): <div> No result found </div>}
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

