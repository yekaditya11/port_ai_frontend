import React from 'react';
import StatCard from './StatCard';
import './StatGrid.css';

const StatGrid = () => {
  const stats = [
    { title: 'Incidents in Last 30 Days', value: '84' },
    { title: 'Incident Days', value: '14' },
    { title: 'Open Incidents', value: '82' },
    { title: 'Incident-Free Days', value: '16' },
    { title: 'Injury-Free Days', value: '19' },
    { title: 'Days Since Last Fatality', value: '--' },
  ];

  return (
    <div className="stat-grid">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          title={stat.title} 
          value={stat.value} 
        />
      ))}
    </div>
  );
};

export default StatGrid;
