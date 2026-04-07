import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, unit, trend, status }) => {
  return (
    <div className={`stat-card-premium ${status || ''}`}>
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        <div className="stat-card-icon-bg">
          {trend === 'up' && <TrendingUp size={14} className="trend-icon positive" />}
          {trend === 'down' && <TrendingDown size={14} className="trend-icon negative" />}
          {!trend && <Minus size={14} className="trend-icon neutral" />}
        </div>
      </div>
      <div className="stat-card-content">
        <div className="stat-card-main-row">
          <span className="stat-card-value">{value}</span>
          {unit && <span className="stat-card-unit">{unit}</span>}
        </div>
        <div className="stat-card-footer">
          <span className="stat-card-label">Overall Stats</span>
        </div>
      </div>
      <div className="stat-card-accent-bar"></div>
    </div>
  );
};

export default StatCard;
