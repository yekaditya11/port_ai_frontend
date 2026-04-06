import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './IncidentTypeChart.css';

const colors = {
  'Injury & Ill Health': '#a4ce7e',
  'Asset Damage': '#78d2c0',
  'Environment': '#f2a654',
  'Environmental Disaster': '#f46a6a',
  'Accident': '#4cb4e7',
  'Near Miss': '#72c472',
  'Unspecified': '#f9c851',
  'Vehicle Accident': '#ff8c00',
};

const IncidentTypeChart = ({ data = [] }) => {
  const chartData = data.map(item => ({
    ...item,
    color: colors[item.name] || '#cbd5e0'
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Incident Type</h3>
        </div>
        <div className="chart-content no-data">
          <p>No data available</p>
        </div>
      </div>
    );
  }

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
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {chartData.map((entry, index) => (
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
