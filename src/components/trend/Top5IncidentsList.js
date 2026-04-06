import React from 'react';

const Top5IncidentsList = ({ data = [] }) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Last 5 Incidents</h3>
      <div className="list-container">
        {data.map((item, index) => (
          <div key={index} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2d3748' }}>
            <div className="item-left" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="item-ref" style={{ color: '#22d3ee', fontSize: '12px', fontWeight: 'bold' }}>{item.ref}</span>
              <span className="item-label" style={{ color: '#e2e8f0', fontSize: '13px' }}>{item.title}</span>
            </div>
            <div className="item-count-circle" style={{ backgroundColor: '#2d3748', color: '#78d2c0', fontSize: '10px', height: '20px', width: 'auto', padding: '0 8px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
              {item.date}
            </div>
          </div>
        ))}
        {data.length === 0 && <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No recent incidents</div>}
      </div>
    </div>
  );
};

export default Top5IncidentsList;
