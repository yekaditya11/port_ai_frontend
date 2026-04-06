import React, { useState } from 'react';
import { 
  ChevronDown, Search, Settings, 
  Calendar, X, ChevronUp, ArrowUpDown
} from 'lucide-react';
import './ObservationLog.css';

const ObservationLog = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-01-05',
    to: '2026-04-05'
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const tableHeaders = [
    "CAMERA ID", "OBSERVATION ID", "RECORD DATE", 
    "OBSERVATION GROUP", "AREA", "CATEGORY", 
    "OPERATIONAL ACTIVITY", "STATUS", "POSTED DATE"
  ];

  return (
    <div className="obs-log-container">
      {/* Filters Section */}
      <div className="obs-log-filters-container">
        <div className="filter-row">
          <div className="log-filter-box">
            <label>Observation ID</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="log-filter-box">
            <label>Observation Group</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="log-filter-box">
            <label>Business Unit</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="log-filter-box">
            <label>Area</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          
          <div className="log-filter-box date-range-picker" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <label>Date Range</label>
            <div className="date-range-display">
              <span className="date-range-text">
                {formatDate(filterDates.from)} | {formatDate(filterDates.to)}
              </span>
              <div className="date-range-icons">
                <X size={14} className="clear-date" onClick={(e) => { e.stopPropagation(); setFilterDates({from: '', to: ''}); }} />
                <Calendar size={14} />
              </div>
            </div>
            {isDatePickerOpen && (
              <div className="date-picker-popover" onClick={(e) => e.stopPropagation()}>
                <div className="popover-row">
                  <label>From Date</label>
                  <input 
                    type="date" 
                    value={filterDates.from} 
                    onChange={(e) => setFilterDates({...filterDates, from: e.target.value})} 
                  />
                </div>
                <div className="popover-row">
                  <label>To Date</label>
                  <input 
                    type="date" 
                    value={filterDates.to} 
                    onChange={(e) => setFilterDates({...filterDates, to: e.target.value})} 
                  />
                </div>
                <button className="popover-close-btn" onClick={() => setIsDatePickerOpen(false)}>Apply</button>
              </div>
            )}
          </div>

          <div className="filter-actions-right">
            <div className="expand-toggle" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
              {isFiltersExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            <button className="obs-log-search-btn">SEARCH</button>
          </div>
        </div>

        {isFiltersExpanded && (
          <>
            <div className="filter-row mt-12">
              <div className="log-filter-box">
                <label>Camera ID</label>
                <div className="select-wrapper">
                  <select className="filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
              <div className="log-filter-box">
                <label>Category</label>
                <div className="select-wrapper">
                  <select className="filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
              <div className="log-filter-box">
                <label>Operational Activity</label>
                <div className="select-wrapper">
                  <select className="filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
              <div className="log-filter-box">
                <label>Status</label>
                <div className="select-wrapper">
                  <select className="filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
              <div className="filter-spacer"></div>
              <div className="clear-search-container">
                 <span className="clear-search-link">Clear Search</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* List Header */}
      <div className="obs-log-list-info">
        <span>Listing 0 - 0 Of 0</span>
        <div className="list-actions">
           <Search size={18} className="action-icon" />
           <Settings size={18} className="action-icon" />
        </div>
      </div>

      {/* Data Table */}
      <div className="obs-log-table-container">
        <table className="obs-log-table">
          <thead>
            <tr>
              {tableHeaders.map((header, idx) => (
                <th key={idx}>
                  <div className="header-content">
                    {header}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
              ))}
              <th className="check-col"><input type="checkbox" /></th>
              <th className="more-col"></th>
            </tr>
          </thead>
          <tbody>
            {/* No data rows */}
            <tr className="empty-row">
                <td colSpan={tableHeaders.length + 2} style={{ height: '100px', textAlign: 'center', color: '#94a3b8' }}>
                    No observation logs found
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObservationLog;
