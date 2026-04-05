import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './IncidentTypeChart.css';

const data = [
  { name: 'Injury & Ill Health', value: 400, color: '#a4ce7e' },
  { name: 'Asset Damage', value: 300, color: '#78d2c0' },
  { name: 'Environment', value: 300, color: '#f2a654' },
  { name: 'Environmental Disaster', value: 200, color: '#f46a6a' },
  { name: 'Accident', value: 150, color: '#4cb4e7' },
  { name: 'Near Miss', value: 100, color: '#72c472' },
  { name: 'Unspecified', value: 80, color: '#f9c851' },
  { name: 'Vehicle Accident', value: 50, color: '#ff8c00' },
];

const IncidentTypeChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Incident Type</h3>
      </div>
      <div className="chart-content">
        <div className="pie-container">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {data.map((entry, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
              <span className="legend-label">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentTypeChart;
