import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Compass,
  Zap,
  AlertCircle
} from 'lucide-react';
import './Header.css';

const Header = ({ onToggleChat, isChatOpen }) => {
  const location = useLocation();
  const path = location.pathname;
  const isDigitalTwin = path === '/digital-twin';

  // State to track view mode in header for UI feedback
  const [viewMode, setViewMode] = useState('live');

  const handleViewChange = (mode) => {
    setViewMode(mode);
    window.dispatchEvent(new CustomEvent('dt-view-change', { detail: mode }));
  };

  // Dynamic Content Mapping
  let breadcrumbMid = "Incident Management";
  let pageTitle = "Dashboard";

  if (path.includes('/observation/')) {
    breadcrumbMid = "Observation";
    if (path.includes('/dashboard')) {
      pageTitle = "Dashboard";
    } else if (path.includes('/create-new-observation')) {
      pageTitle = "New Observation";
    } else if (path.includes('/listing')) {
      pageTitle = "Listing";
    } else if (path.includes('/inspection')) {
      pageTitle = "Inspection";
    } else if (path.includes('/closure')) {
      pageTitle = "Closure";
    } else if (path.includes('/review')) {
      pageTitle = "Review";
    } else if (path.includes('/action')) {
      pageTitle = "Action";
    } else if (path.includes('/root-cause')) {
      pageTitle = "Root Cause";
    } else if (path.includes('/analyser')) {
      pageTitle = "Analyzer";
    } else if (path.includes('/workflow')) {
      pageTitle = "Workflow";
    } else if (path.includes('/observation-log')) {
      pageTitle = "Observation Log";
    } else if (path.includes('/reports/density-report')) {
      pageTitle = "Density Report";
    } else if (path.includes('/reports/observation-list')) {
      pageTitle = "List Report";
    } else if (path.includes('/reports/observer-performance')) {
      pageTitle = "Performance Report";
    } else if (path.includes('/configuration')) {
      pageTitle = "Configuration";
    }
  } else if (path === '/chat-ai') {
    breadcrumbMid = 'Chat AI';
    pageTitle = 'Chat AI';
  } else if (path === '/digital-twin') {
    breadcrumbMid = 'Digital Twin';
    pageTitle = 'Live Twin Dashboard';
  } else if (path.includes('/incident/')) {
    breadcrumbMid = "Incident Management";
    if (path.includes('/trend')) {
      pageTitle = "Trend Dashboard";
    } else if (path.includes('/create-new-incident')) {
      pageTitle = "New Incident";
    } else if (path.includes('/listing')) {
      pageTitle = "Listing";
    } else if (path.includes('/review')) {
      pageTitle = "Review";
    } else if (path.includes('/inspection-listing')) {
      pageTitle = "Inspection Listing";
    } else if (path.includes('/investigation')) {
      pageTitle = "Investigation";
    } else if (path.includes('/root-cause-analysis')) {
      pageTitle = "Root Cause Analysis";
    } else if (path.includes('/resolution')) {
      pageTitle = "Resolution";
    } else if (path.includes('/action')) {
      pageTitle = "Action";
    } else if (path.includes('/workflow')) {
      pageTitle = "Workflow";
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumbs">
          <span className="breadcrumb-root">Home</span>
          <span className="breadcrumb-slash">/</span>
          <span className="breadcrumb-mid">{breadcrumbMid}</span>
          <span className="breadcrumb-slash">/</span>
          <span className="breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="header-right">
        {/* ── DIGITAL TWIN VIEW TABS (MOVED TO RIGHT) ── */}
        {isDigitalTwin && (
          <div className="header-view-tabs">
              <button 
                className={`view-tab ${viewMode === 'live' ? 'active' : ''}`}
                onClick={() => handleViewChange('live')}
              >
                  <Compass size={14} />
                  <span>Live Twin</span>
              </button>
              <button 
                className={`view-tab ${viewMode === 'ops' ? 'active' : ''}`}
                onClick={() => handleViewChange('ops')}
              >
                  <Zap size={14} />
                  <span>Ops Heatmap</span>
              </button>
              <button 
                className={`view-tab ${viewMode === 'risk' ? 'active' : ''}`}
                onClick={() => handleViewChange('risk')}
              >
                  <AlertCircle size={14} />
                  <span>Risk Heatmap</span>
              </button>
          </div>
        )}

        <button
          className={`icon-btn chat-toggle-btn ${isChatOpen ? 'chat-toggle-btn--active' : ''}`}
          onClick={onToggleChat}
          title="Chat AI Assistant"
        >
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2 
                 C 14 2, 14.4 9.2, 19.8 14 
                 C 14.4 18.8, 14 26, 14 26 
                 C 14 26, 13.6 18.8, 8.2 14 
                 C 13.6 9.2, 14 2, 14 2 Z"
              fill="currentColor"
            />
            <path
              d="M2 14 
                 C 2 14, 9.2 14.4, 14 19.8 
                 C 14 13.6, 26 14, 26 14 
                 C 26 14, 18.8 13.6, 14 8.2 
                 C 9.2 13.6, 2 14, 2 14 Z"
              fill="currentColor"
              opacity="0.65"
            />
          </svg>
        </button>
        
        <button className="icon-btn badge-container" title="Notifications">
          <Bell size={18} />
          <span className="badge-dot" />
        </button>

        <div className="user-profile-pill">
          <div className="user-avatar">MD</div>
          <div className="user-info">
            <span className="user-name">Martin Debaloz</span>
            <span className="user-role">General Manager</span>
          </div>
          <ChevronDown size={14} className="user-dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
