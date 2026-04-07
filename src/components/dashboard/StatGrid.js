import React from 'react';
import StatCard from './StatCard';
import './StatGrid.css';

const StatGrid = ({ data }) => {
  const stats = [
    { 
      title: 'Incidents in Period', 
      value: data?.incidents_last_30_days ?? '--',
      trend: (data?.incidents_last_30_days > 20) ? 'up' : 'down',
      status: (data?.incidents_last_30_days > 50) ? 'critical' : 'info'
    },
    { 
      title: 'Incident Days', 
      value: data?.incident_days ?? '--',
      trend: (data?.incident_days > 5) ? 'up' : 'down',
      status: 'warning'
    },
    { 
      title: 'Open Incidents', 
      value: data?.open_incidents ?? '--',
      status: 'info'
    },
    { 
      title: 'Incident-Free Days', 
      value: data?.incident_free_days ?? '--',
      trend: 'up',
      status: 'success'
    },
    { 
      title: 'Injury-Free Days', 
      value: data?.injury_free_days ?? '--',
      trend: 'up',
      status: 'success'
    },
    { 
      title: 'Days Since Last Fatality', 
      value: data?.days_since_fatality ?? '--',
      status: 'success'
    },
  ];

  return (
    <div className="stat-grid">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          title={stat.title} 
          value={stat.value} 
          trend={stat.trend}
          status={stat.status}
        />
      ))}
    </div>
  );
};

export default StatGrid;
