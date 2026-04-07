import { 
  Eye, 
  FileText,
  Box,
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onToggleShelf, isShelfOpen, activeMenu }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: <Box size={20} />, label: 'Live Twin', path: '/digital-twin' },
    { icon: <Eye size={20} />, label: 'Observation', hasShelf: true },
    { icon: <FileText size={20} />, label: 'Incident Management', hasShelf: true },
  ];

  return (
    <aside className={`sidebar ${isShelfOpen ? 'is-locked' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-svg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
        </div>
        <span className="logo-text">PORT AI</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const isActive = activeMenu === item.label || (item.path && window.location.pathname === item.path);
          return (
            <button
              key={index}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onMouseEnter={(e) => {
                if (item.hasShelf) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onToggleShelf(true, rect.top, item.label);
                }
              }}
              onClick={(e) => {
                if (item.path) {
                  navigate(item.path);
                  return;
                }
                if (item.hasShelf) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onToggleShelf(true, rect.top, item.label);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.hasShelf && (
                <span className="nav-chevron">
                  {isShelfOpen && activeMenu === item.label ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
      </div>
    </aside>
  );
};

export default Sidebar;
