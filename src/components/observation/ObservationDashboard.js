import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import ObservationChartsView from './ObservationChartsView';
import ObservationReportView from './ObservationReportView';
import './ObservationDashboard.css';
import '../common/DateRangePicker.css';

const ObservationDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'report'
  const [isViewByOpen, setIsViewByOpen] = useState(false);
  const [viewBy, setViewBy] = useState('30 Days');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-03-07',
    to: '2026-04-05'
  });

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
                 <div className="date-range-popover" onClick={(e) => e.stopPropagation()}>
                   <div className="date-range-popover-row">
                     <span className="date-range-label">From Date</span>
                     <input 
                       type="date" 
                       className="date-range-input" 
                       value={filterDates.from}
                       onChange={(e) => setFilterDates({ ...filterDates, from: e.target.value })}
                     />
                   </div>
                   <div className="date-range-popover-row">
                     <span className="date-range-label">To Date</span>
                     <input 
                       type="date" 
                       className="date-range-input" 
                       value={filterDates.to}
                       onChange={(e) => setFilterDates({ ...filterDates, to: e.target.value })}
                     />
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {activeView === 'dashboard' ? (
        <ObservationChartsView />
      ) : (
        <ObservationReportView />
      )}
    </div>
  );
};

export default ObservationDashboard;
