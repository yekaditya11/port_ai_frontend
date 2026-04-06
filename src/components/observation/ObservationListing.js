import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, ChevronDown, Calendar, Search, Settings, 
  MapPin, Clock, MoreVertical, Monitor, PlusCircle as OrangeIcon, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import './ObservationListing.css';
import '../common/DateRangePicker.css';

const ObservationListing = () => {
  const navigate = useNavigate();
  
  const initialData = [
    {
      id: "OBR/0326/3906",
      iconType: "orange",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "31 Mar 2026", time1: "16:16",
      date2: "31 Mar 2026", time2: "16:16",
      locationName: "Auxiliary facilities",
      locationSub: "--",
      title: "Barriers and Cones (Concrete or...",
      subTitle: "",
      status: "New",
      timer: "04:23:28"
    },
    {
      id: "OBR/0326/3905",
      iconType: "monitor",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "26 Mar 2026", time1: "18:04",
      date2: "26 Mar 2026", time2: "18:04",
      locationName: "Cargo Loading Dock",
      locationSub: "--",
      title: "Floors and Roads",
      subTitle: "Slip / Trip / Fall Same Level",
      status: "Inspection",
      timer: "09:21:40"
    },
    {
      id: "OBR/0326/3905",
      iconType: "monitor",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "26 Mar 2026", time1: "18:04",
      date2: "26 Mar 2026", time2: "18:04",
      locationName: "Cargo Loading Dock",
      locationSub: "--",
      title: "Floors and Roads",
      subTitle: "Slip / Trip / Fall Same Level",
      status: "Inspection",
      timer: "09:21:40"
    },
    {
      id: "OBR/0326/3905",
      iconType: "monitor",
      name: "Martin Debeloz",
      role: "General Manager",
      date1: "26 Mar 2026", time1: "18:04",
      date2: "26 Mar 2026", time2: "18:04",
      locationName: "Cargo Loading Dock",
      locationSub: "--",
      title: "Floors and Roads",
      subTitle: "Slip / Trip / Fall Same Level",
      status: "Inspection",
      timer: "09:21:40"
    }
  ];

  const newData = Array(4).fill({
    id: "OBR/0326/3904",
    iconType: "monitor",
    name: "Martin Debeloz",
    role: "General Manager",
    date1: "26 Mar 2026", time1: "16:44",
    date2: "26 Mar 2026", time2: "16:44",
    locationName: "Container & General Cargo Berth",
    locationSub: "--",
    title: "Floors and Roads",
    subTitle: "Vehicle Accident",
    status: "Review",
    timer: "09:23:05"
  });

  const [listData, setListData] = useState(initialData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleLoadMore = () => {
    setListData([...listData, ...newData]);
  };


  return (
    <div className="obs-listing-container">
      <div className="obs-listing-header">
        <h2 className="obs-listing-title">Observation List</h2>
      </div>

      <button className="btn-new-obs" onClick={() => navigate('/observation/create-new-observation')}>
        <PlusCircle size={16} className="plus-circle-icon" /> NEW OBSERVATION
      </button>

      {/* Filter Bar */}
      <div className="obs-filter-bar">
        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Observation ID</span>
          <select className="obs-filter-box-val">
            <option>Select</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>
        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Department</span>
          <select className="obs-filter-box-val">
            <option>Select</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>
        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Operational Activity</span>
          <select className="obs-filter-box-val">
            <option>Select</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>
        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Status</span>
          <select className="obs-filter-box-val">
            <option>Select</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>
        <div className="obs-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
          <span className="obs-filter-box-label">Date Range</span>
          <div className="obs-filter-box-val">
            <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
            <div className="obs-calendar-icons">
               <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
               <Calendar size={14} />
            </div>
          </div>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
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
        <button className="btn-search">SEARCH</button>
      </div>

      {/* List Controls */}
      <div className="obs-list-controls">
        <span className="obs-list-count">Listing 1 - 10 Of 333</span>
        <div className="obs-list-icons">
          <Search size={16} />
          <Settings size={16} onClick={() => setIsSettingsOpen(true)} />
        </div>
      </div>

      {/* List Rows */}
      <div className="obs-list-rows-wrapper">
        {listData.map((row, index) => (
          <div key={index} className="obs-list-row">
            
            <div className="obs-col col-assets" style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="obs-row-title">Assets</span>
                <span className="obs-row-sub obs-link">{row.id}</span>
              </div>
              <div style={{ paddingTop: '4px' }}>
                {row.iconType === 'orange' ? 
                  <OrangeIcon size={14} color="#f97316" fill="#fff" /> : 
                  <Monitor size={14} className="icon-small" />
                }
              </div>
            </div>

            <div className="obs-col col-user">
              <span className="obs-row-sub">{row.name}</span>
              <span className="obs-row-sub">{row.role}</span>
            </div>

            <div className="obs-col col-date1">
              <span className="obs-row-sub">{row.date1}</span>
              <span className="obs-row-sub">{row.time1}</span>
            </div>

            <div className="obs-col col-date2">
              <span className="obs-row-sub">{row.date2}</span>
              <span className="obs-row-sub">{row.time2}</span>
            </div>

            <div className="obs-col col-loc">
              <span className="obs-row-sub">{row.locationName}</span>
              <span className="obs-row-sub"><MapPin size={12} className="icon-small" /> {row.locationSub}</span>
            </div>

            <div className="obs-col col-title">
              <span className="obs-row-sub">{row.title}</span>
              <span className="obs-row-sub">{row.subTitle}</span>
            </div>

            <div className="obs-col col-status">
              <span className="obs-row-sub">{row.status}</span>
            </div>

            <div className="obs-col col-timer">
              <Clock size={14} className="icon-small" />
              <span className="obs-row-sub">{row.timer}</span>
            </div>

            <div className="obs-col col-menu">
              <MoreVertical size={16} className="icon-small" style={{ cursor: 'pointer', marginBottom: '8px' }} />
              <ChevronDown size={14} className="icon-small" style={{ cursor: 'pointer' }} />
            </div>

          </div>
        ))}
      </div>

      <button className="obs-load-more" onClick={handleLoadMore}>LOAD MORE</button>

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="obs-drawer-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="obs-settings-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="obs-drawer-title">Settings</h3>

            <div className="obs-drawer-section">
              <span className="obs-drawer-label">DATE RANGE</span>
              <label className="obs-radio-opt">
                <input type="radio" name="dateRange" /> 90 Days
              </label>
              <label className="obs-radio-opt">
                <input type="radio" name="dateRange" /> 60 Days
              </label>
              <label className="obs-radio-opt">
                <input type="radio" name="dateRange" defaultChecked /> 30 Days
              </label>
            </div>

            <div className="obs-drawer-section">
              <span className="obs-drawer-label">SORT ORDER</span>
              <label className="obs-radio-opt">
                <input type="radio" name="sortOrder" /> Date Ascending
              </label>
              <label className="obs-radio-opt">
                <input type="radio" name="sortOrder" defaultChecked /> Date Descending
              </label>
            </div>

            <div className="obs-drawer-section">
              <span className="obs-drawer-label">SHOW REJECT RECORD</span>
              <label className="obs-radio-opt">
                <input type="radio" name="rejectRecord" defaultChecked /> Yes
              </label>
              <label className="obs-radio-opt">
                <input type="radio" name="rejectRecord" /> No
              </label>
            </div>

            <div className="obs-drawer-footer">
              <button className="obs-btn-cancel" onClick={() => setIsSettingsOpen(false)}>CANCEL</button>
              <button className="obs-btn-save" onClick={() => setIsSettingsOpen(false)}>SAVE</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ObservationListing;
