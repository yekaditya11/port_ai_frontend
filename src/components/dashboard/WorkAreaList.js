import React from 'react';
import './WorkAreaList.css';

const data = [
  { name: 'Container Berth', count: 19 },
  { name: 'Bunkering Station', count: 13 },
  { name: 'Container & General Cargo Berth', count: 10 },
  { name: 'Bilge Facility', count: 8 },
  { name: 'Auxiliary facilities', count: 7 },
  { name: 'Both', count: 27 },
];

const WorkAreaList = () => {
  return (
    <div className="work-area-card">
      <div className="work-area-header">
        <h3 className="work-area-title">Work Area</h3>
      </div>
      <div className="work-area-content">
        <div className="list-items">
          {data.map((item, index) => (
            <div key={index} className="work-area-item">
              <span className="item-name">{item.name}</span>
              <span className="item-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkAreaList;
