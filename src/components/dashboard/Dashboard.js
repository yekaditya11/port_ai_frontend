import React, { useState, useEffect, useRef } from 'react';
import StatGrid from './StatGrid';
import IncidentTypeChart from './IncidentTypeChart';
import WorkAreaList from './WorkAreaList';
import OverviewTable from './OverviewTable';
import AccidentsChart from './AccidentsChart';
import StatusChart from './StatusChart';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import Loader from '../common/Loader';
import DateRangePicker from '../common/DateRangePicker';
import { api } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.getDashboardStats(
          days, 
          startDate?.toISOString(), 
          endDate?.toISOString()
        );
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
  }, [days, startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setDays(null); // Reset predefined days when custom range is used
    }
  };

  const formatDate = (date) => {
     if (!date) return '';
     return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <Loader size={48} />
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
          style={{ padding: '8px 24px', backgroundColor: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-view professional-theme">
      <div className="dashboard-header-modern">
        <div className="header-title-section">
          <h1 className="main-title">Incident Dashboard</h1>
          <p className="subtitle">Real-time safety performance metrics and analytics</p>
        </div>
        
        <div className="header-actions">
          <div className="filter-controls-group">
            <div className="view-by-selector" onClick={() => setShowDaysDropdown(!showDaysDropdown)}>
              <span className="control-label">Time Period</span>
              <div className="control-value">
                <span>{days ? `${days} Days` : 'Custom Range'}</span>
                <ChevronDown size={14} className={`chevron ${showDaysDropdown ? 'up' : ''}`} />
              </div>
              {showDaysDropdown && (
                <div className="days-dropdown-menu">
                  {[7, 30, 90, 180].map(d => (
                    <div 
                      key={d} 
                      className={`dropdown-item ${days === d ? 'active' : ''}`}
                      onClick={() => {
                        setDays(d);
                        setStartDate(null);
                        setEndDate(null);
                        setShowDaysDropdown(false);
                      }}
                    >
                      Last {d} Days
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="date-range-selector" onClick={() => setShowDatePicker(true)} ref={datePickerRef}>
              <span className="control-label">Date Range</span>
              <div className="control-value">
                <span>{startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Select Dates'}</span>
                <Calendar size={14} className="calendar-icon" />
              </div>
              
              {showDatePicker && (
                <div className="dashboard-datepicker-popover">
                  <DateRangePicker 
                    startDate={startDate}
                    endDate={endDate}
                    onSelect={handleDateSelect}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>

            <button className="export-btn-minimal">
              <Filter size={16} />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>
      </div>

      <StatGrid data={stats?.stat_cards} />

      <div className="dashboard-main-grid">
        <div className="grid-row top-row">
          <div className="chart-container-card incident-types">
            <IncidentTypeChart data={stats?.by_incident_type} />
          </div>
          <div className="list-container-card work-areas">
            <WorkAreaList data={stats?.by_work_area} />
          </div>
          <div className="table-container-card overview">
            <OverviewTable data={stats?.overview_table} />
          </div>
        </div>

        <div className="grid-row bottom-row">
          <div className="chart-container-card timeline">
            <AccidentsChart data={stats?.accidents_timeline} />
          </div>
          <div className="chart-container-card status">
            <StatusChart data={stats?.by_status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

