import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Settings, 
  ChevronDown,
  Calendar,
  Clock,
  MoreVertical
} from 'lucide-react';
import Loader from '../common/Loader';
import { api } from '../../services/api';
import './IncidentWorkflow.css';

const IncidentWorkflow = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [workflowData, setWorkflowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getWorkflows({ page, page_size: 6 });
      setWorkflowData(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const FilterGroup = ({ label, value }) => (
    <div className="filter-group">
      <div className="filter-inner">
        <label className="filter-label">{label}</label>
        <div className="filter-value">{value || 'Select'}</div>
      </div>
      <ChevronDown size={14} className="select-icon" />
    </div>
  );

  const formatTimestamp = (ts) => {
    if (!ts) return <Clock size={16} className="cell-icon-pending" />;
    return new Date(ts).toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace(',', ' |');
  };

  return (
    <div className="dashboard-layout-main" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="content-padding" style={{ paddingTop: '20px' }}>
        <div className="incident-workflow-container">
          
          <div className="listing-toolbar">
            <div className="toolbar-filters">
              <FilterGroup label="Incident Reference" />
              <FilterGroup label="Incident Type" />
              <FilterGroup label="Incident Group" />
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

          <div className="workflow-meta">
            <div className="results-count-workflow">
              {loading ? 'Loading...' : `Listing 1 - ${workflowData.length} OF ${total}`}
            </div>
            <div className="meta-right-workflow">
              <Search size={18} className="meta-icon-workflow" />
              <Settings size={18} className="meta-icon-workflow" />
            </div>
          </div>

          <div className="workflow-table-wrapper">
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>INCIDENT ID <ChevronDown size={10} /></th>
                  <th>GROUP <ChevronDown size={10} /></th>
                  <th>REVIEWER <ChevronDown size={10} /></th>
                  <th>STATUS <ChevronDown size={10} /></th>
                  <th>RECORDED <ChevronDown size={10} /></th>
                  <th>REVIEW <ChevronDown size={10} /></th>
                  <th>INSPECTION <ChevronDown size={10} /></th>
                  <th>INVESTIGATION <ChevronDown size={10} /></th>
                  <th>ACTION <ChevronDown size={10} /></th>
                  <th>RESOLUTION <ChevronDown size={10} /></th>
                  <th>TAT <ChevronDown size={10} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" style={{ padding: '40px', textAlign: 'center' }}>
                      <Loader size={32} style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : workflowData.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No workflow records found.</td>
                  </tr>
                ) : (
                  workflowData.map((item) => (
                    <tr key={item.id}>
                      <td className="cell-cyan">{item.incident_ref}</td>
                      <td>{item.incident_group}</td>
                      <td>{item.reviewer_name || '--'}</td>
                      <td>{item.status}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.recorded_at)}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.reviewed_at)}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.inspected_at)}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.investigated_at)}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.action_completed_at)}</td>
                      <td className="cell-timestamp">{formatTimestamp(item.resolved_at)}</td>
                      <td className="cell-tat">
                        <Clock size={14} className="tat-clock-icon" />
                        {item.tat || '00:00:00'}
                      </td>
                      <td className="cell-actions-icon">
                        <MoreVertical size={16} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="workflow-footer">
            <button className="load-more-btn-workflow" disabled={loading} onClick={() => setPage(p => p + 1)}>LOAD MORE</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentWorkflow;
