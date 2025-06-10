// Booking.js
import React from 'react';
import dayjs from 'dayjs';
import styles from './Booking.module.css';

const Booking = ({ booking, onCancel }) => {
  const { propertyId, checkInDate, checkOutDate, totalPrice } = booking;
  const isCancellable = dayjs().isBefore(dayjs(checkInDate)); // Check if cancellation is allowed

  return (
    <div className={styles.booking}>
      <h3 className={styles.title}>{propertyId.title}</h3>
      <p className={styles.location}>Location: {propertyId.location}</p>
      <p className={styles.date}>Check-In: {dayjs(checkInDate).format('MMMM D, YYYY')}</p>
      <p className={styles.date}>Check-Out: {dayjs(checkOutDate).format('MMMM D, YYYY')}</p>
      <p className={styles.price}>Total Price: ${totalPrice}</p>
      {propertyId.imageUrls && propertyId.imageUrls.length > 0 && (
        <img
          src={propertyId.imageUrls[0]}
          alt="Property"
          className={styles.propertyImage}
        />
      )}
      {isCancellable ? (
        <button onClick={onCancel} className={styles.cancelButton}>Cancel Booking</button>
      ) : (
        <p className={styles.nonCancellable}>This booking cannot be canceled.</p>
      )}
    </div>
  );
};

export default Booking;
