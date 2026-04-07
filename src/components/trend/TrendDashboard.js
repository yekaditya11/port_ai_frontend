import React, { useState, useEffect } from 'react';
import StatGridTrend from './StatGridTrend';
import SeverityChart from './SeverityChart';
import RootCauseChart from './RootCauseChart';
import EquipmentDamageList from './EquipmentDamageList';
import IncidentTrendChart from './IncidentTrendChart';
import Top5IncidentsList from './Top5IncidentsList';
import { Calendar, ChevronDown } from 'lucide-react';
import Loader from '../common/Loader';
import { api } from '../../services/api';
import './TrendDashboard.css';

const TrendDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days] = useState(90);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const trendData = await api.getTrendStats(days);
        setData(trendData);
        setError(null);
      } catch (err) {
        console.error('Trend Fetch Error:', err);
        setError('Failed to load trend analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <Loader size={48} />
        <p style={{ color: '#64748b', fontSize: '18px' }}>Loading trend analytics...</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error" style={{ textAlign: 'center', padding: '100px 0', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div className="dashboard-view trend-view">
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <h2 className="title-text">Trend</h2>
        </div>
        
        <div className="toolbar-right">
          <div className="toggle-container">
            <span className="toggle-label dashboard-label">Dashboard</span>
            <div className="toggle-switch">
              <div className="switch-knob active"></div>
            </div>
            <span className="toggle-label report-label">Report</span>
          </div>

          <div className="filter-group">
            <div className="select-btn">
              <span className="filter-label">View By</span>
              <span className="filter-value">90 Days</span>
              <ChevronDown size={14} className="filter-chevron" />
            </div>
          </div>

          <div className="date-picker-btn">
             <div className="date-label">Date Range</div>
             <div className="date-value">
               <span>Last 90 Days</span>
               <Calendar size={14} className="calendar-icon" />
             </div>
          </div>
        </div>
      </div>

      <StatGridTrend stats={data.stats} />

      <div className="trend-grid">
        <div className="trend-item severity-box">
          <SeverityChart data={data.severity_data} />
        </div>
        <div className="trend-item rootcause-box">
          <RootCauseChart data={data.root_cause_data} />
        </div>
        <div className="trend-item equipment-box">
          <EquipmentDamageList />
        </div>
        <div className="trend-item trendchart-box">
          <IncidentTrendChart data={data.trend_data} />
        </div>
        <div className="trend-item top5-box">
          <Top5IncidentsList data={data.top_incidents} />
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;
