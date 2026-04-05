import React from 'react';
import StatGridTrend from './StatGridTrend';
import SeverityChart from './SeverityChart';
import RootCauseChart from './RootCauseChart';
import EquipmentDamageList from './EquipmentDamageList';
import IncidentTrendChart from './IncidentTrendChart';
import Top5IncidentsList from './Top5IncidentsList';
import { Calendar, ChevronDown } from 'lucide-react';
import './TrendDashboard.css';

const TrendDashboard = () => {
  return (
    <div className="dashboard-view trend-view">
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <h2 className="title-text">Trend</h2>
        </div>
        
        <div className="toolbar-right">
          <div className="toggle-container">
            <span className="toggle-label dashboard-label">Dashboard</span>
            <div className="toggle-switch">
              <div className="switch-knob active"></div>
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

      <StatGridTrend />

      <div className="trend-grid">
        <div className="trend-item severity-box">
          <SeverityChart />
        </div>
        <div className="trend-item rootcause-box">
          <RootCauseChart />
        </div>
        <div className="trend-item equipment-box">
          <EquipmentDamageList />
        </div>
        <div className="trend-item trendchart-box">
          <IncidentTrendChart />
        </div>
        <div className="trend-item top5-box">
          <Top5IncidentsList />
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;
