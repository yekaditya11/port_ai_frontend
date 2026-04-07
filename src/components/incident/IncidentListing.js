import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Settings, 
  Monitor, 
  AlertTriangle, 
  MoreVertical,
  ChevronDown,
  Calendar
} from 'lucide-react';
import Loader from '../common/Loader';
import DateRangePicker from '../common/DateRangePicker';
import { api } from '../../services/api';
import { useRef } from 'react';
import './IncidentListing.css';

const IncidentListing = ({ status: propStatus }) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [enums, setEnums] = useState({});
  const [incidentRefs, setIncidentRefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(null);
  const filterContainerRef = useRef(null);
  
  // Filters
  const [filters, setFilters] = useState({
    status: propStatus || '',
    incident_ref: '',
    incident_type: '',
    incident_group: '',
    shift: '',
    start_date: '',
    end_date: ''
  });

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      // Create a clean params object, mapping 'incident_ref' if present
      const params = {
        page,
        page_size: 6,
        status: filters.status,
        incident_type: filters.incident_type !== 'Select' ? filters.incident_type : '',
        incident_group: filters.incident_group !== 'Select' ? filters.incident_group : '',
        shift: filters.shift !== 'Select' ? filters.shift : '',
        incident_ref: filters.incident_ref,
        start_date: filters.start_date,
        end_date: filters.end_date
      };

      // Remove empty strings
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) delete params[key];
      });

      const data = await api.getIncidents(params);
      setIncidents(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [enumData, refData] = await Promise.all([
          api.getEnumsAll(),
          api.getIncidentRefs()
        ]);
        setEnums(enumData);
        setIncidentRefs(refData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const toggleFilter = (name) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const DetailRow = ({ label, value }) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-colon">:</span>
      <span className="detail-value">{value || '--'}</span>
    </div>
  );



  const getSeverityType = (severity) => {
    if (!severity) return 'minor';
    const s = severity.toLowerCase();
    if (s.includes('major') || s.includes('critical') || s.includes('fatal')) return 'major';
    if (s.includes('moderate')) return 'moderate';
    return 'minor';
  };

  return (
    <div className="dashboard-layout-main" style={{ backgroundColor: '#f1f5f9' }}>
      {!propStatus && (
        <div style={{ padding: '0 24px', marginTop: '20px' }}>
           <div className="new-incident-btn" onClick={() => navigate('/incident/create-new-incident')}>
              <Plus size={16} /> NEW INCIDENT
           </div>
        </div>
      )}

      <div className="content-padding" style={{ paddingTop: '10px' }}>
        <div className="incident-listing-container">
          
          <div className="listing-toolbar" ref={filterContainerRef}>
            <div className="toolbar-filters">
              {/* Incident ID Filter - Dropdown */}
              <div className={`filter-group ${openFilter === 'id' ? 'is-open' : ''}`} onClick={() => toggleFilter('id')}>
                <div className="filter-inner">
                  <label className="filter-label">Incident ID</label>
                  <div className="filter-value">{filters.incident_ref || 'Select'}</div>
                </div>
                <ChevronDown size={14} className="select-icon" />
                {openFilter === 'id' && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-option" onClick={() => handleFilterChange('incident_ref', '')}>All IDs</div>
                    {incidentRefs.map(ref => (
                      <div key={ref} className="filter-option" onClick={() => handleFilterChange('incident_ref', ref)}>{ref}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Types Filter */}
              <div className={`filter-group ${openFilter === 'type' ? 'is-open' : ''}`} onClick={() => toggleFilter('type')}>
                <div className="filter-inner">
                  <label className="filter-label">Incident Type</label>
                  <div className="filter-value">{filters.incident_type || 'Select'}</div>
                </div>
                <ChevronDown size={14} className="select-icon" />
                {openFilter === 'type' && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-option" onClick={() => handleFilterChange('incident_type', '')}>All Types</div>
                    {enums.incident_type?.map(opt => {
                      const label = typeof opt === 'object' ? opt.value : opt;
                      return (
                        <div key={label} className="filter-option" onClick={() => handleFilterChange('incident_type', label)}>{label}</div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Groups Filter */}
              <div className={`filter-group ${openFilter === 'group' ? 'is-open' : ''}`} onClick={() => toggleFilter('group')}>
                <div className="filter-inner">
                  <label className="filter-label">Incident Group</label>
                  <div className="filter-value">{filters.incident_group || 'Select'}</div>
                </div>
                <ChevronDown size={14} className="select-icon" />
                {openFilter === 'group' && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-option" onClick={() => handleFilterChange('incident_group', '')}>All Groups</div>
                    {enums.incident_group?.map(opt => {
                      const label = typeof opt === 'object' ? opt.value : opt;
                      return (
                        <div key={label} className="filter-option" onClick={() => handleFilterChange('incident_group', label)}>{label}</div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Shift Filter */}
              <div className={`filter-group ${openFilter === 'shift' ? 'is-open' : ''}`} onClick={() => toggleFilter('shift')}>
                <div className="filter-inner">
                  <label className="filter-label">Shift</label>
                  <div className="filter-value">{filters.shift || 'Select'}</div>
                </div>
                <ChevronDown size={14} className="select-icon" />
                {openFilter === 'shift' && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-option" onClick={() => handleFilterChange('shift', '')}>All Shifts</div>
                    {enums.shift?.map(opt => {
                      const label = typeof opt === 'object' ? opt.value : opt;
                      return (
                        <div key={label} className="filter-option" onClick={() => handleFilterChange('shift', label)}>{label}</div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Date Range Filter */}
              <div className={`filter-group ${openFilter === 'date' ? 'is-open' : ''}`} style={{ flex: '1.5' }} onClick={() => toggleFilter('date')}>
                <div className="filter-inner">
                  <label className="filter-label">Date Range</label>
                  <div className="filter-value">
                    {filters.start_date || filters.end_date 
                      ? `${filters.start_date ? new Date(filters.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '...'} | ${filters.end_date ? new Date(filters.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '...'}`
                      : 'Select Range'}
                  </div>
                </div>
                <div className="date-icons">
                  {(filters.start_date || filters.end_date) && (
                    <span 
                      className="clear-icon" 
                      style={{ fontSize: '14px', marginRight: '5px', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('start_date', '');
                        handleFilterChange('end_date', '');
                      }}
                    >×</span>
                  )}
                  <Calendar size={14} className="calendar-icon" />
                  <ChevronDown size={14} className="select-icon-relative" />
                </div>

                {openFilter === 'date' && (
                  <DateRangePicker 
                    startDate={filters.start_date ? new Date(filters.start_date) : null}
                    endDate={filters.end_date ? new Date(filters.end_date) : null}
                    onSelect={(start, end) => {
                      if (start) handleFilterChange('start_date', start.toISOString().split('T')[0]);
                      if (end) handleFilterChange('end_date', end.toISOString().split('T')[0]);
                      else handleFilterChange('end_date', '');
                    }}
                    onClose={() => setOpenFilter(null)}
                  />
                )}
              </div>

              <button className="btn-search" onClick={fetchIncidents}>SEARCH</button>
            </div>
          </div>

          <div className="listing-meta">
            <div className="results-count">
              {loading ? 'Loading...' : `Listing 1 - ${incidents.length} OF ${total}`}
            </div>
            <div className="meta-actions">
              <Search size={18} />
              <Settings size={18} />
            </div>
          </div>

          <div className="incident-list">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader size={32} style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '10px', color: '#64748b' }}>Fetching incidents...</p>
              </div>
            ) : incidents.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No incidents found.</div>
            ) : (
              incidents.map((incident) => {
                const severityType = getSeverityType(incident.actual_severity);
                return (
                  <React.Fragment key={incident.id}>
                    <div className={`incident-card ${expandedId === incident.id ? 'is-expanded' : ''}`}>
                      <div className="card-column">
                        <div className="item-title">{incident.incident_title}</div>
                        <div className="item-id" onClick={() => navigate(`/incident/review/${incident.id}`)} style={{ cursor: 'pointer', color: 'var(--brand-cyan, #00c4f4)' }}>
                          {incident.incident_ref}
                          <Monitor size={14} />
                        </div>
                      </div>

                      <div className="card-column">
                        <div className="item-label">{incident.incident_type}</div>
                        <div className="item-value">{incident.incident_group}</div>
                      </div>

                      <div className="card-column">
                        <div className="item-label">
                          {incident.incident_date ? new Date(incident.incident_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--'}
                        </div>
                        <div className="item-value">
                          {incident.incident_date ? new Date(incident.incident_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </div>
                      </div>

                      <div className="card-column">
                        <div className="item-label">{incident.area_of_incident}</div>
                        <div className="item-value">{incident.sub_area}</div>
                      </div>

                      <div className="card-column">
                        <div className="item-label">{incident.operational_activity}</div>
                        <div className="item-value">{incident.risk_category}</div>
                      </div>

                      <div className="card-column">
                        <div className="status-label">{incident.status}</div>
                        {incident.actual_severity && (
                          <div className={`severity-pill severity-${severityType}`}>
                            {incident.actual_severity}
                            <AlertTriangle size={12} fill={severityType === 'major' ? '#ef4444' : '#f59e0b'} color="#fff" />
                          </div>
                        )}
                      </div>

                      <div className="card-column" style={{ alignItems: 'flex-end' }}>
                        <div className="item-label" style={{ fontWeight: '700' }}>{incident.status === 'New' ? 'Review' : incident.status}</div>
                        <div className="item-value" style={{ fontSize: '11px' }}>00.00.00</div>
                      </div>

                      <div className="card-column" style={{ alignItems: 'flex-end' }}>
                        <MoreVertical size={18} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                        <ChevronDown 
                          size={14} 
                          style={{ 
                            color: 'var(--brand-cyan, #00c4f4)', 
                            marginTop: '8px', 
                            cursor: 'pointer',
                            transform: expandedId === incident.id ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                          }} 
                          onClick={() => toggleExpand(incident.id)}
                        />
                      </div>
                    </div>

                    {expandedId === incident.id && (
                      <div className="expanded-detail-box">
                        <div className="detail-grid">
                          <div className="detail-col">
                            <DetailRow label="Incident Title" value={incident.incident_title} />
                            <DetailRow label="Shift" value={incident.shift} />
                            <DetailRow label="Critical Incident" value={incident.critical_incident} />
                            <DetailRow label="Reported To" value={incident.reported_to_name} />
                            <DetailRow label="Inspected Date & Time" value={incident.inspected_date_time} />
                            <DetailRow label="Inspector" value={incident.inspector_name} />
                            <DetailRow label="Investigation Date & Time" value={incident.investigation_date_time} />
                            <DetailRow label="Lead Investigator" value={incident.lead_investigator_name} />
                            <DetailRow label="Reported Date & Time" value={incident.reported_date_time} />
                            <DetailRow label="Reportable" value={incident.reportable} />
                          </div>
                          <div className="detail-col">
                            <DetailRow label="Shift Manager" value={incident.shift_manager_name} />
                            <DetailRow label="Actual Severity" value={incident.actual_severity} />
                            <DetailRow label="Potential Severity" value={incident.potential_severity} />
                            <DetailRow label="Time of Day" value={incident.time_of_day} />
                            <DetailRow label="Weather" value={incident.weather} />
                            <DetailRow label="Work Activity Classification" value={incident.classification} />
                            <DetailRow label="Reported By" value={incident.reported_by_name} />
                            <DetailRow label="Recordable" value={incident.recordable} />
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>

          <div className="load-more-container">
            <button className="load-more-btn" disabled={loading} onClick={() => setPage(p => p + 1)}>LOAD MORE</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentListing;

