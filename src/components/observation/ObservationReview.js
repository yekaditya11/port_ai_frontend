import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, Search, Settings, 
  MapPin, Clock, Monitor, X,
  Activity
} from 'lucide-react';
import './ObservationReview.css';
import '../common/DateRangePicker.css';

const ObservationReview = () => {
  const initialData = [
    {
      id: "OBR/0326/3906",
      title: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "31 Mar 26", time: "16:16:12",
      locName: "Auxiliary facilities",
      locSub: "--",
      cat: "Barriers and Cones (Concrete o...",
      subCat: "Slip, Trip or Falls on Same Level",
      status: "New",
      timer: "05:00:34"
    },
    {
      id: "OBR/0326/3902",
      title: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "26 Mar 26", time: "16:38:35",
      locName: "Container Berth",
      locSub: "Berth No. 05",
      cat: "Floors and Roads",
      subCat: "Slip / Trip / Fall Same Level",
      status: "New",
      timer: "10:00:12"
    },
    {
      id: "OBR/0326/3897",
      title: "Operations",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "25 Mar 26", time: "14:14:04",
      locName: "Container Parking Yard",
      locSub: "--",
      cat: "Failure to comply with...",
      subCat: "Operational Errors",
      status: "New",
      timer: "11:02:36"
    },
    {
      id: "OBR/0326/3892",
      title: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "25 Mar 26", time: "09:43:38",
      locName: "Container Yard",
      locSub: "C-YARD",
      cat: "Floors and Roads",
      subCat: "Slip / Trip / Fall Same Level",
      status: "New",
      timer: "11:07:07"
    },
    {
      id: "OBR/0326/3880",
      title: "Improper Usage and...",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "23 Mar 26", time: "16:04:58",
      locName: "General Cargo Berth",
      locSub: "--",
      cat: "Entry into the Inappropriate...",
      subCat: "Unauthorized Access",
      status: "New",
      timer: "13:00:45"
    }
  ];

  const newData = [
    {
      id: "OBR/0326/3877",
      title: "Unsafe Act",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "23 Mar 26", time: "15:45:35",
      locName: "Operations Building",
      locSub: "--",
      cat: "Not wearing PPE",
      subCat: "No helmet",
      status: "New",
      timer: "13:01:05"
    },
    {
      id: "OBR/0326/3876",
      title: "Unsafe Condition",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "23 Mar 26", time: "14:48:14",
      locName: "Bilge Facility",
      locSub: "--",
      cat: "Vehicle Movement / Traffic...",
      subCat: "Collision",
      status: "New",
      timer: "13:02:02"
    }
  ];

  const [listData, setListData] = useState(initialData);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);
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

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };


  return (
    <div className="obs-review-container">
      <div className="obs-review-header">
        <h2 className="obs-review-title">Review</h2>
      </div>

      <div className="obs-review-filter-grid">
        <div className="obs-review-filter-row">
          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Observation Group</span>
            <select className="obs-review-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
          </div>
          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Area</span>
            <select className="obs-review-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
          </div>
          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Business Unit</span>
            <select className="obs-review-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
          </div>
          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Category</span>
            <select className="obs-review-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
          </div>
          <div className="obs-review-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <span className="obs-review-filter-box-label">Date Range</span>
            <div className="obs-review-filter-box-val">
              <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
              <div className="obs-review-calendar-icons">
                <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                <Calendar size={14} />
              </div>
            </div>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
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
          <div className="obs-review-filter-actions">
            <div className="obs-review-search-row">
              <button className="obs-review-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-review-btn-search">SEARCH</button>
            </div>
            {isExpanded && <span className="obs-review-clear-link">Clear Search</span>}
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="obs-review-filter-row">
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Observation Type</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Operational Activity</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Observer</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Involved Person</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Source</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div style={{ flex: 0.2 }}></div>
            </div>
            <div className="obs-review-filter-row row-last">
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Shift</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div className="obs-review-filter-box">
                <span className="obs-review-filter-box-label">Operational Department</span>
                <select className="obs-review-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-review-filter-box-arrow" />
              </div>
              <div style={{ flex: 3.2 }}></div>
            </div>
          </>
        )}
      </div>

      <div className="obs-review-list-controls">
        <span className="obs-review-list-count">Listing 1 - 10 Of 54</span>
        <div className="obs-review-list-icons"><Search size={16} /><Settings size={16} /></div>
      </div>

      <div className="obs-review-list-rows-wrapper">
        {listData.map((row) => (
          <div key={row.id} className="obs-review-row-item">
            <div className="obs-review-list-row">
              <div className="obs-review-col col-rev-title">
                <span className="obs-review-row-bold">{row.title}</span>
                <span className="obs-review-link">{row.id}</span>
              </div>
              
              <div className="obs-review-col col-rev-user">
                <span className="obs-review-row-bold">{row.name}</span>
                <span className="obs-review-row-sub">{row.role}</span>
              </div>

              <div className="obs-review-col col-rev-icons">
                <Activity size={14} className="obs-review-icon-orange" />
                <Monitor size={14} className="obs-review-icon-grey" />
              </div>

              <div className="obs-review-col col-rev-date">
                <span className="obs-review-row-sub">{row.date}</span>
                <span className="obs-review-row-sub">{row.time}</span>
              </div>

              <div className="obs-review-col col-rev-loc">
                <span className="obs-review-row-bold" style={{ fontSize: '11px', fontWeight: '500'}}>{row.locName}</span>
                <span className="obs-review-row-sub">
                  {row.locSub !== "--" && <MapPin size={10} />}
                  {row.locSub}
                </span>
              </div>

              <div className="obs-review-col col-rev-cat">
                <span className="obs-review-row-sub">{row.cat}</span>
                <span className="obs-review-row-sub">{row.subCat}</span>
              </div>

              <div className="obs-review-col col-rev-status">
                <span className="obs-review-row-sub">{row.status}</span>
                <span className="obs-review-row-sub">--</span>
              </div>

              <div className="obs-review-col col-rev-timer">
                <Clock size={14} className="obs-review-icon-grey" />
                <span className="obs-review-row-sub">{row.timer}</span>
              </div>

              <div className="obs-review-col col-rev-actions" onClick={() => toggleRow(row.id)}>
                {expandedRowId === row.id ? (
                  <ChevronUp size={14} className="obs-review-icon-grey" style={{ cursor: 'pointer'}} />
                ) : (
                  <ChevronDown size={14} className="obs-review-icon-grey" style={{ cursor: 'pointer'}} />
                )}
              </div>
            </div>

            {expandedRowId === row.id && (
              <div className="obs-review-expanded-panel">
                <div className="obs-review-details-grid">
                  <div className="obs-review-details-col">
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Reported Date & Time</span>
                      <span className="obs-review-detail-val">{row.date} | {row.time.substring(0, 5)}</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Inspected Date & Time</span>
                      <span className="obs-review-detail-val">--</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Inspected By</span>
                      <span className="obs-review-detail-val">--</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Shift</span>
                      <span className="obs-review-detail-val">Shift 3</span>
                    </div>
                  </div>
                  <div className="obs-review-details-col">
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Category</span>
                      <span className="obs-review-detail-val">--</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Observation Type</span>
                      <span className="obs-review-detail-val">--</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Operational Activity</span>
                      <span className="obs-review-detail-val">Berthing/U..</span>
                    </div>
                    <div className="obs-review-detail-item">
                      <span className="obs-review-detail-label">Operational Department</span>
                      <span className="obs-review-detail-val">--</span>
                    </div>
                  </div>
                </div>
                <div className="obs-review-map-container">
                  <img src="/assets/images/observation/map_view.png" alt="Map View" className="obs-review-map-img" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!hasLoadedMore && (
        <button className="obs-review-load-more" onClick={handleLoadMore}>LOAD MORE</button>
      )}
    </div>
  );
};

export default ObservationReview;
