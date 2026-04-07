import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Settings, 
  MoreVertical, X, Calendar
} from 'lucide-react';
import './ObservationRCA.css';
import DateRangePicker from '../common/DateRangePicker';

const ObservationRCA = () => {
  const initialData = [
    {
      eventId: "OBR/0326/3906",
      group: "Assets",
      activity: "Berthing/Unberthing",
      status: "New",
      rcaId: null,
      processType: null,
      actions: 0,
      rootCause: null,
      eventType: "Unsafe Act",
      subArea: "--",
      riskCat: "Inappropriate PPE"
    },
    {
      eventId: "OBR/0326/3905",
      group: "Assets",
      activity: "Driving",
      status: "Inspection",
      rcaId: "RCA/03/26/0492",
      processType: "Manual",
      actions: 3,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Slip / Trip / Fall Same Level"
    },
    {
      eventId: "OBR/0326/3904",
      group: "Assets",
      activity: "Container Yard Operations",
      status: "Review",
      rcaId: "RCA/03/26/0490",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Floors and Roads"
    },
    {
      eventId: "OBR/0326/3903",
      group: "Assets",
      activity: "Container Yard Operations",
      status: "Review",
      rcaId: "RCA/03/26/0489",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Act",
      subArea: "C-YARD",
      riskCat: "Operational Errors"
    },
    {
      eventId: "OBR/0326/3902",
      group: "Assets",
      activity: "Container Yard Operations",
      status: "New",
      rcaId: "RCA/03/26/0488",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Condition",
      subArea: "Berth No. 05",
      riskCat: "Floors and Roads"
    },
    {
      eventId: "OBR/0326/3901",
      group: "Assets",
      activity: "Container Yard Operations",
      status: "Review",
      rcaId: "RCA/03/26/0487",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Slip / Trip / Fall"
    },
    {
      eventId: "OBR/0326/3900",
      group: "Assets",
      activity: "Container Yard Operations",
      status: "Review",
      rcaId: "RCA/03/26/0486",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadequate maintenanc...",
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Operational Errors"
    },
    {
      eventId: "OBR/0326/3899",
      group: "Assets",
      activity: "Driving",
      status: "Review",
      rcaId: "RCA/03/26/0485",
      processType: "Manual",
      actions: 2,
      rootCause: "Inadeqate maintenance",
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Floors and Roads"
    },
    {
      eventId: "OBR/0326/3898",
      group: "Fire and Explosion Safety",
      activity: "Others",
      status: "Inspection",
      rcaId: null,
      processType: "Manual",
      actions: 0,
      rootCause: null,
      eventType: "Unsafe Condition",
      subArea: "--",
      riskCat: "Vehicle Movement"
    },
    {
      eventId: "OBR/0326/3897",
      group: "Operations",
      activity: "Driving",
      status: "New",
      rcaId: "RCA/03/26/0483",
      processType: "Manual",
      actions: 1,
      rootCause: "Improper attitude",
      eventType: "Unsafe Act",
      subArea: "--",
      riskCat: "Unauthorized Access"
    }
  ];

  const [listData, setListData] = useState(initialData);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    dateRange: '90 Days',
    sortOrder: 'Date Descending'
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-01-05',
    to: '2026-04-05'
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const handleLoadMore = () => {
    setListData([...listData, ...initialData]);
    setHasLoadedMore(true);
  };

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="obs-rca-container">
      <div className="obs-rca-header">
        <div style={{ fontSize: '13px', color: '#64748b' }}>Home &gt; Observation &gt; Root Cause Analysis</div>
        <h2 className="obs-rca-title">Root Cause Analysis</h2>
      </div>

      <div className="obs-rca-filter-grid">
        <div className="obs-rca-filter-row">
          <div className="obs-rca-filter-box" style={{ background: '#f1f5f9' }}>
            <span className="obs-rca-filter-label" style={{ color: '#94a3b8' }}>Module</span>
            <select className="obs-rca-filter-val" disabled style={{ color: '#94a3b8' }}>
              <option>Observation</option>
            </select>
            <ChevronDown size={14} className="obs-rca-filter-arrow" style={{ color: '#cbd5e1' }} />
          </div>
          <div className="obs-rca-filter-box">
            <span className="obs-rca-filter-label">Event ID</span>
            <select className="obs-rca-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-rca-filter-arrow" />
          </div>
          <div className="obs-rca-filter-box">
            <span className="obs-rca-filter-label">Event Type</span>
            <select className="obs-rca-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-rca-filter-arrow" />
          </div>
          <div className="obs-rca-filter-box">
            <span className="obs-rca-filter-label">Event Group</span>
            <select className="obs-rca-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-rca-filter-arrow" />
          </div>
          <div className="obs-rca-filter-box">
            <span className="obs-rca-filter-label">RCA Status</span>
            <select className="obs-rca-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-rca-filter-arrow" />
          </div>
          <div className="obs-rca-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <span className="obs-rca-filter-label">Date Range</span>
            <div className="obs-rca-filter-val">
              <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
              <div style={{ display: 'flex', gap: '8px', color: '#94a3b8' }}>
                <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                <Calendar size={14} />
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
          <div className="obs-rca-filter-actions">
            <div className="obs-rca-search-row">
              <button className="obs-rca-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-rca-btn-search">SEARCH</button>
            </div>
            {isExpanded && <span className="obs-rca-clear-link">Clear Search</span>}
          </div>
        </div>

        {isExpanded && (
          <div className="obs-rca-filter-row">
            <div className="obs-rca-filter-box">
              <span className="obs-rca-filter-label">Work Area</span>
              <select className="obs-rca-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-rca-filter-arrow" />
            </div>
            <div className="obs-rca-filter-box">
              <span className="obs-rca-filter-label">Sub Area</span>
              <select className="obs-rca-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-rca-filter-arrow" />
            </div>
            <div className="obs-rca-filter-box">
              <span className="obs-rca-filter-label">Operational Activity</span>
              <select className="obs-rca-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-rca-filter-arrow" />
            </div>
            <div className="obs-rca-filter-box">
              <span className="obs-rca-filter-label">Risk Category</span>
              <select className="obs-rca-filter-val"><option>All</option></select>
              <ChevronDown size={14} className="obs-rca-filter-arrow" />
            </div>
            <div style={{ flex: 2.2 }}></div>
          </div>
        )}
      </div>

      <div className="obs-rca-list-controls">
        <span className="obs-rca-list-count">Listing 1 - 10 Of 132</span>
        <div className="obs-rca-list-icons">
          <Search size={16} />
          <div className="obs-rca-toggle-switch">
             <div className="obs-rca-toggle-circle"></div>
             <span className="obs-rca-toggle-label">OFF</span>
          </div>
          <Settings size={16} onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div className="obs-rca-table-wrapper">
        <table className="obs-rca-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Event Group</th>
              <th>Operation Activity</th>
              <th>Status</th>
              <th>RCA ID</th>
              <th>Process Type</th>
              <th>Actions</th>
              <th>Root Cause</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {listData.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr className={expandedRowId === row.eventId ? 'expanded' : ''}>
                  <td className="link">{row.eventId}</td>
                  <td>{row.group}</td>
                  <td>{row.activity}</td>
                  <td>{row.status}</td>
                  <td className={row.rcaId ? 'link' : ''}>{row.rcaId || ''}</td>
                  <td>{row.processType || ''}</td>
                  <td>{row.actions}</td>
                  <td title={row.rootCause}>{row.rootCause ? (row.rootCause.length > 20 ? row.rootCause.substring(0, 20) + "..." : row.rootCause) : ''}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                       {expandedRowId === row.eventId ? (
                         <ChevronUp size={16} className="obs-rca-icon-btn" onClick={() => toggleRow(row.eventId)} style={{ cursor: 'pointer' }} />
                       ) : (
                         <ChevronDown size={16} className="obs-rca-icon-btn" onClick={() => toggleRow(row.eventId)} style={{ cursor: 'pointer' }} />
                       )}
                       <MoreVertical size={16} style={{ color: '#94a3b8' }} />
                    </div>
                  </td>
                </tr>
                {expandedRowId === row.eventId && (
                  <tr className="obs-rca-expanded-row">
                    <td colSpan="9">
                      <div className="obs-rca-details-panel">
                        <div className="obs-rca-details-col">
                           <div className="obs-rca-detail-item">
                              <span className="obs-rca-detail-label">Module</span>
                              <span className="obs-rca-detail-val">Observation</span>
                           </div>
                           <div className="obs-rca-detail-item">
                              <span className="obs-rca-detail-label">Event Type</span>
                              <span className="obs-rca-detail-val">{row.eventType}</span>
                           </div>
                           <div className="obs-rca-detail-item">
                              <span className="obs-rca-detail-label">Event Date & Time</span>
                              <span className="obs-rca-detail-val">25 Mar 26 | 18:04</span>
                           </div>
                        </div>
                        <div className="obs-rca-details-col">
                           <div className="obs-rca-detail-item">
                              <span className="obs-rca-detail-label">Sub Area</span>
                              <span className="obs-rca-detail-val">{row.subArea}</span>
                           </div>
                           <div className="obs-rca-detail-item">
                              <span className="obs-rca-detail-label">Risk Category</span>
                              <span className="obs-rca-detail-val">{row.riskCat}</span>
                           </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {!hasLoadedMore && (
        <button className="obs-rca-load-more" onClick={handleLoadMore}>LOAD MORE</button>
      )}

      {/* Settings Sidebar */}
      {isSettingsOpen && (
        <>
          <div className="obs-rca-sidebar-backdrop" onClick={() => setIsSettingsOpen(false)} />
          <div className="obs-rca-settings-sidebar">
            <div className="obs-rca-sidebar-header">
               <h3 className="obs-rca-sidebar-title">Settings</h3>
            </div>
            
            <div className="obs-rca-sidebar-content">
               <div className="obs-rca-sidebar-section">
                  <h4 className="obs-rca-sidebar-section-title">Date Range</h4>
                  <div className="obs-rca-radio-group">
                    {['90 Days', '60 Days', '30 Days'].map(range => (
                      <div key={range} className="obs-rca-radio-item" onClick={() => setSettings({...settings, dateRange: range})}>
                        <div className={`obs-rca-radio-circle ${settings.dateRange === range ? 'checked' : ''}`}>
                          <div className="obs-rca-radio-inner" />
                        </div>
                        <span className="obs-rca-radio-label">{range}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="obs-rca-sidebar-section">
                  <h4 className="obs-rca-sidebar-section-title">Sort Order</h4>
                  <div className="obs-rca-radio-group">
                    {['Date Ascending', 'Date Descending'].map(order => (
                      <div key={order} className="obs-rca-radio-item" onClick={() => setSettings({...settings, sortOrder: order})}>
                        <div className={`obs-rca-radio-circle ${settings.sortOrder === order ? 'checked' : ''}`}>
                          <div className="obs-rca-radio-inner" />
                        </div>
                        <span className="obs-rca-radio-label">{order}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="obs-rca-sidebar-footer">
               <button className="obs-rca-btn-cancel" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
               <button className="obs-rca-btn-save" onClick={() => setIsSettingsOpen(false)}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ObservationRCA;
