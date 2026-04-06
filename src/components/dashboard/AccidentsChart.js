import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AccidentsChart.css';

const AccidentsChart = ({ data = [] }) => {
  const chartData = data.map(item => ({
    name: item.day_bucket,
    value: item.count
  }));

  return (
    <div className="chart-card line-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Accidents</h3>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#78d2c0" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#f46a6a', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default AccidentsChart;
