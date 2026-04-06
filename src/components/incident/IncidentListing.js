import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  Monitor, 
  AlertTriangle, 
  MoreVertical,
  ChevronDown,
  Calendar,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import './IncidentListing.css';

const IncidentListing = ({ status: propStatus }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
  // Filters
  const [filters] = useState({
    status: propStatus || '',
    incident_type: '',
    incident_group: '',
    shift: ''
  });

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents({
        ...filters,
        page,
        page_size: 20
      });
      setIncidents(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

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

  const FilterGroup = ({ label, value }) => (
    <div className="filter-group">
      <div className="filter-inner">
        <label className="filter-label">{label}</label>
        <div className="filter-value">{value || 'Select'}</div>
      </div>
      <ChevronDown size={14} className="select-icon" />
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
           <div className="new-incident-btn">
              <Plus size={16} /> NEW INCIDENT
           </div>
        </div>
      )}

      <div className="content-padding" style={{ paddingTop: '10px' }}>
        <div className="incident-listing-container">
          
          <div className="listing-toolbar">
            <div className="toolbar-filters">
              <FilterGroup label="Incident ID" />
              <FilterGroup label="Incident Type" />
              <FilterGroup label="Incident Group" />
              <FilterGroup label="Shift" />
              <div className="filter-group" style={{ position: 'relative', flex: '1.2' }} onClick={() => setShowCalendar(!showCalendar)}>
                 <div className="filter-inner">
                    <label className="filter-label">Date Range</label>
                    <div className="filter-value">Select Range</div>
                 </div>
                 <div className="date-icons">
                    <span className="clear-icon" style={{ fontSize: '14px', marginRight: '5px' }}>×</span>
                    <Calendar size={14} className="calendar-icon" />
                    <ChevronDown size={14} className="select-icon-relative" />
                 </div>
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
                <Loader2 className="animate-spin" size={32} color="#22d3ee" style={{ margin: '0 auto' }} />
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
                        <div className="item-id">
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
                            color: '#22d3ee', 
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

