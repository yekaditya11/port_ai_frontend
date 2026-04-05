import React from 'react';

const EquipmentDamageList = () => {
  const items = [
    { label: 'Air Compressor', count: 2 },
    { label: 'Internal Transfer Vehicle', count: 2 },
    { label: 'Quay Crane', count: 2 },
    { label: 'Skid-Steer Loader', count: 1 },
    { label: 'Electric Rubber Tyred Gantry Crane', count: 1 },
    { label: 'Electric Vehicle', count: 1 },
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Equipment Damage</h3>
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

export default EquipmentDamageList;
