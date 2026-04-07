import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, X, Loader2 } from 'lucide-react';
import ObservationChartsView from './ObservationChartsView';
import ObservationReportView from './ObservationReportView';
import { api } from '../../services/api';
import './ObservationDashboard.css';
import DateRangePicker from '../common/DateRangePicker';

const ObservationDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'report'
  const [isViewByOpen, setIsViewByOpen] = useState(false);
  const [viewBy, setViewBy] = useState('30 Days');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '',
    to: ''
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get dates from "View By" selection
  const getDatesFromSelection = (selection) => {
    const today = new Date();
    let fromDate = new Date();
    
    switch(selection) {
      case '30 Days': fromDate.setDate(today.getDate() - 30); break;
      case '60 Days': fromDate.setDate(today.getDate() - 60); break;
      case '90 Days': fromDate.setDate(today.getDate() - 90); break;
      case '180 Days': fromDate.setDate(today.getDate() - 180); break;
      case '1 Year': fromDate.setFullYear(today.getFullYear() - 1); break;
      case '3 Years': fromDate.setFullYear(today.getFullYear() - 3); break;
      default: return { from: '', to: '' };
    }
    
    return {
      from: fromDate.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      let params = {};
      if (filterDates.from && filterDates.to) {
        params = { from_date: filterDates.from, to_date: filterDates.to };
      } else if (viewBy !== 'Custom') {
        const { from, to } = getDatesFromSelection(viewBy);
        params = { from_date: from, to_date: to };
      }

      const data = await api.getObservationStats(params);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [viewBy, filterDates]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="observation-view">
      <div className="observation-toolbar">
        <div className="observation-toolbar-left">
          <h2 className="title-text">Observation</h2>
        </div>
        
        <div className="observation-toolbar-right">
          <div className="toggle-container">
            <span 
              className={`toggle-label ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              Dashboard
            </span>
            <div 
              className={`toggle-switch ${activeView === 'dashboard' ? 'dashboard-active' : 'report-active'}`}
              onClick={() => setActiveView(activeView === 'dashboard' ? 'report' : 'dashboard')}
            >
              <div className="switch-knob"></div>
            </div>
            <span 
              className={`toggle-label ${activeView === 'report' ? 'active' : ''}`}
              onClick={() => setActiveView('report')}
            >
              Report
            </span>
          </div>

          <div className="obs-filter-wrapper">
            <div className="obs-filter-btn" onClick={() => setIsViewByOpen(!isViewByOpen)}>
              <span className="obs-filter-label">View By</span>
              <span className="obs-filter-value">{viewBy} <ChevronDown size={14} /></span>
            </div>
            {isViewByOpen && (
              <div className="obs-dropdown-list">
                {['30 Days', '60 Days', '90 Days', '180 Days', '1 Year', '3 Years', 'Custom'].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="obs-dropdown-item" 
                    onClick={() => {
                      setViewBy(item);
                      setIsViewByOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="obs-filter-wrapper">
            <div className="obs-filter-btn date-filter" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
               <span className="obs-filter-label">Date Range</span>
               <div className="date-display-wrapper">
                 <span className="obs-filter-value">
                   {formatDate(filterDates.from)} | {formatDate(filterDates.to)}
                   <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                     <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                     <Calendar size={14} />
                   </div>
                 </span>
               </div>
               {isDatePickerOpen && (
                 <DateRangePicker 
                   startDate={filterDates.from ? new Date(filterDates.from) : null}
                   endDate={filterDates.to ? new Date(filterDates.to) : null}
                   onSelect={(start, end) => {
                     setFilterDates({
                       from: start ? start.toISOString().split('T')[0] : '',
                       to: end ? end.toISOString().split('T')[0] : ''
                     });
                   }}
                   onClose={() => setIsDatePickerOpen(false)}
                 />
               )}
            </div>
          </div>
        </div>
      </div>

      {loading && !stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <Loader2 className="obs-animate-spin" size={48} color="#0ea5e9" />
          <p style={{ color: '#64748b' }}>Calculating statistics...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>{error}</div>
      ) : activeView === 'dashboard' ? (
        <ObservationChartsView data={stats} />
      ) : (
        <ObservationReportView />
      )}
    </div>
  );
};

export default ObservationDashboard;
