import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Settings, 
  X, Calendar
} from 'lucide-react';
import './ObservationAction.css';
import '../common/DateRangePicker.css';

const ObservationAction = () => {
  const initialData = [
    {
      actionId: "ACT/0326/3321",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Conduct periodic workplace safety inspections",
      module: "Observation",
      observationId: "OBR/0326/3905",
      capa: "Preventive",
      hierarchy: "Administrative Controls",
      priority: "High",
      assignedTo: "Veysi Gülsen(134)",
      department: "HSE Operations Management",
      dueDate: "2 Apr 26",
      status: "Overdue",
      group: "Assets"
    },
    {
      actionId: "ACT/0326/3320",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Install protective barriers around hazardous zones",
      module: "Observation",
      observationId: "OBR/0326/3905",
      capa: "Corrective",
      hierarchy: "Engineering Controls",
      priority: "Medium",
      assignedTo: "Veysi Gülsen(134)",
      department: "HSE Operations Management",
      dueDate: "30 Mar 26",
      status: "Overdue",
      group: "Operations"
    },
    {
      actionId: "ACT/0326/3312",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Conduct periodic workplace safety inspections",
      module: "Observation",
      observationId: "OBR/0326/3904",
      capa: "Preventive",
      hierarchy: "Administrative Controls",
      priority: "High",
      assignedTo: "Nagesh N(99991)",
      department: "Administration",
      dueDate: "28 Mar 26",
      status: "Overdue",
      group: "Operations"
    },
    {
      actionId: "ACT/0326/3311",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Install protective barriers around hazardous zones",
      module: "Observation",
      observationId: "OBR/0326/3904",
      capa: "Corrective",
      hierarchy: "Engineering Controls",
      priority: "Medium",
      assignedTo: "Ali Aladag(952)",
      department: "HSE Operations Management",
      dueDate: "28 Mar 26",
      status: "Overdue",
      group: "Operations"
    },
    {
      actionId: "ACT/0326/3308",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Conduct periodic workplace safety inspections",
      module: "Observation",
      observationId: "OBR/0326/3903",
      capa: "Preventive",
      hierarchy: "Administrative Controls",
      priority: "High",
      assignedTo: "Tilak Ghetiya()",
      department: "Administration",
      dueDate: "28 Mar 26",
      status: "Overdue",
      group: "Unsafe Act"
    },
    {
      actionId: "ACT/0326/3307",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Install protective barriers around hazardous zones",
      module: "Observation",
      observationId: "OBR/0326/3903",
      capa: "Corrective",
      hierarchy: "Administrative Controls",
      priority: "Medium",
      assignedTo: "Ali Alabdouli(1597)",
      department: "HSE Operations Management",
      dueDate: "28 Mar 26",
      status: "Overdue",
      group: "Unsafe Act"
    },
    {
      actionId: "ACT/0326/3302",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Conduct periodic workplace safety inspections",
      module: "Observation",
      observationId: "OBR/0326/3901",
      capa: "Preventive",
      hierarchy: "Administrative Controls",
      priority: "High",
      assignedTo: "Selman Yeiken(386)",
      department: "HSE Operations Management",
      dueDate: "30 Mar 26",
      status: "Overdue",
      group: "Fire and Explosion Safety"
    },
    {
      actionId: "ACT/0326/3301",
      createdBy: "Martin Debeloz(104)",
      createdOn: "26 Mar 26",
      description: "Install protective barriers around hazardous zones",
      module: "Observation",
      observationId: "OBR/0326/3901",
      capa: "Corrective",
      hierarchy: "Engineering Controls",
      priority: "Medium",
      assignedTo: "Merve Çancı(3617)",
      department: "HSE Operations Management",
      dueDate: "28 Mar 26",
      status: "Overdue",
      group: "Fire and Explosion Safety"
    }
  ];

  const [listData, setListData] = useState(initialData);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-01-06',
    to: '2026-04-05'
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const handleLoadMore = () => {
    setListData([...listData, ...initialData]); // Just double the mock data
    setHasLoadedMore(true);
  };

  return (
    <div className="obs-action-container">
      <div className="obs-action-header">
        <h2 className="obs-action-title">Action</h2>
      </div>

      <div className="obs-action-filter-grid">
        <div className="obs-action-filter-row">
          <div className="obs-action-filter-box">
            <span className="obs-action-filter-label">Action ID</span>
            <select className="obs-action-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-action-filter-arrow" />
          </div>
          <div className="obs-action-filter-box">
            <span className="obs-action-filter-label">Source ID</span>
            <select className="obs-action-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-action-filter-arrow" />
          </div>
          <div className="obs-action-filter-box">
            <span className="obs-action-filter-label">Status</span>
            <select className="obs-action-filter-val"><option>Select</option></select>
            <ChevronDown size={14} className="obs-action-filter-arrow" />
          </div>
          <div className="obs-action-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <span className="obs-action-filter-label">Date Range</span>
            <div className="obs-action-filter-val">
               <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
               <div style={{ display: 'flex', gap: '8px', color: '#94a3b8' }}>
                 <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                 <Calendar size={14} />
               </div>
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
          <div className="obs-action-filter-actions">
            <div className="obs-action-search-row">
              <button className="obs-action-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                 {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-action-btn-search">SEARCH</button>
            </div>
            {isExpanded && <span className="obs-action-clear-link">Clear Search</span>}
          </div>
        </div>

        {isExpanded && (
          <div className="obs-action-filter-row">
            <div className="obs-action-filter-box">
              <span className="obs-action-filter-label">Priority</span>
              <select className="obs-action-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-action-filter-arrow" />
            </div>
            <div className="obs-action-filter-box">
              <span className="obs-action-filter-label">Hierarchy of Control</span>
              <select className="obs-action-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-action-filter-arrow" />
            </div>
            <div className="obs-action-filter-box">
              <span className="obs-action-filter-label">Business Unit</span>
              <select className="obs-action-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-action-filter-arrow" />
            </div>
            <div className="obs-action-filter-box">
              <span className="obs-action-filter-label">Department</span>
              <select className="obs-action-filter-val"><option>Select</option></select>
              <ChevronDown size={14} className="obs-action-filter-arrow" />
            </div>
            <div className="obs-action-filter-box" style={{ background: '#f1f5f9' }}>
              <span className="obs-action-filter-label" style={{ color: '#94a3b8' }}>Module</span>
              <select className="obs-action-filter-val" disabled style={{ color: '#94a3b8' }}>
                 <option>Observation</option>
              </select>
              <ChevronDown size={14} className="obs-action-filter-arrow" style={{ color: '#cbd5e1' }} />
            </div>
            <div style={{ flex: 1.1 }}></div>
          </div>
        )}
      </div>

      <div className="obs-action-list-controls">
        <span className="obs-action-list-count">Listing 1 - 10 Of 123</span>
        <div className="obs-action-list-icons"><Search size={16} /><Settings size={16} /></div>
      </div>

      <div className="obs-action-table-wrapper">
        <table className="obs-action-table">
          <thead>
            <tr>
              <th>Action ID</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Description</th>
              <th>Module</th>
              <th>Observation ID</th>
              <th>CAPA</th>
              <th>Hierarchy of Control</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Department</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {listData.map((row, idx) => (
              <tr key={idx}>
                <td className="link">{row.actionId}</td>
                <td>{row.createdBy}</td>
                <td>{row.createdOn}</td>
                <td style={{ minWidth: '250px' }}>{row.description}</td>
                <td>{row.module}</td>
                <td className="link">{row.observationId}</td>
                <td>{row.capa}</td>
                <td>{row.hierarchy}</td>
                <td>{row.priority}</td>
                <td>{row.assignedTo}</td>
                <td>{row.department}</td>
                <td>{row.dueDate}</td>
                <td style={{ color: row.status === 'Overdue' ? '#ef4444' : 'inherit', fontWeight: '700' }}>{row.status}</td>
                <td>{row.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hasLoadedMore && (
        <button className="obs-action-load-more" onClick={handleLoadMore}>LOAD MORE</button>
      )}
    </div>
  );
};

export default ObservationAction;
