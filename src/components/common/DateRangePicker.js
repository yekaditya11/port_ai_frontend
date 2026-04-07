import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DateRangePicker.css';

const DateRangePicker = ({ startDate, endDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleYearChange = (year, e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(parseInt(year), currentMonth.getMonth(), 1));
  };

  const years = Array.from({ length: 21 }, (_, i) => 2020 + i);

  const handleDateClick = (day, month, year, e) => {
    e.stopPropagation();
    const selectedDate = new Date(year, month, day);
    
    if (!startDate || (startDate && endDate)) {
      onSelect(selectedDate, null);
    } else {
      if (selectedDate < startDate) {
        onSelect(selectedDate, null);
      } else {
        onSelect(startDate, selectedDate);
      }
    }
  };

  const renderCalendar = (date, isFirst) => {
    const { firstDay, daysInMonth, year, month } = getDaysInMonth(date);
    const days = [];
    const today = new Date();

    // Empty cells for the first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty-cell"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = d.toDateString() === today.toDateString();
      const isSelected = (startDate && d.toDateString() === startDate.toDateString()) || 
                         (endDate && d.toDateString() === endDate.toDateString());
      const inRange = startDate && endDate && d > startDate && d < endDate;
      const isRangeStart = startDate && d.toDateString() === startDate.toDateString() && endDate;
      const isRangeEnd = endDate && d.toDateString() === endDate.toDateString();

      days.push(
        <div 
          key={day} 
          className={`day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${inRange ? 'in-range' : ''} ${isRangeStart ? 'range-start' : ''} ${isRangeEnd ? 'range-end' : ''}`}
          onClick={(e) => handleDateClick(day, month, year, e)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          {isFirst ? (
            <button className="nav-btn prev-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
          ) : <div className="nav-btn-placeholder" />}
          
          <div className="month-year-display">
            <span className="month-label">{date.toLocaleString('default', { month: 'long' })}</span>
            <select 
              className="year-select" 
              value={year} 
              onChange={(e) => handleYearChange(e.target.value, e)}
              onClick={(e) => e.stopPropagation()}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {!isFirst ? (
            <button className="nav-btn next-btn" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          ) : <div className="nav-btn-placeholder" />}
        </div>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="weekday-header">{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  return (
    <div className="date-range-popover" onClick={(e) => e.stopPropagation()}>
      <div className="dual-calendar-container">
        {renderCalendar(currentMonth, true)}
        {renderCalendar(nextMonthDate, false)}
      </div>

      <div className="date-picker-footer">
        <button className="btn-done" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>DONE</button>
      </div>
    </div>
  );
};

export default DateRangePicker;
