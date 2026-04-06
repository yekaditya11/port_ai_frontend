import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  FilePlus,
  ClipboardList,
  Search,
  Eye,
  SearchCode,
  Zap,
  CheckCircle,
  GitBranch,
  Network,
  Files,
  FileSignature,
  Settings2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileX,
  FileSearch,
  FileText
} from 'lucide-react';
import './SubNavbar.css';

const SubNavbar = ({ style, onClose, menuType }) => {
  const scrollRef = useRef(null);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (label) => {
    if (menuType === 'Observation') {
      const routeMap = {
        'Dashboard': '/observation/dashboard',
        'New': '/observation/create-new-observation',
        'Listing': '/observation/listing',
        'Inspection': '/observation/inspection',
        'Closure': '/observation/closure',
        'Review': '/observation/review',
        'Action': '/observation/action',
        'Root Cause': '/observation/root-cause',
        'Analyser': '/observation/analyser',
        'Workflow': '/observation/workflow',
        'Observation Log': '/observation/observation-log',
        'Reports': '/observation/reports',
        'Density Report': '/observation/reports/density-report',
        'Observation List': '/observation/reports/observation-list',
        'Observer Performance': '/observation/reports/observer-performance',
        'Risk Forecast': '/observation/reports/risk-forecast',
        'Observation Trend': '/observation/reports/observation-trend',
        'Turnaround Time': '/observation/reports/turnaround-time',
        'Observation Action Report': '/observation/reports/observation-action-report',
        'Top Reporters': '/observation/reports/top-reporters',
        'Web Service Obs. Listing': '/observation/web-service-obs-listing',
        'Masters': '/observation/masters',
        'Configuration': '/observation/configuration'
      };
      if (routeMap[label]) navigate(routeMap[label]);
    } else {
      if (label === 'Dashboard') {
        navigate('/incident/dashboard');
      } else if (label === 'Trend Dashboard') {
        navigate('/incident/trend');
      } else if (label === 'New') {
        navigate('/incident/create-new-incident');
      } else if (label === 'Listing') {
        navigate('/incident/listing');
      } else if (label === 'Review') {
        navigate('/incident/review');
      } else if (label === 'Inspection') {
        navigate('/incident/inspection-listing');
      } else if (label === 'Investigation') {
        navigate('/incident/investigation');
      } else if (label === 'Root Cause') {
        navigate('/incident/root-cause-analysis');
      } else if (label === 'Resolution') {
        navigate('/incident/resolution');
      } else if (label === 'Action') {
        navigate('/incident/action');
      } else if (label === 'Workflow') {
        navigate('/incident/workflow');
      }
    }
    if (onClose) onClose();
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const incidentItems = [
    {
      icon: <LayoutDashboard size={24} />,
      label: 'Dashboard',
      active: location.pathname === '/incident/dashboard' || location.pathname === '/' || (!menuType && location.pathname === '/')
    },
    {
      icon: <LineChart size={24} />,
      label: 'Trend Dashboard',
      active: location.pathname === '/incident/trend'
    },
    { icon: <FilePlus size={24} />, label: 'New' },
    { icon: <ClipboardList size={24} />, label: 'Listing' },
    { icon: <Search size={24} />, label: 'Review' },
    { icon: <Eye size={24} />, label: 'Inspection' },
    { icon: <SearchCode size={24} />, label: 'Investigation' },
    { icon: <Zap size={24} />, label: 'Root Cause' },
    { icon: <CheckCircle size={24} />, label: 'Resolution' },
    { icon: <GitBranch size={24} />, label: 'Action' },
    { icon: <Network size={24} />, label: 'Workflow' },
    { icon: <Files size={24} />, label: 'Reports' },
    { icon: <FileSignature size={24} />, label: 'Masters' },
    { icon: <Settings2 size={24} />, label: 'Configuration' },
  ];

  const observationItems = [
    {
      icon: <LayoutDashboard size={24} />,
      label: 'Dashboard',
      active: location.pathname === '/observation/dashboard'
    },
    { icon: <FilePlus size={24} />, label: 'New', active: location.pathname === '/observation/create-new-observation' },
    { icon: <ClipboardList size={24} />, label: 'Listing', active: location.pathname === '/observation/listing' },
    { icon: <Eye size={24} />, label: 'Inspection', active: location.pathname === '/observation/inspection' },
    { icon: <FileX size={24} />, label: 'Closure', active: location.pathname === '/observation/closure' },
    { icon: <FileSearch size={24} />, label: 'Review', active: location.pathname === '/observation/review' },
    { icon: <GitBranch size={24} />, label: 'Action', active: location.pathname === '/observation/action' },
    { icon: <HelpCircle size={24} />, label: 'Root Cause', active: location.pathname === '/observation/root-cause' },
    { icon: <HelpCircle size={24} />, label: 'Analyser', active: location.pathname === '/observation/analyser' },
    { icon: <Network size={24} />, label: 'Workflow', active: location.pathname === '/observation/workflow' },
    { icon: <FileText size={24} />, label: 'Observation Log', active: location.pathname === '/observation/observation-log' },
    { icon: <Files size={24} />, label: 'Reports', active: location.pathname === '/observation/reports' },
    { icon: <FileSearch size={24} />, label: 'Web Service Obs. Listing', active: location.pathname === '/observation/web-service-obs-listing' },
    { icon: <FileSignature size={24} />, label: 'Masters', active: location.pathname === '/observation/masters' },
    { icon: <Settings2 size={24} />, label: 'Configuration', active: location.pathname === '/observation/configuration' },
  ];

  const navItems = menuType === 'Observation' ? observationItems : incidentItems;

  const reportsRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div className="sub-navbar-container" ref={containerRef} style={style}>
      <div className="sub-nav-arrow left" onClick={() => scroll('left')}>
        <ChevronLeft size={20} />
      </div>
      <div className="sub-navbar" ref={scrollRef}>
        {navItems.map((item, index) => (
          <div
            key={index}
            ref={item.label === 'Reports' ? reportsRef : null}
            className={`sub-nav-item ${item.active ? 'active' : ''}`}
            onClick={() => {
              if (item.label === 'Reports') {
                setIsReportsOpen(!isReportsOpen);
              } else {
                handleNav(item.label);
                setIsReportsOpen(false);
              }
            }}
          >
            <div className="icon-wrapper">
              {item.icon}
            </div>
            <span className="sub-nav-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="sub-nav-arrow right" onClick={() => scroll('right')}>
        <ChevronRight size={20} />
      </div>

      {isReportsOpen && (
        <div
          className="reports-dropdown"
          style={{
            left: reportsRef.current
              ? reportsRef.current.getBoundingClientRect().left + 'px'
              : '0px',
            top: containerRef.current
              ? containerRef.current.getBoundingClientRect().bottom + 'px'
              : 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            'Density Report', 'Observation List', 'Observer Performance',
            'Risk Forecast', 'Observation Trend', 'Turnaround Time',
            'Observation Action Report', 'Top Reporters'
          ].map((reportOption, i) => (
            <div
              key={i}
              className="reports-dropdown-item"
              onClick={() => {
                handleNav(reportOption);
                setIsReportsOpen(false);
              }}
            >
              {reportOption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubNavbar;
