import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, Search, MoreVertical
} from 'lucide-react';
import './DensityReport.css';

const DensityReport = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [fromDate, setFromDate] = useState('2026-06-01');
  const [toDate, setToDate] = useState('2026-05-04');

  const reportData = [
    { id: 'OBR/0326/3906', date: '31 Mar 2026 | 16:16', area: 'Auxiliary facilities' },
    { id: 'OBR/0326/3905', date: '26 Mar 2026 | 18:04', area: 'Cargo Loading Dock' },
    { id: 'OBR/0326/3904', date: '26 Mar 2026 | 16:49', area: 'Container & General Cargo Berth' },
    { id: 'OBR/0326/3903', date: '26 Mar 2026 | 16:39', area: 'Chemical Storage Area' },
    { id: 'OBR/0326/3902', date: '26 Mar 2026 | 16:38', area: 'Container Berth' },
    { id: 'OBR/0326/3901', date: '26 Mar 2026 | 16:35', area: 'Auxiliary facilities' },
    { id: 'OBR/0326/3900', date: '26 Mar 2026 | 16:28', area: 'Bunkering Station' },
    { id: 'OBR/0326/3099', date: '26 Mar 2026 | 16:17', area: 'Cargo Loading Dock' },
    { id: 'OBR/0326/3098', date: '25 Mar 2026 | 19:01', area: 'Bilge Facility' },
    { id: 'OBR/0326/3897', date: '25 Mar 2026 | 14:14', area: 'Container Parking Yard' },
  ];

  return (
    <div className="density-report-container">
      {/* Filters Section */}
      <div className="density-report-filters-container">
        <div className="filter-row">
          <div className="report-filter-box">
            <label>Observation ID</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="report-filter-box">
            <label>Department</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="report-filter-box">
            <label>Operational Activity</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="report-filter-box">
            <label>Status</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="report-filter-box flex-33">
            <label>From Date</label>
            <div className="date-input-wrapper">
              <input 
                type="date" 
                className="date-input" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
              />
              <Calendar size={14} className="date-icon" />
            </div>
          </div>
          <div className="report-filter-box flex-33">
            <label>To Date</label>
            <div className="date-input-wrapper">
              <input 
                type="date" 
                className="date-input" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
              />
              <Calendar size={14} className="date-icon" />
            </div>
          </div>
          <div className="expand-toggle" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
            {isFiltersExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <button className="report-search-btn">SEARCH</button>
        </div>

        {isFiltersExpanded && (
          <div className="filter-row expanded-row">
            <div className="report-filter-box">
              <label>Business Unit</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Area</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Observation Group</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Observation Type</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Near Miss</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Source</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="clear-search-container">
               <span className="clear-search-link">Clear Search</span>
            </div>
          </div>
        )}
      </div>

      {/* List Header */}
      <div className="density-report-list-info">
        <span>Listing 1 - 10 Of 132</span>
        <div className="list-actions">
           <Search size={18} className="action-icon" />
           {/* Add icon */}
           <div className="add-icon-circle">+</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="density-report-table-container">
        <table className="density-report-table">
          <thead>
            <tr>
              <th className="id-col">OBSERVATION ID <span className="sort-arrows">↕</span></th>
              <th className="date-col">RECORDED DATE <span className="sort-arrows">↕</span></th>
              <th className="area-col">AREA <span className="sort-arrows">↕</span></th>
              <th className="actions-col"><MoreVertical size={16} /></th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index}>
                <td className="id-col highlight-id">{row.id}</td>
                <td className="date-col text-muted">{row.date}</td>
                <td className="area-col text-muted">{row.area}</td>
                <td className="actions-col"></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="load-more-container">
            <button className="load-more-btn">LOAD MORE</button>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="report-bottom-bar">
        <button className="bottom-btn share-btn">SHARE</button>
        <button className="bottom-btn print-btn">PRINT</button>
      </div>
    </div>
  );
};

export default DensityReport;
