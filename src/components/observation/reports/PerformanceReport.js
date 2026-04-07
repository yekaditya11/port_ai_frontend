import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, Search, MoreVertical
} from 'lucide-react';
import './PerformanceReport.css';

const PerformanceReport = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [fromDate, setFromDate] = useState('2026-01-06');
  const [toDate, setToDate] = useState('2026-04-06');

  const reportData = [
    { 
      id: 'OBR/0326/3906', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '31 Mar 2026 | 16:16', 
      area: 'Auxiliary facilities',
      category: 'Slip, Trip or Falls on Same Level',
      status: 'New'
    },
    { 
      id: 'OBR/0326/3905', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 18:04', 
      area: 'Cargo Loading Dock',
      category: 'Slip / Trip / Fall Same Level',
      status: 'Inspection'
    },
    { 
      id: 'OBR/0326/3904', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:49', 
      area: 'Container & General Cargo Berth',
      category: 'Vehicle Accident',
      status: 'Review'
    },
    { 
      id: 'OBR/0326/3903', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:39', 
      area: 'Chemical Storage Area',
      category: 'Vehicle Accident',
      status: 'Review'
    },
    { 
      id: 'OBR/0326/3902', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:38', 
      area: 'Container Berth',
      category: 'Slip / Trip / Fall Same Level',
      status: 'New'
    },
    { 
      id: 'OBR/0326/3901', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:35', 
      area: 'Auxiliary facilities',
      category: 'Fall Hazard',
      status: 'Review'
    },
    { 
      id: 'OBR/0326/3900', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:28', 
      area: 'Bunkering Station',
      category: 'Slip / Trip / Fall Same Level',
      status: 'Review'
    },
    { 
      id: 'OBR/0326/3899', 
      group: 'Assets',
      observer: 'Martin Debeloz(104)',
      date: '26 Mar 2026 | 16:17', 
      area: 'Cargo Loading Dock',
      category: 'Slip / Trip / Fall Same Level',
      status: 'Review'
    },
    { 
      id: 'OBR/0326/3898', 
      group: 'Fire and Explosion Safety',
      observer: 'Martin Debeloz(104)',
      date: '25 Mar 2026 | 19:01', 
      area: 'Bilge Facility',
      category: 'Equipment Failure',
      status: 'Inspection'
    },
    { 
      id: 'OBR/0326/3897', 
      group: 'Operations',
      observer: 'Martin Debeloz(104)',
      date: '25 Mar 2026 | 14:14', 
      area: 'Container Parking Yard',
      category: 'Operational Errors',
      status: 'New'
    },
  ];

  return (
    <div className="performance-report-container">
      {/* Filters Section */}
      <div className="performance-report-filters-container">
        <div className="performance-filter-row">
          <div className="performance-filter-box">
            <label>Group</label>
            <div className="performance-select-wrapper">
              <select className="performance-filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="performance-select-chevron" />
            </div>
          </div>
          <div className="performance-filter-box">
            <label>Area</label>
            <div className="performance-select-wrapper">
              <select className="performance-filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="performance-select-chevron" />
            </div>
          </div>
          <div className="performance-filter-box">
            <label>Status</label>
            <div className="performance-select-wrapper">
              <select className="performance-filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="performance-select-chevron" />
            </div>
          </div>
          <div className="performance-filter-box">
            <label>Category</label>
            <div className="performance-select-wrapper">
              <select className="performance-filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="performance-select-chevron" />
            </div>
          </div>
          <div className="performance-filter-box flex-33">
            <label>From Date</label>
            <div className="performance-date-input-wrapper">
              <input 
                type="date" 
                className="performance-date-input" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
              />
              <Calendar size={14} className="performance-date-icon" />
            </div>
          </div>
          <div className="performance-filter-box flex-33">
            <label>To Date</label>
            <div className="performance-date-input-wrapper">
              <input 
                type="date" 
                className="performance-date-input" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
              />
              <Calendar size={14} className="performance-date-icon" />
            </div>
          </div>
          <div className="performance-expand-toggle" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
            {isFiltersExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <button className="performance-report-search-btn">SEARCH</button>
        </div>

        {isFiltersExpanded && (
          <>
            <div className="performance-filter-row expanded-row">
              <div className="performance-filter-box">
                <label>Business Unit</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Observation Type</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Operational Activity</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Observer</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Inspected By</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Involved Person</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>All</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
            </div>
            <div className="performance-filter-row expanded-row">
              <div className="performance-filter-box">
                <label>Source</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div className="performance-filter-box">
                <label>Near Miss</label>
                <div className="performance-select-wrapper">
                  <select className="performance-filter-select"><option>Select</option></select>
                  <ChevronDown size={14} className="performance-select-chevron" />
                </div>
              </div>
              <div style={{ flex: 4 }}></div>
              <div className="performance-clear-search-container">
                 <span className="performance-clear-search-link">Clear Search</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* List Header */}
      <div className="performance-report-list-info">
        <span>Listing 1 - 10 Of 132</span>
        <div className="performance-list-actions">
           <Search size={18} className="performance-action-icon" />
           <div className="performance-add-icon-circle">+</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="performance-report-table-container">
        <div className="performance-table-scroll-wrapper">
          <table className="performance-report-table">
            <thead>
              <tr>
                <th className="perf-id-col">OBSERVATION ID <span className="sort-arrows">↕</span></th>
                <th className="perf-group-col">OBSERVATION GROUP <span className="sort-arrows">↕</span></th>
                <th className="perf-observer-col">OBSERVER <span className="sort-arrows">↕</span></th>
                <th className="perf-date-col">RECORDED DATE <span className="sort-arrows">↕</span></th>
                <th className="perf-area-col">AREA <span className="sort-arrows">↕</span></th>
                <th className="perf-cat-col">RISK CATEGORY <span className="sort-arrows">↕</span></th>
                <th className="perf-status-col">STATUS <span className="sort-arrows">↕</span></th>
                <th className="perf-actions-col"><MoreVertical size={16} /></th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td className="perf-id-col highlight-id">{row.id}</td>
                  <td className="perf-group-col text-muted">{row.group}</td>
                  <td className="perf-observer-col text-muted">{row.observer}</td>
                  <td className="perf-date-col text-muted">{row.date}</td>
                  <td className="perf-area-col text-muted">{row.area}</td>
                  <td className="perf-cat-col text-muted">{row.category}</td>
                  <td className="perf-status-col text-muted">{row.status}</td>
                  <td className="perf-actions-col"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="performance-load-more-container">
            <button className="performance-load-more-btn">LOAD MORE</button>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="performance-report-bottom-bar">
        <div style={{ flex: 1 }}></div>
        <button className="perf-bottom-btn perf-share-btn">SHARE</button>
        <button className="perf-bottom-btn perf-print-btn">PRINT</button>
      </div>
    </div>
  );
};

export default PerformanceReport;
