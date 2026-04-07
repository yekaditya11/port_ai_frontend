import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// Minimalist palette
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#0088FE'];

export default function ChatbotChart({ chart }) {
  if (!chart || chart.chart_type === "none" || !chart.chart_data || chart.chart_data.length === 0) {
    return null; 
  }

  const { chart_type, chart_data, x_key, y_key } = chart;

  return (
    <div style={{ width: '100%', height: 460, marginTop: '20px', marginBottom: '10px' }}>
      <ResponsiveContainer>
        {chart_type === 'pie' && (
          <PieChart>
            <Pie 
              data={chart_data} 
              dataKey={y_key} 
              nameKey={x_key} 
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              fill="#8884d8" 
              label
            >
              {chart_data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
        
        {chart_type === 'bar' && (
          <BarChart data={chart_data} margin={{ top: 20, right: 30, left: 0, bottom: 120 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={x_key} 
              axisLine={false} 
              tickLine={false}
              interval={0}
              angle={-70}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#6b7280', dy: 10, dx: -10 }}
              height={110}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey={y_key} fill="#8884d8" radius={[4, 4, 0, 0]}>
              {chart_data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {chart_type === 'line' && (
          <LineChart data={chart_data} margin={{ top: 20, right: 30, left: 0, bottom: 120 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={x_key} 
              axisLine={false} 
              tickLine={false}
              interval={0}
              angle={-70}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#6b7280', dy: 10, dx: -10 }}
              height={110}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip />
            <Line type="monotone" dataKey={y_key} stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
