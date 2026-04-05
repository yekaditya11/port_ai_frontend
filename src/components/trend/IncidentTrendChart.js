import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IncidentTrendChart = () => {
  const data = [
    { name: '1', value: 10 },
    { name: '2', value: 35 },
    { name: '3', value: 38 },
    { name: '4', value: 5 },
    { name: '5', value: 5 },
    { name: '6', value: 5 },
    { name: '7', value: 5 },
    { name: '8', value: 5 },
    { name: '9', value: 5 },
    { name: '10', value: 5 },
    { name: '11', value: 5 },
    { name: '12', value: 5 },
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Incident trend</h3>
      <div className="chart-container" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a0aec0', fontSize: 10 }}
              label={{ value: 'Weeks', position: 'bottom', fill: '#a0aec0', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a0aec0', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a365d', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#78d2c0" 
              strokeWidth={2} 
              dot={{ fill: '#f46a6a', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentTrendChart;
