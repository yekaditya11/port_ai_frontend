import React, { useState } from 'react';
import { 
  ChevronDown, Search, X, Settings, 
  MoreVertical, Info, LayoutGrid, Calendar,
  MessageSquare, Users, Globe, Bell, HelpCircle, Power
} from 'lucide-react';
import './ObservationAnalyzer.css';

const ObservationAnalyzer = () => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState('180 Days');
  const [listData, setListData] = useState([
    {
      id: "OBR/0326/3906",
      group: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "31 Mar 26",
      time: "16:16:12",
      bu: "Global Container Terminal",
      area: "Auxiliary facilities",
      firstDim: "--",
      secondDim: "--",
      keyFailure: "--"
    },
    {
      id: "OBR/0326/3905",
      group: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "26 Mar 26",
      time: "18:04:44",
      bu: "Global Container Terminal",
      area: "Cargo Loading Dock",
      firstDim: "--",
      secondDim: "--",
      keyFailure: "--"
    },
    {
      id: "OBR/0326/3904",
      group: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "26 Mar 26",
      time: "16:44:06",
      bu: "Global Container Terminal",
      area: "Container & General...",
      firstDim: "--",
      secondDim: "--",
      keyFailure: "--"
    },
    {
      id: "OBR/0326/3903",
      group: "Assets",
      name: "Martin Debeloz",
      role: "General Manager",
      date: "26 Mar 26",
      time: "16:39:33",
      bu: "Global Container Terminal",
      area: "Chemical Storage Area",
      firstDim: "--",
      secondDim: "--",
      keyFailure: "--"
    },
    {
        id: "OBR/0326/3900",
        group: "Assets",
        name: "Martin Debeloz",
        role: "General Manager",
        date: "26 Mar 26",
        time: "16:28:21",
        bu: "Global Container Terminal",
        area: "Bunkering Station",
        firstDim: "--",
        secondDim: "--",
        keyFailure: "--"
    }
  ]);

  const dateOptions = ['15 Days', '30 Days', '60 Days', '90 Days', '180 Days'];

  return (
    <div className="obs-analyzer-container">


      {/* Filter Section */}
      <div className="obs-analyzer-filters">
        <div className="analyzer-filter-box">
          <label>Observation Group</label>
          <div className="select-wrapper">
            <select className="filter-select">
              <option>Select</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <div className="analyzer-filter-box">
          <label>Area</label>
          <div className="select-wrapper">
            <select className="filter-select">
              <option>Select</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <div className="analyzer-filter-box">
          <label>Category</label>
          <div className="select-wrapper">
            <select className="filter-select">
              <option>Select</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <div className="analyzer-filter-box">
          <label>Business Unit</label>
          <div className="select-wrapper">
            <select className="filter-select">
              <option>Select</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <div className="analyzer-filter-box">
          <label>Status</label>
          <div className="select-wrapper">
            <select className="filter-select">
              <option>Select</option>
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>
        <div className="analyzer-filter-box date-range-group">
          <label>Date Range</label>
          <div className="date-range-dropdown-trigger" onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}>
            <span>{dateRange}</span>
            <div className="date-range-actions">
              <X size={14} className="clear-icon" onClick={(e) => { e.stopPropagation(); setDateRange('Select'); }} />
              <ChevronDown size={14} />
            </div>
            {isDateDropdownOpen && (
              <div className="date-range-options">
                {dateOptions.map(opt => (
                  <div key={opt} className="date-range-opt" onClick={() => { setDateRange(opt); setIsDateDropdownOpen(false); }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="obs-analyzer-search-btn">SEARCH</button>
      </div>

      {/* List Header */}
      <div className="obs-analyzer-list-info">
        <span>Listing 1 - {listData.length} Of 161</span>
        <Settings size={18} className="settings-icon" />
      </div>

      {/* List Content */}
      <div className="obs-analyzer-list">
        {listData.map((row, index) => (
          <div key={index} className="analyzer-row">
            <div className="row-main-info">
              <div className="row-col-1">
                <span className="row-group">{row.group}</span>
                <span className="row-id">{row.id}</span>
              </div>
              <div className="row-col-2">
                <span className="row-name">{row.name}</span>
                <span className="row-role">{row.role}</span>
              </div>
              <div className="row-col-3">
                <span className="row-date">{row.date}</span>
                <span className="row-time">{row.time}</span>
              </div>
              <div className="row-col-4">
                <span className="row-bu">{row.bu}</span>
                <span className="row-area">{row.area}</span>
              </div>
            </div>
            
            <div className="row-dimension-inputs">
              <div className="analyzer-filter-box dim-box">
                <label>First Dimension</label>
                <div className="select-wrapper">
                  <select className="filter-select">
                    <option>--</option>
                  </select>
                  <ChevronDown size={12} className="select-chevron" />
                </div>
              </div>
              <div className="analyzer-filter-box dim-box">
                <label>Second Dimension</label>
                <div className="select-wrapper">
                  <select className="filter-select">
                    <option>--</option>
                  </select>
                  <ChevronDown size={12} className="select-chevron" />
                </div>
              </div>
              <div className="analyzer-filter-box dim-box">
                <label>Key Failure</label>
                <div className="select-wrapper">
                  <select className="filter-select">
                    <option>--</option>
                  </select>
                  <ChevronDown size={12} className="select-chevron" />
                </div>
              </div>
            </div>

            <div className="row-actions">
              <Info size={16} className="info-icon" />
              <MoreVertical size={16} className="more-icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="obs-analyzer-footer">
        <button className="load-more-btn">LOAD MORE</button>
        <button className="report-btn">REPORT</button>
      </div>
    </div>
  );
};

export default ObservationAnalyzer;
