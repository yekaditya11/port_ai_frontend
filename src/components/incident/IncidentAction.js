import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Settings, 
  ChevronDown,
  Calendar,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import './IncidentAction.css';

const IncidentAction = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [actionsData, setActionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getActions({ page, page_size: 20 });
      setActionsData(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch actions:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

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
        <div className="incident-action-container">
          
          <div className="listing-toolbar">
            <div className="toolbar-filters">
              <FilterGroup label="Action ID" />
              <FilterGroup label="Module" value="Incident" />
              <FilterGroup label="Incident ID" />
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

          <div className="action-meta">
            <div className="results-count-action">
              {loading ? 'Loading...' : `Listing 1 - ${actionsData.length} OF ${total}`}
            </div>
            <div className="meta-right-action">
              <Search size={18} className="meta-icon-action" />
              <Settings size={18} className="meta-icon-action" />
            </div>
          </div>

          <div className="action-table-wrapper">
            <table className="action-table">
              <thead>
                <tr>
                  <th>ACTION ID <ChevronDown size={10} /></th>
                  <th>CREATED BY <ChevronDown size={10} /></th>
                  <th>CREATED ON <ChevronDown size={10} /></th>
                  <th>DESCRIPTION <ChevronDown size={10} /></th>
                  <th>MODULE <ChevronDown size={10} /></th>
                  <th>SOURCE ID <ChevronDown size={10} /></th>
                  <th>CA/PA <ChevronDown size={10} /></th>
                  <th>HIERARCHY OF CONTROL <ChevronDown size={10} /></th>
                  <th>PRIORITY <ChevronDown size={10} /></th>
                  <th>ACTION OWNER <ChevronDown size={10} /></th>
                  <th>DEPARTMENT <ChevronDown size={10} /></th>
                  <th>ACTION DUE DATE <ChevronDown size={10} /></th>
                  <th>STATUS <ChevronDown size={10} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="14" style={{ padding: '40px', textAlign: 'center' }}>
                      <Loader2 className="animate-spin" size={32} color="#22d3ee" style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : actionsData.length === 0 ? (
                  <tr>
                    <td colSpan="14" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No action records found.</td>
                  </tr>
                ) : (
                  actionsData.map((item) => (
                    <tr key={item.id}>
                      <td className="cell-cyan">{item.action_ref}</td>
                      <td>{item.created_by_name || '--'}</td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '--'}</td>
                      <td>{item.description}</td>
                      <td>{item.module || 'Incident'}</td>
                      <td className="cell-cyan">{item.incident_ref}</td>
                      <td>{item.ca_pa}</td>
                      <td>{item.hierarchy_control}</td>
                      <td>{item.priority}</td>
                      <td>{item.owner_name}</td>
                      <td>{item.department_name}</td>
                      <td>{item.due_date ? new Date(item.due_date).toLocaleDateString() : '--'}</td>
                      <td className={`status-cell ${item.status === 'Overdue' ? 'status-overdue' : 'status-progress'}`}>
                        {item.status}
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

          <div className="action-footer">
            <button className="load-more-btn-action" disabled={loading} onClick={() => setPage(p => p + 1)}>LOAD MORE</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentAction;
