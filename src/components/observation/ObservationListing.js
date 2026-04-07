import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, ChevronDown, Calendar, Search, Settings, 
  MapPin, Clock, MoreVertical, Monitor, PlusCircle as OrangeIcon, X,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import './ObservationListing.css';
import '../common/DateRangePicker.css';

const ObservationListing = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    observation_ref: '',
    department: '',
    operational_activity: '',
    status: '',
    from_date: '',
    to_date: ''
  });

  // --- API FETCHING ---
  const fetchObservations = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const params = {
        page: currentPage,
        page_size: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'Select'))
      };

      const data = await api.getObservations(params);
      
      if (isLoadMore) {
        setObservations(prev => [...prev, ...data.items]);
        setPage(currentPage);
      } else {
        setObservations(data.items);
        setTotal(data.total);
        setPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch observations:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchObservations();
  }, []); // Initial load only

  const handleSearch = () => {
    fetchObservations(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- HELPERS ---
  const formatDateForUI = (dateStr) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTimeForUI = (dateStr) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <input 
            type="text" 
            className="obs-filter-box-input" 
            placeholder="Search ID..."
            value={filters.observation_ref}
            onChange={(e) => handleFilterChange('observation_ref', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%', height: '20px' }}
          />
        </div>
        
        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Department</span>
          <select 
            className="obs-filter-box-val"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">Select</option>
            <option value="HSE">HSE</option>
            <option value="Operations">Operations</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>

        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Operational Activity</span>
          <select 
            className="obs-filter-box-val"
            value={filters.operational_activity}
            onChange={(e) => handleFilterChange('operational_activity', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Driving">Driving</option>
            <option value="Lifting">Lifting</option>
            <option value="Working at Height">Working at Height</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>

        <div className="obs-filter-box">
          <span className="obs-filter-box-label">Status</span>
          <select 
            className="obs-filter-box-val"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Select</option>
            <option value="New">New</option>
            <option value="Review">Review</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
        </div>

        <div className="obs-filter-box" style={{ flex: 1.2, cursor: 'pointer' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
          <span className="obs-filter-box-label">Date Range</span>
          <div className="obs-filter-box-val" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: (filters.from_date || filters.to_date) ? '#334155' : '#94a3b8' }}>
              {(filters.from_date && filters.to_date) ? `${filters.from_date} | ${filters.to_date}` : 'Select Range'}
            </span>
            <div className="obs-calendar-icons" style={{ display: 'flex', gap: '4px' }}>
               {(filters.from_date || filters.to_date) && <X size={14} onClick={(e) => { e.stopPropagation(); setFilters({ ...filters, from_date: '', to_date: '' }); }} />}
               <Calendar size={14} />
            </div>
          </div>
          <ChevronDown size={12} className="obs-filter-box-arrow" />
          {isDatePickerOpen && (
            <div className="date-range-popover" onClick={(e) => e.stopPropagation()} style={{ 
              position: 'absolute', top: '100%', left: 0, zIndex: 100, backgroundColor: '#fff', 
              padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              width: '200px'
            }}>
              <div className="date-range-popover-row" style={{ marginBottom: '8px' }}>
                <span className="date-range-label" style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>From Date</span>
                <input 
                  type="date" 
                  className="date-range-input" 
                  value={filters.from_date}
                  onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>
              <div className="date-range-popover-row">
                <span className="date-range-label" style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>To Date</span>
                <input 
                  type="date" 
                  className="date-range-input" 
                  value={filters.to_date}
                  onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>
              <button 
                className="btn-search" 
                style={{ width: '100%', marginTop: '10px', height: '30px' }} 
                onClick={() => { setIsDatePickerOpen(false); handleSearch(); }}
              >APPLY</button>
            </div>
          )}
        </div>
        <button className="btn-search" onClick={handleSearch}>SEARCH</button>
      </div>

      {/* List Controls */}
      <div className="obs-list-controls">
        <span className="obs-list-count">
          {loading ? 'Searching...' : `Listing 1 - ${observations.length} Of ${total}`}
        </span>
        <div className="obs-list-icons">
          <Search size={16} />
          <Settings size={16} onClick={() => setIsSettingsOpen(true)} />
        </div>
      </div>

      {/* List Rows */}
      <div className="obs-list-rows-wrapper">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Loader2 className="obs-animate-spin" size={32} color="#0ea5e9" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '10px', color: '#64748b' }}>Fetching observations...</p>
          </div>
        ) : observations.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: '#64748b' }}>
            <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>No observations found matching your criteria.</p>
          </div>
        ) : (
          observations.map((row, index) => (
            <div key={`${row.observation_ref}-${index}`} className="obs-list-row">
              
              <div className="obs-col col-assets" style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="obs-row-title">Observation Details</span>
                  <span className="obs-row-sub obs-link" style={{ fontWeight: '700', color: '#0ea5e9' }}>{row.observation_ref}</span>
                </div>
                <div style={{ paddingTop: '10px' }}>
                  <Monitor size={14} className="icon-small" color="#94a3b8" />
                </div>
              </div>

              <div className="obs-col col-user" style={{ minWidth: '150px' }}>
                <span className="obs-row-sub" style={{ fontWeight: '700', color: '#1e293b' }}>{row.reported_by_name || 'Anonymous'}</span>
                <span className="obs-row-sub" style={{ fontSize: '11px' }}>{row.designation || '--'}</span>
              </div>

              <div className="obs-col col-date1">
                <span className="obs-row-sub">{formatDateForUI(row.reported_date)}</span>
                <span className="obs-row-sub">{formatTimeForUI(row.reported_date)}</span>
              </div>

              <div className="obs-col col-date2">
                <span className="obs-row-sub" style={{ color: '#94a3b8' }}>--</span>
                <span className="obs-row-sub" style={{ color: '#94a3b8' }}>--</span>
              </div>

              <div className="obs-col col-loc">
                <span className="obs-row-sub" style={{ color: '#1e293b' }}>{row.area_of_observation || 'Unknown Area'}</span>
                <span className="obs-row-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} className="icon-small" /> {row.sub_area || '--'}
                </span>
              </div>

              <div className="obs-col col-title" style={{ flex: 1.5 }}>
                <span className="obs-row-sub" style={{ fontWeight: '600', color: '#1e293b' }}>{row.observation_group}</span>
                <span className="obs-row-sub">{row.observation_type}</span>
              </div>

              <div className="obs-col col-status">
                <div className={`status-badge status-${(row.status || 'new').toLowerCase()}`}>
                  {row.status}
                </div>
              </div>

              <div className="obs-col col-timer">
                <Clock size={14} className="icon-small" />
                <span className="obs-row-sub">00:00:00</span>
              </div>

              <div className="obs-col col-menu">
                <MoreVertical size={16} className="icon-small" style={{ cursor: 'pointer', marginBottom: '8px' }} />
                <ChevronDown size={14} className="icon-small" style={{ cursor: 'pointer' }} />
              </div>

            </div>
          ))
        )}
      </div>

      {(total > observations.length) && (
        <button 
          className="obs-load-more" 
          onClick={() => fetchObservations(true)}
          disabled={loadingMore}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loadingMore ? (
            <>
              <Loader2 className="obs-animate-spin" size={14} /> LOADING...
            </>
          ) : 'LOAD MORE'}
        </button>
      )}

      {/* Settings Drawer (Static for now) */}
      {isSettingsOpen && (
        <div className="obs-drawer-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="obs-settings-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="obs-drawer-title">Settings</h3>
            <div className="obs-drawer-section">
              <span className="obs-drawer-label">SORT ORDER</span>
              <label className="obs-radio-opt">
                <input type="radio" name="sortOrder" defaultChecked /> Date Descending
              </label>
              <label className="obs-radio-opt">
                <input type="radio" name="sortOrder" /> Date Ascending
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
