import { useLocation } from 'react-router-dom';
import {
  ChevronRight,
  LayoutGrid,
  MessageSquare,
  Settings,
  Languages,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  // Dynamic Content Mapping
  let breadcrumbLast = "Dashboard";
  let pageTitle = "Dashboard";

  if (path.includes('/incident/trend')) {
    breadcrumbLast = "Trend";
    pageTitle = "Trend Dashboard";
  } else if (path.includes('/incident/create-new-incident')) {
    breadcrumbLast = "New";
    pageTitle = "New Incident";
  } else if (path.includes('/incident/listing')) {
    breadcrumbLast = "Listing";
    pageTitle = "Listing";
  } else if (path.includes('/incident/review')) {
    breadcrumbLast = "Review";
    pageTitle = "Review";
  } else if (path.includes('/incident/inspection-listing')) {
    breadcrumbLast = "Inspection Listing";
    pageTitle = "Inspection Listing";
  } else if (path.includes('/incident/investigation')) {
    breadcrumbLast = "Investigation";
    pageTitle = "Investigation";
  } else if (path.includes('/incident/root-cause-analysis')) {
    breadcrumbLast = "Root Cause Analysis";
    pageTitle = "Root Cause Analysis";
  } else if (path.includes('/incident/resolution')) {
    breadcrumbLast = "Resolution";
    pageTitle = "Resolution";
  } else if (path.includes('/incident/action')) {
    breadcrumbLast = "Action";
    pageTitle = "Action";
  } else if (path.includes('/incident/workflow')) {
    breadcrumbLast = "Workflow";
    pageTitle = "Workflow";
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumbs">
          <span>Home</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span>Incident Management</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="current">{breadcrumbLast}</span>
        </div>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <button className="icon-btn"><LayoutGrid size={20} /></button>
        <button className="icon-btn"><MessageSquare size={20} /></button>
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
