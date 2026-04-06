import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';

const ObservationChartsView = () => {
  const stats = [
    { title: 'Last 24 Hours', value: '0' },
    { title: 'Last 30 Days', value: '84' },
    { title: 'Closed on Time', value: '10' },
    { title: 'Overdue', value: '73' },
    { title: 'Escalated', value: '0' },
    { title: 'Near Miss', value: '5' },
  ];

  const riskData = [
    { name: 'Slip / Trip / Fall Same...', value: 40, color: '#facc15' },
    { name: 'Others', value: 25, color: '#f97316' },
    { name: 'Entrapment', value: 15, color: '#4b5563' },
    { name: 'Grease buildup', value: 20, color: '#2dd4bf' },
  ];

  const operationalData = [
    { name: 'Container Yard...', value: 35, color: '#2dd4bf' },
    { name: 'Driving', value: 15, color: '#94a3b8' },
    { name: 'Others', value: 20, color: '#facc15' },
    { name: 'Facility Mainte...', value: 15, color: '#f97316' },
    { name: 'Vessel Operatio...', value: 15, color: '#4b5563' },
  ];

  const areaDetails = [
    { name: 'Container Berth', value: 11 },
    { name: 'Admin. Building', value: 11 },
    { name: 'Auxiliary facilities', value: 9 },
    { name: 'Bilge facility', value: 9 },
    { name: 'Container & General Cargo Berth', value: 5 },
    { name: 'Others', value: 39 },
  ];

  const lineData = [
    { name: '0 days', value: 0 },
    { name: '5 days', value: 0 },
    { name: '10 days', value: 19 },
    { name: '15 days', value: 16 },
    { name: '20 days', value: 48 },
    { name: '25 days', value: 1 },
    { name: '30 days', value: 0 },
  ];

  const barData = [
    { name: 'New', value: 23 },
    { name: 'Review', value: 33 },
    { name: 'Inspection', value: 18 },
    { name: 'Rejected', value: 0 },
    { name: 'Closed', value: 10 },
  ];

  return (
    <div className="obs-charts-container">
      {/* Stat Grid */}
      <div className="obs-stat-grid">
        {stats.map((stat, i) => (
          <div key={i} className="obs-stat-card">
            <span className="stat-title">{stat.title}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="obs-row" style={{ marginBottom: '16px' }}>
        <div className="obs-col obs-card">
          <div className="obs-card-title">Top 5 Risk Categories</div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="45%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="obs-col obs-card">
          <div className="obs-card-title">Area Details</div>
          <div className="area-details-list">
            {areaDetails.map((area, i) => (
              <div key={i} className="area-detail-item">
                <span>{area.name}</span>
                <span className="area-badge">{area.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="obs-col obs-card">
          <div className="obs-card-title">Top 5 Operational Activities</div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationalData}
                  cx="45%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {operationalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="obs-row">
        <div className="obs-col flex-2 obs-card">
          <div className="obs-card-title">Observations</div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Line type="linear" dataKey="value" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="obs-col flex-2 obs-card">
          <div className="obs-card-title">Observations by Status</div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#67e8f9" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationChartsView;
