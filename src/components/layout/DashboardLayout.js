import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubNavbar from '../dashboard/SubNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [shelfTop, setShelfTop] = useState(0);

  const toggleShelf = (open, top = 0) => {
    setIsShelfOpen(open);
    if (top) setShelfTop(top);
  };

  return (
    <div className={`dashboard-layout ${isShelfOpen ? 'shelf-open' : ''}`}>
      {isShelfOpen && <div className="shelf-backdrop" onClick={() => setIsShelfOpen(false)} />}
      <Sidebar 
        onToggleShelf={toggleShelf} 
        isShelfOpen={isShelfOpen}
      />
      <div className="main-container">
        <Header />
        {isShelfOpen && (
          <SubNavbar 
            style={{ top: shelfTop }} 
            onClose={() => toggleShelf(false)} 
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
