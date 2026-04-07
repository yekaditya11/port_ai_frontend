import React, { useState } from 'react';
import { 
  ChevronDown, MoreVertical
} from 'lucide-react';
import './ObservationConfiguration.css';

const ObservationConfiguration = () => {
  const [isToggled, setIsToggled] = useState(true);

  const configData = [
    {
      reviewer: [
        { name: "Craig Williams", id: "710" },
        { name: "Martin Debeloz", id: "104" },
        { name: "Ahmed Al Shawoosh", id: "625" },
        { name: "Saeed Alyammahi", id: "396" }
      ],
      closure: [
        { name: "Martin Debeloz", id: "104" },
        { name: "Craig Williams", id: "710" },
        { name: "Ahmed Al Shawoosh", id: "625" },
        { name: "Saeed Alyammahi", id: "396" }
      ],
      createdBy: { name: "MartinDebeloz", id: "104", date: "09 Apr 25 | 12:23" },
      lastModified: { name: "MartinDebeloz", id: "104", date: "22 Dec 25 | 11:13", progress: 100 }
    }
  ];

  return (
    <div className="obs-config-container">
      {/* Filters */}
      <div className="obs-config-filters">
        <div className="filter-row">
          <div className="config-filter-box">
            <label>Reviewer</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="config-filter-box">
            <label>Closure</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="config-filter-box">
            <label>Created By</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="config-filter-box">
            <label>Modified By</label>
            <div className="select-wrapper">
              <select className="filter-select"><option>Select</option></select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
          <div className="filter-actions-right">
            <button className="obs-config-search-btn">SEARCH</button>
            <span className="clear-search-text">Clear Search</span>
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="obs-config-sub-header">
        <span className="listing-count">Listing 1 - 1 Of 1</span>
        <div className="toggle-container">
          <div 
            className={`custom-toggle ${isToggled ? 'on' : 'off'}`} 
            onClick={() => setIsToggled(!isToggled)}
          >
            <span className="toggle-label">{isToggled ? 'ON' : 'OFF'}</span>
            <div className="toggle-knob"></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="obs-config-table-container">
        <table className="obs-config-table">
          <thead>
            <tr>
              <th>REVIEWER</th>
              <th>CLOSURE</th>
              <th>CREATED BY</th>
              <th>LAST MODIFIED BY</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {configData.map((row, index) => (
              <tr key={index}>
                <td className="multi-line-cell">
                  {row.reviewer.map((r, i) => (
                    <div key={i} className="user-entry">
                      <span className="user-name">{r.name}</span>
                      <span className="user-id">({r.id})</span>
                    </div>
                  ))}
                </td>
                <td className="multi-line-cell">
                  {row.closure.map((c, i) => (
                    <div key={i} className="user-entry">
                      <span className="user-name">{c.name}</span>
                      <span className="user-id">({c.id})</span>
                    </div>
                  ))}
                </td>
                <td>
                  <div className="modified-cell">
                    <div className="user-entry">
                      <span className="user-name">{row.createdBy.name}</span>
                      <span className="user-id">({row.createdBy.id})</span>
                    </div>
                    <div className="entry-date">{row.createdBy.date}</div>
                  </div>
                </td>
                <td>
                  <div className="modified-cell-with-progress">
                    <div className="modified-info">
                       <div className="user-entry">
                         <span className="user-name">{row.lastModified.name}</span>
                         <span className="user-id">({row.lastModified.id})</span>
                       </div>
                       <div className="entry-date">{row.lastModified.date}</div>
                    </div>
                    <div className="progress-circle-container">
                        <svg className="progress-svg" viewBox="0 0 36 36">
                          <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="circle" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <text x="18" y="20.35" className="percentage">100%</text>
                        </svg>
                    </div>
                  </div>
                </td>
                <td className="actions-cell">
                    <div className="row-actions">
                      <MoreVertical size={16} />
                      <ChevronDown size={16} />
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Action Button */}
      <button className="configure-fab">
        CONFIGURE
      </button>
    </div>
  );
};

export default ObservationConfiguration;
