import { useRef } from 'react';
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
  ChevronRight
} from 'lucide-react';
import './SubNavbar.css';

const SubNavbar = ({ style, onClose }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (label) => {
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

  const navItems = [
    { 
      icon: <LayoutDashboard size={24} />, 
      label: 'Dashboard', 
      active: location.pathname === '/incident/dashboard' || location.pathname === '/'
    },
    { 
      icon: <LineChart size={24} />, 
      label: 'Trend Dashboard',
      active: location.pathname === '/incident/trend'
    },
    { icon: <FilePlus size={24} />, label: 'New', active: location.pathname === '/incident/create-new-incident' },
    { icon: <ClipboardList size={24} />, label: 'Listing', active: location.pathname === '/incident/listing' },
    { icon: <Search size={24} />, label: 'Review', active: location.pathname === '/incident/review' },
    { icon: <Eye size={24} />, label: 'Inspection', active: location.pathname === '/incident/inspection-listing' },
    { icon: <SearchCode size={24} />, label: 'Investigation', active: location.pathname === '/incident/investigation' },
    { icon: <Zap size={24} />, label: 'Root Cause', active: location.pathname === '/incident/root-cause-analysis' },
    { icon: <CheckCircle size={24} />, label: 'Resolution', active: location.pathname === '/incident/resolution' },
    { icon: <GitBranch size={24} />, label: 'Action', active: location.pathname === '/incident/action' },
    { icon: <Network size={24} />, label: 'Workflow', active: location.pathname === '/incident/workflow' },
    { icon: <Files size={24} />, label: 'Reports' },
    { icon: <FileSignature size={24} />, label: 'Masters' },
    { icon: <Settings2 size={24} />, label: 'Configuration' },
  ];

  return (
    <div className="sub-navbar-container" style={style}>
      <div className="sub-nav-arrow left" onClick={() => scroll('left')}>
        <ChevronLeft size={20} />
      </div>
      <div className="sub-navbar" ref={scrollRef}>
        {navItems.map((item, index) => (
          <div 
            key={index} 
            className={`sub-nav-item ${item.active ? 'active' : ''}`}
            onClick={() => handleNav(item.label)}
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
    </div>
  );
};

export default SubNavbar;
