import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Settings, 
  MoreVertical,
  ChevronDown,
  Calendar
} from 'lucide-react';
import Loader from '../common/Loader';
import { api } from '../../services/api';
import './RootCauseAnalysis.css';

const RootCauseAnalysis = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rcaOn, setRcaOn] = useState(true);
  const [rcaData, setRcaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchRCAs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRCAs({ page, page_size: 6 });
      setRcaData(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch RCAs:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchRCAs();
  }, [fetchRCAs]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const FilterGroup = ({ label, value }) => (
    <div className="filter-group">
      <div className="filter-inner">
        <label className="filter-label">{label}</label>
        <div className="filter-value">{value || 'Select'}</div>
      </div>
      <ChevronDown size={14} className="select-icon" />
    </div>
  );

  return (
    <div className="dashboard-layout-main" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="content-padding" style={{ paddingTop: '20px' }}>
        <div className="rca-container">
          
          <div className="listing-toolbar">
            <div className="toolbar-filters">
              <FilterGroup label="Module" value="Incident" />
              <FilterGroup label="Event ID" />
              <FilterGroup label="Event Type" />
              <FilterGroup label="Event Group" />
              <FilterGroup label="RCA Status" />
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
              <button className="btn-search">SEARCH</button>
            </div>
          </div>

          <div className="rca-meta">
            <div className="results-count-rca">
              {loading ? 'Loading...' : `Listing 1 - ${rcaData.length} OF ${total}`}
            </div>
            <div className="meta-right-rca">
              <Search size={18} className="meta-icon-rca" />
              <div className="toggle-container-rca" onClick={() => setRcaOn(!rcaOn)}>
                <span className={`toggle-label-rca ${rcaOn ? 'active' : ''}`}>ON</span>
                <div className={`toggle-switch-rca ${rcaOn ? 'on' : ''}`}>
                  <div className="switch-knob-rca"></div>
                </div>
              </div>
              <Settings size={18} className="meta-icon-rca" />
            </div>
          </div>

          <div className="rca-table-wrapper">
            <table className="rca-table">
              <thead>
                <tr>
                  <th>EVENT ID <ChevronDown size={10} /></th>
                  <th>EVENT GROUP <ChevronDown size={10} /></th>
                  <th>OPERATION ACTIVITY <ChevronDown size={10} /></th>
                  <th>STATUS <ChevronDown size={10} /></th>
                  <th>RCA ID <ChevronDown size={10} /></th>
                  <th>PROCESS TYPE <ChevronDown size={10} /></th>
                  <th>ACTIONS <ChevronDown size={10} /></th>
                  <th>ROOT CAUSE <ChevronDown size={10} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '40px', textAlign: 'center' }}>
                      <Loader size={32} style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : rcaData.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No RCA records found.</td>
                  </tr>
                ) : (
                  rcaData.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className={expandedId === item.id ? 'row-expanded-parent' : ''}>
                        <td className="cell-id">{item.incident_ref}</td>
                        <td>{item.incident_group}</td>
                        <td>{item.operational_activity}</td>
                        <td>{item.status}</td>
                        <td className="cell-rca-id">{item.rca_ref}</td>
                        <td>{item.process_type || 'Manual'}</td>
                        <td>{item.action_count || 0}</td>
                        <td>{item.root_cause || '--'}</td>
                        <td className="cell-actions">
                          <MoreVertical size={16} />
                          <ChevronDown 
                            size={14} 
                            className={`expand-arraw ${expandedId === item.id ? 'rotated' : ''}`}
                            onClick={() => toggleExpand(item.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                      {expandedId === item.id && (
                        <tr className="expanded-row-rca">
                          <td colSpan="9">
                            <div className="expanded-content-rca">
                              <div className="detail-grid-rca">
                                <div className="detail-item-rca">
                                  <span className="label-rca">Module</span>
                                  <span className="value-rca">Incident</span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Sub Area</span>
                                  <span className="value-rca">{item.sub_area || '--'}</span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Event Type</span>
                                  <span className="value-rca">{item.incident_type}</span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Risk Category</span>
                                  <span className="value-rca">{item.risk_category}</span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Event Date & Time</span>
                                  <span className="value-rca">
                                    {item.incident_date ? new Date(item.incident_date).toLocaleString() : '--'}
                                  </span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Potential Severity</span>
                                  <span className="value-rca">{item.potential_severity}</span>
                                </div>
                                <div className="detail-item-rca">
                                  <span className="label-rca">Lead Investigator</span>
                                  <span className="value-rca">{item.lead_investigator_name || '--'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rca-footer">
            <button className="load-more-btn-rca" disabled={loading} onClick={() => setPage(p => p + 1)}>LOAD MORE</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
