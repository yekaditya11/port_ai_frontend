import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, Search, Settings, 
  X, Eye
} from 'lucide-react';
import { api } from '../../services/api';
import './ObservationClosure.css';
import '../common/DateRangePicker.css';

const ObservationClosure = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClosedObservations = async () => {
      setLoading(true);
      try {
        const result = await api.getObservations({ status: 'Closed' });
        setListData(result.items || result);
      } catch (err) {
        console.error("Failed to fetch closed observations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClosedObservations();
  }, []);
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



  return (
    <div className="obs-closure-container">
      <div className="obs-closure-header">
        <h2 className="obs-closure-title">Closure Report</h2>
      </div>

      <div className="obs-closure-filter-grid">
        <div className="obs-closure-filter-row">
          <div className="obs-closure-filter-box">
            <span className="obs-closure-filter-box-label">Group</span>
            <select className="obs-closure-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
          </div>
          <div className="obs-closure-filter-box">
            <span className="obs-closure-filter-box-label">Area</span>
            <select className="obs-closure-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
          </div>
          <div className="obs-closure-filter-box">
            <span className="obs-closure-filter-box-label">Observation Type</span>
            <select className="obs-closure-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
          </div>
          <div className="obs-closure-filter-box">
            <span className="obs-closure-filter-box-label">Category</span>
            <select className="obs-closure-filter-box-val"><option>Select</option></select>
            <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
          </div>
          <div className="obs-closure-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <span className="obs-closure-filter-box-label">Date Range</span>
            <div className="obs-closure-filter-box-val">
              <span>{formatDate(filterDates.from)} | {formatDate(filterDates.to)}</span>
              <div className="obs-closure-calendar-icons">
                <X size={14} onClick={(e) => { e.stopPropagation(); setFilterDates({ from: '', to: '' }); }} />
                <Calendar size={14} />
              </div>
            </div>
            <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
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
          <div className="obs-closure-filter-actions">
            <div className="obs-closure-search-row">
              <button className="obs-closure-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-closure-btn-search">SEARCH</button>
            </div>
            {isExpanded && <span className="obs-closure-clear-link">Clear Search</span>}
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="obs-closure-filter-row">
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Business Unit</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Operational Activity</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Observer</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Inspected By</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Involved Person</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div style={{ flex: 0.2 }}></div>
            </div>
            <div className="obs-closure-filter-row row-last">
              <div className="obs-closure-filter-box">
                <span className="obs-closure-filter-box-label">Source</span>
                <select className="obs-closure-filter-box-val"><option>Select</option></select>
                <ChevronDown size={12} className="obs-closure-filter-box-arrow" />
              </div>
              <div style={{ flex: 4.2 }}></div>
            </div>
          </>
        )}
      </div>

      <div className="obs-closure-list-controls">
        <span className="obs-closure-list-count">Listing 1 - 10 Of 44</span>
        <div className="obs-closure-list-icons"><Search size={16} /><Settings size={16} /></div>
      </div>

      <div className="obs-closure-table-wrapper">
        <div className="obs-closure-table-header">
          <div className="obs-closure-header-cell col-id">OBSERVATION ID</div>
          <div className="obs-closure-header-cell col-group">OBSERVATION GROUP</div>
          <div className="obs-closure-header-cell col-observer">OBSERVER</div>
          <div className="obs-closure-header-cell col-obs-date">OBSERVED DATE</div>
          <div className="obs-closure-header-cell col-rec-date">RECORDED DATE</div>
          <div className="obs-closure-header-cell col-loc">LOCATION</div>
          <div className="obs-closure-header-cell col-bu">BUSINESS UNIT</div>
          <div className="obs-closure-header-cell col-cat">CATEGORY</div>
          <div className="obs-closure-header-cell col-status">STATUS</div>
          <div className="obs-closure-header-cell col-action"></div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading closed observations...</div>
        ) : listData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No closed observations found.</div>
        ) : listData.map((row, idx) => (
          <div key={row.id || idx} className="obs-closure-row">
            <div className="obs-closure-cell col-id link">{row.observation_ref || '--'}</div>
            <div className="obs-closure-cell col-group">{row.risk_category || '--'}</div>
            <div className="obs-closure-cell col-observer bold">{row.observer_name || '--'}</div>
            <div className="obs-closure-cell col-obs-date"><span>{formatDate(row.observed_date)}</span><span>{row.time_of_day || '--'}</span></div>
            <div className="obs-closure-cell col-rec-date"><span>{formatDate(row.created_at || row.observed_date)}</span><span>{row.time_of_day || '--'}</span></div>
            <div className="obs-closure-cell col-loc">{row.sub_area || row.area_of_observation || '--'}</div>
            <div className="obs-closure-cell col-bu">{row.business_unit_name || '--'}</div>
            <div className="obs-closure-cell col-cat">{row.observation_category || '--'}</div>
            <div className="obs-closure-cell col-status">{row.status}</div>
            <div className="obs-closure-cell col-action"><Eye size={16} className="obs-closure-action-icon" /></div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ObservationClosure;
