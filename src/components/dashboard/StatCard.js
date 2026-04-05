import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, unit }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
};

export default StatCard;
