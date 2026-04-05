import React from 'react';

const Top5IncidentsList = () => {
  const items = [
    { label: 'Injury & Ill Health', count: 25 },
    { label: 'Asset Damage', count: 24 },
    { label: 'Environment', count: 8 },
    { label: 'Environmental Disaster', count: 5 },
    { label: 'Accident', count: 5 },
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top 5 Incidents</h3>
      <div className="list-container">
        {items.map((item, index) => (
          <div key={index} className="list-item">
            <span className="item-label">{item.label}</span>
            <div className="item-count-circle">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top5IncidentsList;
