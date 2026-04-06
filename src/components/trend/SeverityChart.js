import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SeverityChart = ({ data = [] }) => {
  // If no data, show default structure with 0s
  const chartData = data.length > 0 ? data : [
    { name: '1-Negligible', value: 0, color: '#78d2c0' },
    { name: '2-Minor', value: 0, color: '#a4ce7e' },
    { name: '3-Moderate', value: 0, color: '#f2a654' },
    { name: '4-Major', value: 0, color: '#4cb4e7' },
    { name: '5-Catastrophic', value: 0, color: '#f46a6a' },
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Incident Severity Breakdown</h3>
      <div className="chart-container" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a365d', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical"
              formatter={(value) => <span style={{ color: '#a0aec0', fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityChart;
