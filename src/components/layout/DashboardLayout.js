import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubNavbar from '../dashboard/SubNavbar';
import ChatAI from '../chat/ChatAI';
import { useLocation } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [shelfTop, setShelfTop] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const isFullBleed = location.pathname === '/digital-twin';

  const toggleShelf = (open, top = 0, menuLabel = null) => {
    setIsShelfOpen(open);
    if (top) setShelfTop(top);
    if (menuLabel) setActiveMenu(menuLabel);
  };

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <div className={`dashboard-layout ${isShelfOpen ? 'shelf-open' : ''} ${isChatOpen ? 'chat-open' : ''}`}>
      {isShelfOpen && <div className="shelf-backdrop" onClick={() => toggleShelf(false)} />}
      <Sidebar
        onToggleShelf={toggleShelf}
        isShelfOpen={isShelfOpen}
        activeMenu={activeMenu}
      />
      <div className="main-container">
        <Header onToggleChat={toggleChat} isChatOpen={isChatOpen} />
        {isShelfOpen && (
          <SubNavbar
            style={{ top: shelfTop }}
            onClose={() => toggleShelf(false)}
            menuType={activeMenu}
          />
        )}
        <main className={`content ${isFullBleed ? 'no-padding' : ''}`}>
          {children}
        </main>
      </div>

      {/* ── Slide-in Chat Panel ── */}
      <div className={`chat-panel ${isChatOpen ? 'chat-panel--open' : ''}`}>
        <ChatAI isPanel onClose={toggleChat} />
      </div>
    </div>
  );
};

export default DashboardLayout;
