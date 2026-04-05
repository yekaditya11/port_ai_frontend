import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: '1-Negligible', value: 10, color: '#2C7A7B' },
  { name: '2-Minor', value: 15, color: '#3182CE' },
  { name: '3-Moderate', value: 40, color: '#F6AD55' },
  { name: '4-Major', value: 25, color: '#ED8936' },
  { name: '5-Catastrophic', value: 10, color: '#4FD1C5' },
];

const SeverityChart = () => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Incident Severity Breakdown</h3>
      <div className="chart-content" style={{ height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
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
              contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#CBD5E0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityChart;
