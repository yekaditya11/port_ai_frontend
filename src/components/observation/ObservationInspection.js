import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Calendar, Search, Settings, 
  MapPin, Clock, MoreVertical, Monitor, X
} from 'lucide-react';
import './ObservationInspection.css';
import '../common/DateRangePicker.css';

const ObservationInspection = () => {
  const navigate = useNavigate();
  
  const initialData = [
    {
      id: "OBR/0326/3831",
      titleType: "Unsafe Condition",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "19:24:12",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Defective tools or equipment",
      subCategory: "--",
      status: "Review",
      timer: "22:20:43"
    },
    {
      id: "OBR/0326/3831",
      titleType: "Unsafe Condition",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "19:24:12",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Defective tools or equipment",
      subCategory: "--",
      status: "Review",
      timer: "22:20:43"
    },
    {
      id: "OBR/0326/3830",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "18:35:47",
      locationName: "CFS Yard",
      locationSub: "North Storage Area",
      category: "Not wearing PPE",
      subCategory: "Fall From Height",
      status: "Review",
      timer: "22:21:32"
    },
    {
      id: "OBR/0326/3830",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "18:35:47",
      locationName: "CFS Yard",
      locationSub: "North Storage Area",
      category: "Not wearing PPE",
      subCategory: "Fall From Height",
      status: "Review",
      timer: "22:21:32"
    },
    {
      id: "OBR/0326/3830",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "18:35:47",
      locationName: "CFS Yard",
      locationSub: "North Storage Area",
      category: "Not wearing PPE",
      subCategory: "Fall From Height",
      status: "Review",
      timer: "22:21:32"
    }
  ];

  const newData = [
    {
      id: "OBR/0326/3826",
      titleType: "Unsafe Condition",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "13 Mar 26", time1: "10:37:56",
      locationName: "Gate",
      locationSub: "B GATE",
      category: "Slippery floor / spill",
      subCategory: "--",
      status: "Review",
      timer: "23:05:30"
    },
    {
      id: "OBR/0326/3836",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "16 Mar 26", time1: "14:16:04",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Unsafe lifting practices",
      subCategory: "--",
      status: "Review",
      timer: "20:01:54"
    },
    {
      id: "OBR/0326/3836",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "16 Mar 26", time1: "14:16:04",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Unsafe lifting practices",
      subCategory: "--",
      status: "Review",
      timer: "20:01:54"
    },
    {
      id: "OBR/0326/3836",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "16 Mar 26", time1: "14:16:04",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Unsafe lifting practices",
      subCategory: "--",
      status: "Review",
      timer: "20:01:54"
    },
    {
      id: "OBR/0326/3836",
      titleType: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "16 Mar 26", time1: "14:16:04",
      locationName: "Bilge Facility",
      locationSub: "--",
      category: "Unsafe lifting practices",
      subCategory: "--",
      status: "Review",
      timer: "20:01:54"
    }
  ];

  const [listData, setListData] = useState(initialData);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    setListData([...listData, ...newData]);
    setHasLoadedMore(true);
  };


  return (
    <div className="obs-insp-container">
      <div className="obs-insp-header">
        <h2 className="obs-insp-title">Inspection</h2>
      </div>

      {/* Filter Bar */}
      <div className="obs-insp-filter-grid">
        <div className="obs-insp-filter-row">
          <div className="obs-insp-filter-box">
            <span className="obs-insp-filter-box-label">Observation Group</span>
            <select className="obs-insp-filter-box-val">
              <option>Select</option>
            </select>
            <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
          </div>
          <div className="obs-insp-filter-box">
            <span className="obs-insp-filter-box-label">Area</span>
            <select className="obs-insp-filter-box-val">
              <option>Select</option>
            </select>
            <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
          </div>
          <div className="obs-insp-filter-box">
            <span className="obs-insp-filter-box-label">Business Unit</span>
            <select className="obs-insp-filter-box-val">
              <option>Select</option>
            </select>
            <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
          </div>
          <div className="obs-insp-filter-box">
            <span className="obs-insp-filter-box-label">Category</span>
            <select className="obs-insp-filter-box-val">
              <option>Select</option>
            </select>
            <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
          </div>
          <div className="obs-insp-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <span className="obs-insp-filter-box-label">Date Range</span>
            <div className="obs-insp-filter-box-val">
              <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
              <div className="obs-insp-calendar-icons">
                 <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                 <Calendar size={14} />
              </div>
            </div>
            <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
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
          
          <div className="obs-insp-filter-actions">
            <div className="obs-insp-search-row">
              <button className="obs-insp-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-insp-btn-search">SEARCH</button>
            </div>
            {isExpanded && <span className="obs-insp-clear-link">Clear Search</span>}
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="obs-insp-filter-row">
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Observation Type</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Operational Activity</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Observer</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Inspected By</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Involved Person</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div className="obs-insp-filter-spacer"></div>
            </div>
            <div className="obs-insp-filter-row row-last">
              <div className="obs-insp-filter-box">
                <span className="obs-insp-filter-box-label">Source</span>
                <select className="obs-insp-filter-box-val">
                  <option>Select</option>
                </select>
                <ChevronDown size={12} className="obs-insp-filter-box-arrow" />
              </div>
              <div style={{ flex: 4.2 }}></div>
            </div>
          </>
        )}
      </div>

      {/* List Controls */}
      <div className="obs-insp-list-controls">
        <span className="obs-insp-list-count">Listing 1 - 10 Of 88</span>
        <div className="obs-insp-list-icons">
          <Search size={16} />
          <Settings size={16} onClick={() => setIsSettingsOpen(true)} />
        </div>
      </div>

      {/* List Rows */}
      <div className="obs-insp-list-rows-wrapper">
        {listData.map((row, index) => (
          <div key={index} className="obs-insp-list-row">
            
            <div className="obs-insp-col col-insp-title">
                <span className="obs-insp-row-title">{row.titleType}</span>
                <span className="obs-insp-row-sub obs-insp-link">{row.id}</span>
            </div>

            <div className="obs-insp-col col-insp-user">
              <div>
                 <span className="obs-insp-row-sub" style={{marginBottom: '4px', color: '#1e293b'}}>{row.name}</span>
                 <span className="obs-insp-row-sub">{row.role}</span>
              </div>
              <Monitor size={14} className="obs-insp-icon-small" />
            </div>

            <div className="obs-insp-col col-insp-date">
              <span className="obs-insp-row-sub">{row.date1}</span>
              <span className="obs-insp-row-sub">{row.time1}</span>
            </div>

            <div className="obs-insp-col col-insp-loc">
              <span className="obs-insp-row-sub">{row.locationName}</span>
              <span className="obs-insp-row-sub">
                {row.locationSub !== "--" ? <MapPin size={12} className="obs-insp-icon-small" /> : null} 
                {row.locationSub}
              </span>
            </div>

            <div className="obs-insp-col col-insp-cat">
              <span className="obs-insp-row-sub">{row.category}</span>
              <span className="obs-insp-row-sub">{row.subCategory}</span>
            </div>

            <div className="obs-insp-col col-insp-status">
              <span className="obs-insp-row-sub">{row.status}</span>
            </div>

            <div className="obs-insp-col col-insp-timer">
              <Clock size={14} className="obs-insp-icon-small" />
              <span className="obs-insp-row-sub">{row.timer}</span>
            </div>

            <div className="obs-insp-col col-insp-menu">
              <MoreVertical size={16} className="obs-insp-icon-small" style={{ cursor: 'pointer', marginBottom: '8px' }} />
              <ChevronDown size={14} className="obs-insp-icon-small" style={{ cursor: 'pointer' }} />
            </div>

          </div>
        ))}
      </div>

      {!hasLoadedMore && (
        <button className="obs-insp-load-more" onClick={handleLoadMore}>LOAD MORE</button>
      )}

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="obs-insp-drawer-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="obs-insp-settings-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="obs-insp-drawer-title">Settings</h3>

            <div className="obs-insp-drawer-section">
              <span className="obs-insp-drawer-label">DATE RANGE</span>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="dateRange" /> 90 Days
              </label>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="dateRange" /> 60 Days
              </label>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="dateRange" defaultChecked /> 30 Days
              </label>
            </div>

            <div className="obs-insp-drawer-section">
              <span className="obs-insp-drawer-label">SORT ORDER</span>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="sortOrder" /> Date Ascending
              </label>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="sortOrder" defaultChecked /> Date Descending
              </label>
            </div>

            <div className="obs-insp-drawer-section">
              <span className="obs-insp-drawer-label">SHOW REJECT RECORD</span>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="rejectRecord" defaultChecked /> Yes
              </label>
              <label className="obs-insp-radio-opt">
                <input type="radio" name="rejectRecord" /> No
              </label>
            </div>

            <div className="obs-insp-drawer-footer">
              <button className="obs-insp-btn-cancel" onClick={() => setIsSettingsOpen(false)}>CANCEL</button>
              <button className="obs-insp-btn-save" onClick={() => setIsSettingsOpen(false)}>SAVE</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ObservationInspection;
