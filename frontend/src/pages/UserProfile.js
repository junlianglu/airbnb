import React, { useEffect, useContext, useState } from 'react';
import userService from '../services/userService';
import AuthContext from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      userService.getUserProfile(storedUser._id)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setUser]);

  if (loading) return <div className="loading-text">Loading...</div>;

  if (!user) return <div className="no-user-text">No user found.</div>;

  return (
    <div className="user-profile-container">
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
