import React from 'react';
import StatCard from './StatCard';
import './StatGrid.css';

const StatGrid = ({ data }) => {
  const stats = [
    { title: 'Incidents in Last 30 Days', value: data?.incidents_last_30_days ?? '--' },
    { title: 'Incident Days', value: data?.incident_days ?? '--' },
    { title: 'Open Incidents', value: data?.open_incidents ?? '--' },
    { title: 'Incident-Free Days', value: data?.incident_free_days ?? '--' },
    { title: 'Injury-Free Days', value: data?.injury_free_days ?? '--' },
    { title: 'Days Since Last Fatality', value: data?.days_since_fatality ?? '--' },
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
