import React, { useState } from 'react';
import './AirbnbDatePicker.css';

const AirbnbDatePicker = ({ unavailableDates = [], onDatesChange, onBook }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time portion

  const [startDate, setStartDate] = useState(null); // Check-in date
  const [endDate, setEndDate] = useState(null); // Check-out date
  const [hoverDate, setHoverDate] = useState(null); // For range highlighting
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Generate a list of dates for a given month and year
  const generateCalendarDates = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay(); // Day of the week (0-6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];

    // Previous month's dates (for padding)
    for (let i = 0; i < startingDay; i++) {
      dates.push(null);
    }

    // Current month's dates
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  // Check if a date is before today
  const isBeforeToday = (date) => {
    return date < today;
  };

  const getNextUnavailableCheckInDate = () => {
    if (!startDate) return null;
    const startDateString = startDate.toISOString().split('T')[0];
    const nextUnavailableDate = unavailableDates.find(unavailableDate => unavailableDate > startDateString);
    return nextUnavailableDate;
  };

  const isDateAfterNextUnavailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const nextUnavailableCheckInDate = getNextUnavailableCheckInDate();
    return nextUnavailableCheckInDate && dateString > nextUnavailableCheckInDate;
  }

  // Check if a date is unavailable
  const isUnavailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const nextUnavailableCheckInDate = getNextUnavailableCheckInDate();
    
    if (!startDate) {
      return unavailableDates.includes(dateString) || isBeforeToday(date);
    }

    // Allow only the next unavailable date for check-out, otherwise restrict
    return (unavailableDates.includes(dateString) && !(nextUnavailableCheckInDate && dateString === nextUnavailableCheckInDate))
      || isBeforeToday(date) || (startDate && !endDate && date < startDate) || (startDate && !endDate && isDateAfterNextUnavailable(date));

    // return unavailableDates.includes(dateString) || isBeforeToday(date) || (startDate && !endDate && date < startDate) || (startDate && !endDate && isDateAfterNextUnavailable(date));
  };

  // Check if a date is within the selected range
  const isInSelectedRange = (date) => {
    if (startDate && !endDate && hoverDate) {
      return date > startDate && date < hoverDate;
    }
    if (startDate && endDate) {
      return date > startDate && date < endDate;
    }
    return false;
  };

  // Handle date click
  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (isUnavailable(date) || (endDate && unavailableDates.includes(dateString))) {
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setHoverDate(null);
      if (onDatesChange) {
        onDatesChange({ startDate: date, endDate: null });
      }
    } else if (startDate && !endDate) {
      if (date > startDate) {
        setEndDate(date);
        if (onDatesChange) {
          onDatesChange({ startDate, endDate: date });
        }
      } else {
        // If the second date is before the first, reset startDate
        setStartDate(date);
        setEndDate(null);
        setHoverDate(null);
        if (onDatesChange) {
          onDatesChange({ startDate: date, endDate: null });
        }
      }
    }
  };

  // Handle mouse over date (for range highlight)
  const handleDateMouseEnter = (date) => {
    if (startDate && !endDate) {
      setHoverDate(date);
    }
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Render calendar for a month
  const renderCalendar = (year, month) => {
    const dates = generateCalendarDates(year, month);

    return (
      <div className="calendar-month" key={`${year}-${month}`}>
        <div className="calendar-header">
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="calendar-day-name">
              {day}
            </div>
          ))}
          {dates.map((date, index) => {
            if (!date) {
              return <div key={index} className="calendar-day empty"></div>;
            }

            const isSelectedStart = startDate && date.getTime() === startDate.getTime();
            const isSelectedEnd = endDate && date.getTime() === endDate.getTime();
            const isSelected = isSelectedStart || isSelectedEnd;
            const isInRange = isInSelectedRange(date);
            const isDisabled = isUnavailable(date);

            let className = 'calendar-day';
            if (isDisabled) {
              className += ' disabled';
            } else if (isSelectedStart) {
              className += ' selected-start';
            } else if (isSelectedEnd) {
              className += ' selected-end';
            } else if (isSelected) {
              className += ' selected';
            } else if (isInRange) {
              className += ' in-range';
            }

            return (
              <div
                key={index}
                className={className}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => handleDateMouseEnter(date)}
              >
                <span>{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="airbnb-date-picker">
      <div className="selected-dates">
        <p>
          Check-in:{' '}
          {startDate ? startDate.toLocaleDateString() : 'Select a date'}
        </p>
        <p>
          Check-out:{' '}
          {endDate ? endDate.toLocaleDateString() : 'Select a date'}
        </p>
      </div>
      <div className="calendar-container">
        <div className="navigation">
          <button onClick={goToPreviousMonth}>&lt;</button>
        </div>
        {renderCalendar(currentYear, currentMonth)}
        {renderCalendar(
          currentMonth === 11 ? currentYear + 1 : currentYear,
          (currentMonth + 1) % 12
        )}
        <div className="navigation">
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
      </div>
      <button
        className="booking-button"
        onClick={onBook}
        disabled={!startDate || !endDate} // Enable only if both dates are selected
      >
        Book Now
      </button>
    </div>
  );
};

export default AirbnbDatePicker;
