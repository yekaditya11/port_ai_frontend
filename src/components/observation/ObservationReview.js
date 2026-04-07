import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Calendar, Search, Settings, 
  MapPin, Monitor, X, Activity, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import './ObservationReview.css';
import DateRangePicker from '../common/DateRangePicker';

const PAGE_SIZE = 10;

const ObservationReview = () => {
  const navigate = useNavigate();
  const [observations, setObservations]   = useState([]);
  const [total, setTotal]                 = useState(0);
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isExpanded, setIsExpanded]       = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    observation_ref:     '',
    department:          '',
    operational_activity:'',
    from_date:           '',
    to_date:             '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  // ── Fetch ────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (pg = 1, extraFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pg,
        page_size: PAGE_SIZE,
        status: 'New',           // always filter to New only
        ...extraFilters,
      };
      // strip empty strings
      Object.keys(params).forEach(k => { if (params[k] === '' || params[k] === undefined) delete params[k]; });

      const data = await api.getObservations(params);
      if (pg === 1) {
        setObservations(data.items || []);
      } else {
        setObservations(prev => [...prev, ...(data.items || [])]);
      }
      setTotal(data.total || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message || 'Failed to load observations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(1, appliedFilters); }, [fetchData, appliedFilters]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const formatDate = (isoStr) => {
    if (!isoStr) return '--';
    const d = new Date(isoStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
  };

  const formatTime = (isoStr) => {
    if (!isoStr) return '--';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleSearch = () => {
    const f = {};
    if (filters.observation_ref)      f.observation_ref      = filters.observation_ref;
    if (filters.department)           f.department           = filters.department;
    if (filters.operational_activity) f.operational_activity = filters.operational_activity;
    if (filters.from_date)            f.from_date            = filters.from_date;
    if (filters.to_date)              f.to_date              = filters.to_date;
    setAppliedFilters(f);
  };

  const handleClear = () => {
    setFilters({ observation_ref: '', department: '', operational_activity: '', from_date: '', to_date: '' });
    setAppliedFilters({});
  };

  const handleLoadMore = () => fetchData(page + 1, appliedFilters);

  const toggleRow = (id) => setExpandedRowId(expandedRowId === id ? null : id);

  const hasMore = observations.length < total;
  const showing = observations.length;

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <div className="obs-review-container">
      <div className="obs-review-header">
        <h2 className="obs-review-title">Review</h2>
        <span className="obs-review-status-badge">Status: New</span>
      </div>

      {/* Filters */}
      <div className="obs-review-filter-grid">
        <div className="obs-review-filter-row">

          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Observation ID</span>
            <input
              className="obs-review-filter-box-val obs-review-filter-input"
              placeholder="e.g. OBS963..."
              value={filters.observation_ref}
              onChange={e => setFilters(f => ({ ...f, observation_ref: e.target.value }))}
            />
          </div>

          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Department</span>
            <input
              className="obs-review-filter-box-val obs-review-filter-input"
              placeholder="Department..."
              value={filters.department}
              onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
            />
          </div>

          <div className="obs-review-filter-box">
            <span className="obs-review-filter-box-label">Operational Activity</span>
            <input
              className="obs-review-filter-box-val obs-review-filter-input"
              placeholder="Activity..."
              value={filters.operational_activity}
              onChange={e => setFilters(f => ({ ...f, operational_activity: e.target.value }))}
            />
          </div>

          {/* Date Range */}
          <div
            className="obs-review-filter-box"
            style={{ flex: 1.3, cursor: 'pointer' }}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <span className="obs-review-filter-box-label">Date Range</span>
            <div className="obs-review-filter-box-val">
              <span>
                {filters.from_date || 'From'} | {filters.to_date || 'To'}
              </span>
              <div className="obs-review-calendar-icons">
                <X size={14} onClick={e => { e.stopPropagation(); setFilters(f => ({ ...f, from_date: '', to_date: '' })); }} />
                <Calendar size={14} />
              </div>
            </div>
            <ChevronDown size={12} className="obs-review-filter-box-arrow" />
            {isDatePickerOpen && (
              <DateRangePicker 
                startDate={filters.from_date ? new Date(filters.from_date) : null}
                endDate={filters.to_date ? new Date(filters.to_date) : null}
                onSelect={(start, end) => {
                  setFilters(prev => ({
                    ...prev,
                    from_date: start ? start.toISOString().split('T')[0] : '',
                    to_date: end ? end.toISOString().split('T')[0] : ''
                  }));
                }}
                onClose={() => setIsDatePickerOpen(false)}
              />
            )}
          </div>

          <div className="obs-review-filter-actions">
            <div className="obs-review-search-row">
              <button className="obs-review-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button className="obs-review-btn-search" onClick={handleSearch}>SEARCH</button>
            </div>
            {isExpanded && <span className="obs-review-clear-link" onClick={handleClear}>Clear Search</span>}
          </div>
        </div>
      </div>

      {/* Count bar */}
      <div className="obs-review-list-controls">
        <span className="obs-review-list-count">
          {loading && page === 1
            ? 'Loading...'
            : `Showing ${showing} of ${total} New Observations`}
        </span>
        <div className="obs-review-list-icons">
          <Search size={16} />
          <Settings size={16} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="obs-review-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading (initial) */}
      {loading && page === 1 && (
        <div className="obs-review-loading">
          <Loader2 size={32} className="obs-review-spinner" />
          <span>Loading observations...</span>
        </div>
      )}

      {/* List */}
      {!loading || page > 1 ? (
        <div className="obs-review-list-rows-wrapper">
          {observations.length === 0 && !loading && (
            <div className="obs-review-empty">No new observations found.</div>
          )}

          {observations.map((row) => (
            <div key={row.observation_ref} className="obs-review-row-item">
              <div className="obs-review-list-row">

                {/* Title / ID */}
                <div className="obs-review-col col-rev-title">
                  <span className="obs-review-row-bold">{row.observation_type || row.observation_group || 'Observation'}</span>
                  <span
                    className="obs-review-link"
                    onClick={() => navigate(`/observation/review/${encodeURIComponent(row.observation_ref)}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.observation_ref}
                  </span>
                </div>

                {/* Reporter */}
                <div className="obs-review-col col-rev-user">
                  <span className="obs-review-row-bold">{row.reported_by_name || '--'}</span>
                  <span className="obs-review-row-sub">{row.designation || '--'}</span>
                </div>

                {/* Icons */}
                <div className="obs-review-col col-rev-icons">
                  <Activity size={14} className="obs-review-icon-orange" />
                  <Monitor size={14} className="obs-review-icon-grey" />
                </div>

                {/* Date / Time */}
                <div className="obs-review-col col-rev-date">
                  <span className="obs-review-row-sub">{formatDate(row.reported_date)}</span>
                  <span className="obs-review-row-sub">{formatTime(row.reported_date)}</span>
                </div>

                {/* Area */}
                <div className="obs-review-col col-rev-loc">
                  <span className="obs-review-row-bold" style={{ fontSize: '11px', fontWeight: '500' }}>
                    {row.area_of_observation || '--'}
                  </span>
                  <span className="obs-review-row-sub">
                    {row.sub_area && row.sub_area !== 'null' ? (
                      <><MapPin size={10} /> {row.sub_area}</>
                    ) : '--'}
                  </span>
                </div>

                {/* Group / Type */}
                <div className="obs-review-col col-rev-cat">
                  <span className="obs-review-row-sub">{row.observation_group || '--'}</span>
                  <span className="obs-review-row-sub">{row.observation_type || '--'}</span>
                </div>

                {/* Status */}
                <div className="obs-review-col col-rev-status">
                  <span className="obs-review-status-new">{row.status}</span>
                </div>

                {/* Expand toggle */}
                <div className="obs-review-col col-rev-actions" onClick={() => toggleRow(row.observation_ref)}>
                  {expandedRowId === row.observation_ref
                    ? <ChevronUp size={14} className="obs-review-icon-grey" style={{ cursor: 'pointer' }} />
                    : <ChevronDown size={14} className="obs-review-icon-grey" style={{ cursor: 'pointer' }} />
                  }
                </div>
              </div>

              {/* Expanded panel */}
              {expandedRowId === row.observation_ref && (
                <div className="obs-review-expanded-panel">
                  <div className="obs-review-details-grid">
                    <div className="obs-review-details-col">
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Reported Date &amp; Time</span>
                        <span className="obs-review-detail-val">
                          {formatDate(row.reported_date)} | {formatTime(row.reported_date)}
                        </span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Reported By</span>
                        <span className="obs-review-detail-val">{row.reported_by_name || '--'}</span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Designation</span>
                        <span className="obs-review-detail-val">{row.designation || '--'}</span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Area</span>
                        <span className="obs-review-detail-val">{row.area_of_observation || '--'}</span>
                      </div>
                    </div>
                    <div className="obs-review-details-col">
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Observation Group</span>
                        <span className="obs-review-detail-val">{row.observation_group || '--'}</span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Observation Type</span>
                        <span className="obs-review-detail-val">{row.observation_type || '--'}</span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Sub Area</span>
                        <span className="obs-review-detail-val">{row.sub_area || '--'}</span>
                      </div>
                      <div className="obs-review-detail-item">
                        <span className="obs-review-detail-label">Status</span>
                        <span className="obs-review-status-new">{row.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* Load More */}
      {hasMore && !loading && (
        <button className="obs-review-load-more" onClick={handleLoadMore}>
          LOAD MORE
        </button>
      )}
      {loading && page > 1 && (
        <div className="obs-review-loading" style={{ paddingTop: 8 }}>
          <Loader2 size={20} className="obs-review-spinner" />
        </div>
      )}
    </div>
  );
};

export default ObservationReview;
