import React from 'react';
import StatCard from '../dashboard/StatCard';
import '../dashboard/StatGrid.css';

const StatGridTrend = ({ stats = {} }) => {
  const trendStats = [
    { title: 'Total Incidents', value: stats.total_incidents || '0' },
    { title: 'Lost Time Injuries', value: stats.lti_count || '0' },
    { title: 'Near Miss', value: '4' },
    { title: 'Environmental Incidents', value: stats.med_count || '0' },
    { title: 'High Potential Incidents', value: '6' },
    { title: 'Recordable Incident Rate', value: '34' },
  ];

  return (
    <div className="stat-grid">
      {trendStats.map((stat, index) => (
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
