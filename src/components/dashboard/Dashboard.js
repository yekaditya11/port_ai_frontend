import React, { useState, useEffect } from 'react';
import StatGrid from './StatGrid';
import IncidentTypeChart from './IncidentTypeChart';
import WorkAreaList from './WorkAreaList';
import OverviewTable from './OverviewTable';
import AccidentsChart from './AccidentsChart';
import StatusChart from './StatusChart';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days] = useState(30);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.getDashboardStats(days);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Fetch Stats Error:', err);
        setError('Failed to load dashboard statistics. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  if (loading && !stats) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <Loader2 className="animate-spin" size={48} color="#22d3ee" />
        <p style={{ color: '#64748b', fontSize: '18px' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '8px 24px', backgroundColor: '#22d3ee', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <h2 className="title-text">Incident Management</h2>
        </div>
        
        <div className="toolbar-right">
          <div className="toggle-container">
            <span className="toggle-label dashboard-label">Dashboard</span>
            <div className="toggle-switch">
              <div className="switch-knob"></div>
            </div>
            <span className="toggle-label report-label">Report</span>
          </div>

          <div className="filter-group">
            <div className="select-btn">
              <span className="filter-label">View By</span>
              <span className="filter-value">{days} Days</span>
              <ChevronDown size={14} className="filter-chevron" />
            </div>
          </div>

          <div className="date-picker-btn">
             <div className="date-label">Date Range</div>
             <div className="date-value">
               <span>7 Mar | 5 Apr</span>
               <Calendar size={14} className="calendar-icon" />
             </div>
          </div>
        </div>
      </div>

      <StatGrid data={stats?.stat_cards} />

      <div className="dashboard-row top-row">
        <div className="col-4">
          <IncidentTypeChart data={stats?.by_incident_type} />
        </div>
        <div className="col-4">
          <WorkAreaList data={stats?.by_work_area} />
        </div>
        <div className="col-4">
          <OverviewTable data={stats?.overview_table} />
        </div>
      </div>

      <div className="dashboard-row bottom-row">
        <div className="col-6">
          <AccidentsChart data={stats?.accidents_timeline} />
        </div>
        <div className="col-6">
          <StatusChart data={stats?.by_status} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

