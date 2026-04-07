import { useLocation } from 'react-router-dom';
import {
  ChevronRight,
  LayoutGrid,
  Settings,
  Languages,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import './Header.css';

const Header = ({ onToggleChat, isChatOpen }) => {
  const location = useLocation();
  const path = location.pathname;

  // Dynamic Content Mapping
  let breadcrumbMid = "Incident Management";
  let breadcrumbLast = "Dashboard";
  let pageTitle = "Dashboard";

  if (path.includes('/observation/')) {
    breadcrumbMid = "Observation";
    if (path.includes('/dashboard')) {
      breadcrumbLast = "Dashboard";
      pageTitle = "Dashboard";
    } else if (path.includes('/create-new-observation')) {
      breadcrumbLast = "New";
      pageTitle = "New Observation";
    } else if (path.includes('/listing')) {
      breadcrumbLast = "Listing";
      pageTitle = "Listing";
    } else if (path.includes('/inspection')) {
      breadcrumbLast = "Inspection";
      pageTitle = "Inspection";
    } else if (path.includes('/closure')) {
      breadcrumbLast = "Closure";
      pageTitle = "Closure";
    } else if (path.includes('/review')) {
      breadcrumbLast = "Review";
      pageTitle = "Review";
    } else if (path.includes('/action')) {
      breadcrumbLast = "Action";
      pageTitle = "Action";
    } else if (path.includes('/root-cause')) {
      breadcrumbLast = "Root Cause";
      pageTitle = "Root Cause";
    } else if (path.includes('/analyser')) {
      breadcrumbLast = "Analyzer";
      pageTitle = "Analyzer";
    } else if (path.includes('/workflow')) {
      breadcrumbLast = "Workflow";
      pageTitle = "Workflow";
    } else if (path.includes('/observation-log')) {
      breadcrumbLast = "Observation Log";
      pageTitle = "Observation Log";
    } else if (path.includes('/reports/density-report')) {
      breadcrumbLast = "Reports > Density Report";
      pageTitle = "Density Report";
    } else if (path.includes('/reports/observation-list')) {
      breadcrumbLast = "Reports > List Report";
      pageTitle = "List Report";
    } else if (path.includes('/reports/observer-performance')) {
      breadcrumbLast = "Reports > Performance Report";
      pageTitle = "Performance Report";
    } else if (path.includes('/configuration')) {
      breadcrumbLast = "Configuration";
      pageTitle = "Configuration";
    }
  } else if (path === '/chat-ai') {
    breadcrumbMid = 'Chat AI';
    breadcrumbLast = 'Assistant';
    pageTitle = 'Chat AI';
  } else if (path.includes('/incident/')) {
    breadcrumbMid = "Incident Management";
    if (path.includes('/trend')) {
      breadcrumbLast = "Trend";
      pageTitle = "Trend Dashboard";
    } else if (path.includes('/create-new-incident')) {
      breadcrumbLast = "New";
      pageTitle = "New Incident";
    } else if (path.includes('/listing')) {
      breadcrumbLast = "Listing";
      pageTitle = "Listing";
    } else if (path.includes('/review')) {
      breadcrumbLast = "Review";
      pageTitle = "Review";
    } else if (path.includes('/inspection-listing')) {
      breadcrumbLast = "Inspection Listing";
      pageTitle = "Inspection Listing";
    } else if (path.includes('/investigation')) {
      breadcrumbLast = "Investigation";
      pageTitle = "Investigation";
    } else if (path.includes('/root-cause-analysis')) {
      breadcrumbLast = "Root Cause Analysis";
      pageTitle = "Root Cause Analysis";
    } else if (path.includes('/resolution')) {
      breadcrumbLast = "Resolution";
      pageTitle = "Resolution";
    } else if (path.includes('/action')) {
      breadcrumbLast = "Action";
      pageTitle = "Action";
    } else if (path.includes('/workflow')) {
      breadcrumbLast = "Workflow";
      pageTitle = "Workflow";
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumbs">
          <span>Home</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span>{breadcrumbMid}</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="current">{breadcrumbLast}</span>
        </div>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <button className="icon-btn"><LayoutGrid size={20} /></button>
        <button
          className={`icon-btn chat-toggle-btn ${isChatOpen ? 'chat-toggle-btn--active' : ''}`}
          onClick={onToggleChat}
          title="Chat AI"
        >
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <button className="icon-btn"><Settings size={20} /></button>
        <button className="icon-btn"><Languages size={20} /> <span className="btn-label">A Z</span></button>
        <button className="icon-btn badge-container">
          <Bell size={20} />
          <span className="badge">99+</span>
        </button>
        <button className="icon-btn"><HelpCircle size={20} /></button>
        <button className="icon-btn"><LogOut size={20} /></button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Martin Debaloz</span>
            <span className="user-role">General Manager</span>
          </div>
          <div className="user-avatar">MD</div>
          <ChevronDown size={14} className="user-dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
