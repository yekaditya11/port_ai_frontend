import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, Search, MoreVertical
} from 'lucide-react';
import './ListReport.css';
import DateRangePicker from '../../common/DateRangePicker';
import { X } from 'lucide-react';

const ListReport = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filterDates, setFilterDates] = useState({
    from: '2026-06-01',
    to: '2026-05-04'
  });

  const reportData = [
    { 
      id: 'OBR/0326/3906', 
      date: '31 Mar 2026 | 16:16', 
      group: 'Assets',
      type: '--',
      description: 'Test description',
      observer: 'Martin Debeloz(104)',
      dept: 'Administration',
      designation: 'General Manager',
      area: 'Auxiliary facilities',
      closeDate: '--'
    },
    { 
      id: 'OBR/0326/3905', 
      date: '26 Mar 2026 | 18:04', 
      group: 'Assets',
      type: 'Unsafe Condition',
      description: '<p>During routine...',
      observer: 'Martin Debeloz(104)',
      dept: 'Administration',
      designation: 'General Manager',
      area: 'Cargo Loading Dock',
      closeDate: '--'
    },
    { 
      id: 'OBR/0326/3904', 
      date: '26 Mar 2026 | 16:49', 
      group: 'Assets',
      type: 'Unsafe Condition',
      description: '<p>During routine...',
      observer: 'Martin Debeloz(104)',
      dept: 'Administration',
      designation: 'General Manager',
      area: 'Container & General Cargo Berth',
      closeDate: '--'
    },
    { 
      id: 'OBR/0326/3903', 
      date: '26 Mar 2026 | 16:39', 
      group: 'Assets',
      type: 'Unsafe Condition',
      description: '<p>During routine...',
      observer: 'Martin Debeloz(104)',
      dept: 'Administration',
      designation: 'General Manager',
      area: 'Chemical Storage Area',
      closeDate: '--'
    },
    { 
      id: 'OBR/0326/3902', 
      date: '26 Mar 2026 | 16:38', 
      group: 'Assets',
      type: 'Unsafe Condition',
      description: '<p>During routine...',
      observer: 'Martin Debeloz(104)',
      dept: 'Administration',
      designation: 'General Manager',
      area: 'Container Berth',
      closeDate: '--'
    },
  ];

  return (
    <div className="list-report-container">
      {/* Filters Section */}
      <div className="list-report-filters-container">
        <div className="list-filter-row">
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
            <label>Observation Type</label>
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
          <div className="report-filter-box date-range-picker-trigger" style={{ flex: 1.5, position: 'relative' }} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
            <label>Date Range</label>
            <div className="date-input-wrapper">
              <span className="date-display-text">
                {filterDates.from ? new Date(filterDates.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '...'} | {filterDates.to ? new Date(filterDates.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '...'}
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <X size={14} className="date-icon" onClick={(e) => { e.stopPropagation(); setFilterDates({from: '', to: ''}); }} />
                <Calendar size={14} className="date-icon" />
              </div>
            </div>
            {isDatePickerOpen && (
              <DateRangePicker 
                startDate={filterDates.from ? new Date(filterDates.from) : null}
                endDate={filterDates.to ? new Date(filterDates.to) : null}
                onSelect={(start, end) => {
                  setFilterDates({
                    from: start ? start.toISOString().split('T')[0] : '',
                    to: end ? end.toISOString().split('T')[0] : ''
                  });
                }}
                onClose={() => setIsDatePickerOpen(false)}
              />
            )}
          </div>
          <div className="expand-toggle" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}>
            {isFiltersExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <button className="report-search-btn">SEARCH</button>
        </div>

        {isFiltersExpanded && (
          <div className="list-filter-row expanded-row">
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
              <label>Operational Activity</label>
              <div className="select-wrapper">
                <select className="filter-select"><option>Select</option></select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <div className="report-filter-box">
              <label>Risk Category</label>
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
      <div className="list-report-list-info">
        <span>Listing 1 - 10 Of 132</span>
        <div className="list-actions">
           <Search size={18} className="action-icon" />
           <div className="add-icon-circle">+</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="list-report-table-container">
        <div className="table-scroll-wrapper">
          <table className="list-report-table">
            <thead>
              <tr>
                <th className="id-col">OBSERVATION ID <span className="sort-arrows">↕</span></th>
                <th className="date-col">OBSERVATION DATE <span className="sort-arrows">↕</span></th>
                <th className="group-col">OBSERVATION GROUP <span className="sort-arrows">↕</span></th>
                <th className="type-col">OBSERVATION TYPE <span className="sort-arrows">↕</span></th>
                <th className="desc-col">OBSERVATION DESCRIPTION</th>
                <th className="observer-col">OBSERVER <span className="sort-arrows">↕</span></th>
                <th className="dept-col">OBSERVER DEPARTMENT <span className="sort-arrows">↕</span></th>
                <th className="desig-col">DESIGNATION <span className="sort-arrows">↕</span></th>
                <th className="area-col">AREA <span className="sort-arrows">↕</span></th>
                <th className="close-col">OBSERVATION CLOSE DATE <span className="sort-arrows">↕</span></th>
                <th className="actions-col"><MoreVertical size={16} /></th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td className="id-col highlight-id">{row.id}</td>
                  <td className="date-col text-muted">{row.date}</td>
                  <td className="group-col text-muted">{row.group}</td>
                  <td className="type-col text-muted">{row.type}</td>
                  <td className="desc-col text-muted">{row.description}</td>
                  <td className="observer-col text-muted">{row.observer}</td>
                  <td className="dept-col text-muted">{row.dept}</td>
                  <td className="desig-col text-muted">{row.designation}</td>
                  <td className="area-col text-muted">{row.area}</td>
                  <td className="close-col text-muted">{row.closeDate}</td>
                  <td className="actions-col"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
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

export default ListReport;
