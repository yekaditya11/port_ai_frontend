import React from 'react';
import StatGrid from './StatGrid';
import IncidentTypeChart from './IncidentTypeChart';
import WorkAreaList from './WorkAreaList';
import OverviewTable from './OverviewTable';
import AccidentsChart from './AccidentsChart';
import StatusChart from './StatusChart';
import { Calendar, ChevronDown } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-view">
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <h2 className="title-text">Incident Management</h2>
        </div>
        
        <div className="toolbar-right">
          <div className="toggle-container">
            <span className="toggle-label dashboard-label">Dashboard</span>
            <div className="toggle-switch">
              <div className="switch-knob"></div>
            </div>
            <span className="toggle-label report-label">Report</span>
          </div>

          <div className="filter-group">
            <div className="select-btn">
              <span className="filter-label">View By</span>
              <span className="filter-value">30 Days</span>
              <ChevronDown size={14} className="filter-chevron" />
            </div>
          </div>

          <div className="date-picker-btn">
             <div className="date-label">Date Range</div>
             <div className="date-value">
               <span>7 Mar | 5 Apr</span>
               <Calendar size={14} className="calendar-icon" />
             </div>
          </div>
        </div>
      </div>

      <StatGrid />

      <div className="dashboard-row top-row">
        <div className="col-4">
          <IncidentTypeChart />
        </div>
        <div className="col-4">
          <WorkAreaList />
        </div>
        <div className="col-4">
          <OverviewTable />
        </div>
      </div>

      <div className="dashboard-row bottom-row">
        <div className="col-6">
          <AccidentsChart />
        </div>
        <div className="col-6">
          <StatusChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
