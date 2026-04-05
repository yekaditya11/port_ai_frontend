import React from 'react';
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
import './IncidentListing.css'; // Reusing listing styles

const IncidentInvestigation = () => {
  const [expandedId, setExpandedId] = React.useState(null);
  const [showCalendar, setShowCalendar] = React.useState(false);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const incidents = [
    {
      id: 'INC03280780',
      title: 'Environmental Impact',
      category: 'Oil and fuel spillages',
      subCategory: 'Environment',
      date: '27 Mar 2026',
      time: '03:27:03',
      location: 'Bunkering Station',
      subLocation: 'Bunk station 1',
      context: 'Bulk Chemical Storage and Handling',
      contextDetail: 'Environmental Pollution',
      status: 'Inspection',
      severity: '2-Minor',
      severityType: 'minor',
      action: 'Inspection',
      actionTime: '08:22:22',
      details: {
        title: 'Bunkering Station - Environment - Environmental Impact - 2-Minor - 27/03/2026 - 03:27 - Martin Debeloz',
        shift: 'Shift 2',
        critical: 'Yes',
        reportedTo: '--',
        inspectedDateTime: '27 Mar 26 | 15:28',
        inspector: 'Martin Debeloz',
        investigationDateTime: '--',
        leadInvestigator: 'Martin Debeloz',
        reportedDateTime: '--',
        reportable: '--',
        shiftManager: 'Martin Debeloz (IDA)',
        actualSeverity: '2-Minor',
        potentialSeverity: '2-Minor',
        timeOfDay: 'Afternoon',
        weather: '--',
        classification: 'Work Related Incident',
        reportedBy: 'Martin Debeloz',
        recordable: '--'
      }
    },
    {
      id: 'INC03280779',
      title: 'Infrastructure Damage',
      category: 'Bad road surfaces and...',
      subCategory: 'Unspecified',
      date: '26 Mar 2026',
      time: '08:00:18',
      location: 'Admin. Building',
      subLocation: '--',
      context: 'Driving',
      contextDetail: 'Obstruction',
      status: 'Review',
      severity: '2-Minor',
      severityType: 'minor',
      action: 'Review',
      actionTime: '09:19:47',
      details: {
        title: 'Admin. Building - Other Incident - Infrastructure Damage - 2-Minor - 26/03/2026 - 08:00 - Martin Debeloz',
        shift: 'Shift 3',
        critical: 'No',
        reportedTo: '--',
        inspectedDateTime: '26 Mar 26 | 18:03',
        inspector: 'Martin Debeloz',
        investigationDateTime: '--',
        leadInvestigator: 'Martin Debeloz',
        reportedDateTime: '--',
        reportable: '--',
        shiftManager: 'Martin Debeloz (IDA)',
        actualSeverity: '2-Minor',
        potentialSeverity: '2-Minor',
        timeOfDay: 'Twilight',
        weather: '--',
        classification: 'Work Related Incident',
        reportedBy: 'Martin Debeloz',
        recordable: '--'
      }
    }
  ];

  const DetailRow = ({ label, value }) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-colon">:</span>
      <span className="detail-value">{value}</span>
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

  return (
    <div className="dashboard-layout-main" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Notice: No NEW INCIDENT button here as per mockup */}
      <div style={{ height: '30px' }}></div> 

      <div className="content-padding" style={{ paddingTop: '10px' }}>
        <div className="incident-listing-container">
          
          {/* Top Toolbar */}
          <div className="listing-toolbar">
            <div className="toolbar-filters">
              <FilterGroup label="Incident ID" />
              <FilterGroup label="Incident Type" />
              <FilterGroup label="Incident Group" />
              <FilterGroup label="Shift" />
              <div className="filter-group" style={{ position: 'relative', flex: '1.2' }} onClick={() => setShowCalendar(!showCalendar)}>
                 <div className="filter-inner">
                    <label className="filter-label">Date Range</label>
                    <div className="filter-value">7 Mar | 5 Apr</div>
                 </div>
                 <div className="date-icons">
                    <span className="clear-icon" style={{ fontSize: '14px', marginRight: '5px' }}>×</span>
                    <Calendar size={14} className="calendar-icon" />
                    <ChevronDown size={14} className="select-icon-relative" />
                 </div>
                 
                 {showCalendar && (
                   <div className="calendar-overlay">
                      <div className="calendar-header">
                        <span>‹</span>
                        <span>Apr - 2026</span>
                        <span>May - 2026</span>
                        <span>›</span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="month-grid">
                           <div className="days-header"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
                           <div className="days-grid">
                             {[...Array(30)].map((_, i) => (
                               <span key={i} className={(i > 5 && i < 15) ? 'day-range' : (i === 5 || i === 15) ? 'day-selected' : ''}>{i + 1}</span>
                             ))}
                           </div>
                        </div>
                        <div className="month-grid">
                           <div className="days-header"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
                           <div className="days-grid">
                             {[...Array(31)].map((_, i) => (
                               <span key={i}>{i + 1}</span>
                             ))}
                           </div>
                        </div>
                      </div>
                   </div>
                 )}
              </div>
              <button className="btn-search">SEARCH</button>
            </div>
          </div>

          {/* Results Meta */}
          <div className="listing-meta">
            <div className="results-count">Listing 1 - 10 OF 39</div>
            <div className="meta-actions">
              <Search size={18} />
              <Settings size={18} />
            </div>
          </div>

          {/* Incident List */}
          <div className="incident-list">
            {incidents.map((incident, index) => (
              <React.Fragment key={index}>
                <div className={`incident-card ${expandedId === incident.id ? 'is-expanded' : ''}`}>
                  
                  {/* ID & Title */}
                  <div className="card-column">
                    <div className="item-title">{incident.title}</div>
                    <div className="item-id">
                      {incident.id}
                      <Monitor size={14} />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="card-column">
                    <div className="item-label">{incident.category}</div>
                    <div className="item-value">{incident.subCategory}</div>
                  </div>

                  {/* Date Time */}
                  <div className="card-column">
                    <div className="item-label">{incident.date}</div>
                    <div className="item-value">{incident.time}</div>
                  </div>

                  {/* Location */}
                  <div className="card-column">
                    <div className="item-label">{incident.location}</div>
                    <div className="item-value">{incident.subLocation}</div>
                  </div>

                  {/* Context */}
                  <div className="card-column">
                    <div className="item-label">{incident.context}</div>
                    <div className="item-value">{incident.contextDetail}</div>
                  </div>

                  {/* Status & Severity */}
                  <div className="card-column">
                    <div className="status-label">
                      {incident.status}
                    </div>
                    {incident.severity && (
                      <div className={`severity-pill severity-${incident.severityType}`}>
                        {incident.severity}
                        <AlertTriangle size={12} fill={incident.severityType === 'major' ? '#ef4444' : '#f59e0b'} color="#fff" />
                      </div>
                    )}
                  </div>

                  {/* Action & Time */}
                  <div className="card-column" style={{ alignItems: 'flex-end' }}>
                    <div className="item-label" style={{ fontWeight: '700' }}>{incident.action}</div>
                    <div className="item-value" style={{ fontSize: '11px' }}>{incident.actionTime}</div>
                  </div>

                  {/* Menu */}
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

                {/* Expanded Detail Box */}
                {expandedId === incident.id && (
                  <div className="expanded-detail-box">
                    <div className="detail-grid">
                      <div className="detail-col">
                        <DetailRow label="Incident Title" value={incident.details.title} />
                        <DetailRow label="Shift" value={incident.details.shift} />
                        <DetailRow label="Critical Incident" value={incident.details.critical} />
                        <DetailRow label="Reported To" value={incident.details.reportedTo} />
                        <DetailRow label="Inspected Date & Time" value={incident.details.inspectedDateTime} />
                        <DetailRow label="Inspector" value={incident.details.inspector} />
                        <DetailRow label="Investigation Date & Time" value={incident.details.investigationDateTime} />
                        <DetailRow label="Lead Investigator" value={incident.details.leadInvestigator} />
                        <DetailRow label="Reported Date & Time" value={incident.details.reportedDateTime} />
                        <DetailRow label="Reportable" value={incident.details.reportable} />
                      </div>
                      <div className="detail-col">
                        <DetailRow label="Shift Manager" value={incident.details.shiftManager} />
                        <DetailRow label="Actual Severity" value={incident.details.actualSeverity} />
                        <DetailRow label="Potential Severity" value={incident.details.potentialSeverity} />
                        <DetailRow label="Time of Day" value={incident.details.timeOfDay} />
                        <DetailRow label="Weather" value={incident.details.weather} />
                        <DetailRow label="Work Activity Classification" value={incident.details.classification} />
                        <DetailRow label="Reported By" value={incident.details.reportedBy} />
                        <DetailRow label="Recordable" value={incident.details.recordable} />
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="load-more-container">
            <button className="load-more-btn">LOAD MORE</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentInvestigation;
