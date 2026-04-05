import React from 'react';
import StatCard from '../dashboard/StatCard';
import '../dashboard/StatGrid.css';

const StatGridTrend = () => {
  const stats = [
    { title: 'Total Incidents', value: '84' },
    { title: 'Lost Time Injuries', value: '29' },
    { title: 'Near Miss', value: '4' },
    { title: 'Environmental Incidents', value: '8' },
    { title: 'High Potential Incidents', value: '6' },
    { title: 'Recordable Incident Rate', value: '34' },
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

export default StatGridTrend;
