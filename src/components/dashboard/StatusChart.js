import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'New', value: 32 },
  { name: 'Review', value: 31 },
  { name: 'Investigation', value: 7 },
  { name: 'Overdue', value: 0 },
  { name: 'Reopened', value: 0 },
  { name: 'Resolved', value: 2 },
  { name: 'Rejected', value: 0 },
  { name: 'Inspection', value: 12 },
];

const StatusChart = () => {
  return (
    <div className="chart-card bar-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Incidents by Status</h3>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }}
              domain={[0, 35]}
            />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#78d2c0" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
