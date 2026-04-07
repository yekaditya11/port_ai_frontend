import React, { useState } from 'react';
import { 
  ChevronDown, Search, Settings, 
  Calendar, Clock,
  ChevronUp, X
} from 'lucide-react';
import './ObservationWorkflow.css';
import DateRangePicker from '../common/DateRangePicker';

const ObservationWorkflow = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-06-01',
    to: '2026-04-05'
  });

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };
  const [workflowData] = useState([
    {
      id: "OBR/0326/3906",
      group: "Assets",
      recorded: "31 Mar 26",
      review: { status: "pending", date: null },
      inspection: { status: "none", date: null },
      action: { status: "none", date: null },
      closed: { status: "none", date: null },
      rejected: { status: "none", date: null },
      tat: "05:02:23"
    },
    {
      id: "OBR/0326/3905",
      group: "Assets",
      recorded: "26 Mar 26",
      review: { status: "completed", date: "26 Mar 26" },
      inspection: { status: "completed", date: "27 Mar 26" },
      action: { status: "completed", date: "2 Apr 26" },
      closed: { status: "completed", date: null },
      rejected: { status: "none", date: null },
      tat: "10:00:35"
    },
    {
      id: "OBR/0326/3904",
      group: "Assets",
      recorded: "26 Mar 26",
      review: { status: "completed", date: "26 Mar 26" },
      inspection: { status: "none", date: null },
      action: { status: "completed", date: "2 Apr 26" },
      closed: { status: "completed", date: null },
      rejected: { status: "none", date: null },
      tat: "10:01:56"
    },
    {
      id: "OBR/0326/3903",
      group: "Assets",
      recorded: "26 Mar 26",
      review: { status: "completed", date: "26 Mar 26" },
      inspection: { status: "none", date: null },
      action: { status: "completed", date: "29 Mar 26" },
      closed: { status: "completed", date: null },
      rejected: { status: "none", date: null },
      tat: "10:02:00"
    },
    {
      id: "OBR/0326/3902",
      group: "Assets",
      recorded: "26 Mar 26",
      review: { status: "pending", date: null },
      inspection: { status: "none", date: null },
      action: { status: "none", date: null },
      closed: { status: "none", date: null },
      rejected: { status: "none", date: null },
      tat: "10:02:01"
    }
  ]);

  const renderStatus = (statusObj) => {
    if (statusObj.status === "pending") {
      return (
        <div className="status-cell pending">
          <Clock size={16} className="status-icon orange" />
        </div>
      );
    }
    if (statusObj.status === "completed") {
      return (
        <div className="status-cell completed">
          {statusObj.date && <span className="status-date">{statusObj.date}</span>}
          <Clock size={16} className="status-icon blue" />
        </div>
      );
    }
    return <div className="status-cell none"></div>;
  };

  return (
    <div className="obs-workflow-container">
      {/* Filters Filter bar */}
      <div className="obs-workflow-filters-container">
        <div className="obs-workflow-filters-main">
          <div className="filter-row">
            <div className="workflow-filter-box">
              <label>Group</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="workflow-filter-box">
              <label>Area</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="workflow-filter-box">
              <label>Status</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="workflow-filter-box date-box" style={{ position: 'relative' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
              <label>Date Range</label>
              <div className="date-display-wrapper">
                <span className="date-text">
                  {filterDates.from ? formatDateDisplay(filterDates.from) : '...'} | {filterDates.to ? formatDateDisplay(filterDates.to) : '...'}
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                   <X size={14} className="input-icon" onClick={(e) => { e.stopPropagation(); setFilterDates({from: '', to: ''}); }} />
                   <Calendar size={14} className="input-icon" />
                </div>
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
            <div className="filter-actions-right">
                <div className="expand-toggle" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
                    {isFiltersExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                <button className="obs-workflow-search-btn">SEARCH</button>
            </div>
          </div>

          {isFiltersExpanded && (
            <>
              <div className="filter-row mt-12">
                <div className="workflow-filter-box">
                  <label>Business Unit</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="workflow-filter-box">
                  <label>Observation Type</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="workflow-filter-box">
                  <label>Operational Activity</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="workflow-filter-box">
                  <label>Observer</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="workflow-filter-box">
                  <label>Category</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
              </div>
              <div className="filter-row mt-12">
                <div className="workflow-filter-box">
                  <label>Source</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="workflow-filter-box">
                  <label>Pending For</label>
                  <div className="select-wrapper">
                    <select className="filter-select"><option>Select</option></select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>
                <div className="filter-spacer"></div>
                <div className="filter-spacer"></div>
                <div className="filter-spacer"></div>
                <div className="clear-search-link">Clear Search</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* List Header */}
      <div className="obs-workflow-list-info">
        <span>Listing 1 - {workflowData.length} Of 132</span>
        <div className="list-actions">
           <Search size={18} className="action-icon" />
           <Settings size={18} className="action-icon" />
        </div>
      </div>

      {/* Workflow Table */}
      <div className="obs-workflow-table-container">
        <table className="obs-workflow-table">
          <thead>
            <tr>
              <th>OBSERVATION ID</th>
              <th>OBSERVATION GROUP</th>
              <th>RECORDED</th>
              <th>REVIEW</th>
              <th>INSPECTION</th>
              <th>ACTION</th>
              <th>CLOSED</th>
              <th>REJECTED</th>
              <th>TAT</th>
            </tr>
          </thead>
          <tbody>
            {workflowData.map((row, index) => (
              <tr key={index}>
                <td className="id-cell">{row.id}</td>
                <td>{row.group}</td>
                <td className="recorded-cell">{row.recorded}</td>
                <td>{renderStatus(row.review)}</td>
                <td>{renderStatus(row.inspection)}</td>
                <td>{renderStatus(row.action)}</td>
                <td>{renderStatus(row.closed)}</td>
                <td>{renderStatus(row.rejected)}</td>
                <td className="tat-cell">
                   <Clock size={14} className="tat-icon" />
                   <span>{row.tat}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="obs-workflow-footer">
        <button className="load-more-btn">LOAD MORE</button>
      </div>
    </div>
  );
};

export default ObservationWorkflow;
