import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './components/BookingSuccess';
import { AuthProvider } from './context/AuthContext';
import CreateProperty from './pages/CreateProperty';
import UploadImages from './components/UploadImages';
import BookingHistory from './components/BookingHistory';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/property/:id/upload-images" element={<UploadImages />} />
          <Route path="/booking-history" element={<BookingHistory />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
