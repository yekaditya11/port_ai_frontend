import React from 'react';
import './WorkAreaList.css';

const WorkAreaList = ({ data = [] }) => {
  return (
    <div className="work-area-card">
      <div className="work-area-header">
        <h3 className="work-area-title">Work Area</h3>
      </div>
      <div className="work-area-content">
        <div className="list-items">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="work-area-item">
                <span className="item-name">{item.name}</span>
                <span className="item-count">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No work area data</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default WorkAreaList;
