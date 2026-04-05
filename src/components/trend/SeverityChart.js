import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SeverityChart = () => {
  const data = [
    { name: '1-Negligible', value: 12, color: '#78d2c0' }, // teal
    { name: '2-Minor', value: 18, color: '#a4ce7e' }, // green
    { name: '3-Moderate', value: 34, color: '#f2a654' }, // orange
    { name: '4-Major', value: 24, color: '#4cb4e7' }, // blue
    { name: '5-Catastrophic', value: 12, color: '#f46a6a' }, // red
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Incident Severity Breakdown</h3>
      <div className="chart-container" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
