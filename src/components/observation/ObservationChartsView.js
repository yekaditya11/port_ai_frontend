import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { Search } from 'lucide-react';

const ObservationChartsView = ({ data }) => {
  if (!data) return null;

  // Formatting summary cards
  const summaryStats = [
    { title: 'Last 24 Hours', value: data.summary_stats?.last_24h || '0' },
    { title: 'Last 30 Days', value: data.summary_stats?.last_30d || '0' },
    { title: 'Closed on Time', value: data.summary_stats?.closed_on_time || '0' },
    { title: 'Overdue', value: data.summary_stats?.overdue || '0' },
    { title: 'Near Miss', value: data.near_misses || '0' },
    { title: 'Total Observations', value: data.summary_stats?.total || '0' },
  ];

  // Helper for empty charts
  const NoData = ({ message = "No data for this range" }) => (
    <div style={{ 
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', color: '#94a3b8' 
    }}>
      <Search size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
      <span style={{ fontSize: '11px' }}>{message}</span>
    </div>
  );

  return (
    <div className="obs-charts-container">
      {/* Stat Grid */}
      <div className="obs-stat-grid">
        {summaryStats.map((stat, i) => (
          <div key={i} className="obs-stat-card">
            <span className="stat-title">{stat.title}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="obs-row" style={{ marginBottom: '16px' }}>
        <div className="obs-col obs-card">
          <div className="obs-card-title">Top Risk Categories</div>
          <div style={{ width: '100%', height: 250 }}>
            {data.top_risk_categories?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.top_risk_categories}
                    cx="45%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.top_risk_categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || ['#facc15', '#f97316', '#4b5563', '#2dd4bf'][index % 4]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <NoData />}
          </div>
        </div>

        <div className="obs-col obs-card">
          <div className="obs-card-title">Area Details</div>
          <div className="area-details-list">
            {data.area_details?.length > 0 ? (
              data.area_details.slice(0, 6).map((area, i) => (
                <div key={i} className="area-detail-item">
                  <span>{area.name}</span>
                  <span className="area-badge">{area.value}</span>
                </div>
              ))
            ) : <NoData />}
          </div>
        </div>

        <div className="obs-col obs-card">
          <div className="obs-card-title">Top Operational Activities</div>
          <div style={{ width: '100%', height: 250 }}>
            {data.operational_activities?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.operational_activities}
                    cx="45%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.operational_activities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || ['#2dd4bf', '#94a3b8', '#facc15', '#f97316', '#4b5563'][index % 5]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="rect" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <NoData />}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="obs-row">
        <div className="obs-col flex-2 obs-card">
          <div className="obs-card-title">Observation Trends</div>
          <div style={{ width: '100%', height: 250 }}>
            {data.timeline?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    formatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()} / ${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3, fill: '#0ea5e9' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <NoData message="No trend data for this range" />}
          </div>
        </div>

        <div className="obs-col flex-2 obs-card">
          <div className="obs-card-title">Observations by Status</div>
          <div style={{ width: '100%', height: 250 }}>
            {data.status_distribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.status_distribution} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#0ea5e9" barSize={40} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <NoData message="No status data" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationChartsView;
