import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubNavbar from '../dashboard/SubNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [shelfTop, setShelfTop] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleShelf = (open, top = 0, menuLabel = null) => {
    setIsShelfOpen(open);
    if (top) setShelfTop(top);
    if (menuLabel) setActiveMenu(menuLabel);
  };

  return (
    <div className={`dashboard-layout ${isShelfOpen ? 'shelf-open' : ''}`}>
      {isShelfOpen && <div className="shelf-backdrop" onClick={() => toggleShelf(false)} />}
      <Sidebar 
        onToggleShelf={toggleShelf} 
        isShelfOpen={isShelfOpen}
        activeMenu={activeMenu}
      />
      <div className="main-container">
        <Header />
        {isShelfOpen && (
          <SubNavbar 
            style={{ top: shelfTop }} 
            onClose={() => toggleShelf(false)}
            menuType={activeMenu}
          />
        )}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
