import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import propertyService from '../services/propertyService';
import { useParams, useNavigate } from 'react-router-dom';
import './UploadImages.css';

const UploadImages = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Get property ID from the route
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      navigate('/'); // Redirect to the homepage or another appropriate page
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files); // Set selected files from input
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]); // Append each file to the formData
    }

    try {
      await propertyService.uploadPropertyImages(id, formData); // Call service to upload images
      setUploadSuccess(true);
      setTimeout(() => navigate(`/property/${id}`), 2000); // Redirect to property details after success
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed');
    }
  };

  return (
    <div className="upload-images-container">
      <h2>Upload Images for Property</h2>
      {uploadSuccess ? (
        <p className="upload-success-message">Images uploaded successfully! Redirecting...</p>
      ) : (
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" multiple onChange={handleFileChange} />
          <button type="submit" className="upload-button">Upload</button>
        </form>
      )}
    </div>
  );
};

export default UploadImages;
