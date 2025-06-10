import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import propertyService from '../services/propertyService';
import AuthContext from '../context/AuthContext';
import Chatbox from '../components/Chatbox';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setProperties([]);
    setPage(0);
  }, [searchQuery, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const newProperties = await propertyService.fetchProperties({ searchQuery, minPrice, maxPrice, sortOrder, page });
      
      setProperties(prev => (page === 0 ? newProperties : [...prev, ...newProperties]));
      setHasMore(newProperties.length > 0);
      setLoading(false);
    };

    fetchProperties();
  }, [page, searchQuery, minPrice, maxPrice, sortOrder, location.state]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleCreateProperty = () => {
    navigate('/create-property');
  };

  const canCreateProperty = user && (user.role === 'admin' || user.role === 'owner');

  return (
    <div className="home">
      <h1>Available Properties</h1>

      <input
        type="text"
        placeholder="Search for properties..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div style={{ display: 'flex', gap: '4%', marginBottom: '10px' }}>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

      {canCreateProperty && (
        <button onClick={handleCreateProperty} className="create-property-button">
          Create New Property
        </button>
      )}

      <div className="property-list">
        {properties.map(property => <PropertyCard key={property._id} property={property} />)}
      </div>
      
      {loading && <p className="load-more-notice">Loading...</p>}
      {!hasMore && <p className="load-more-notice">No more properties to show</p>}
      
      <Chatbox />
    </div>
  );
};

export default Home;
