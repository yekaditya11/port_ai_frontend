import { useState, useRef, useCallback, useEffect } from 'react';
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

  // ── Drag to Resize Chat Panel ──
  const [chatWidth, setChatWidth] = useState(420); // Default 420px
  const isResizingRef = useRef(false);

  const startResizing = useCallback(() => {
    isResizingRef.current = true;
    document.body.classList.add('is-resizing');
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    document.body.classList.remove('is-resizing');
  }, []);

  const resize = useCallback((e) => {
    if (!isResizingRef.current) return;
    
    let newWidth = window.innerWidth - e.clientX;
    const maxWidth = window.innerWidth * 0.5; // Max 50%
    const minWidth = 320; // Min 320px
    
    if (newWidth > maxWidth) newWidth = maxWidth;
    if (newWidth < minWidth) newWidth = minWidth;
    
    setChatWidth(newWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const toggleShelf = (open, top = 0, menuLabel = null) => {
    setIsShelfOpen(open);
    if (top) setShelfTop(top);
    if (menuLabel) setActiveMenu(menuLabel);
  };

  const toggleChat = () => setIsChatOpen((prev) => !prev);
 
  return (
    <div 
      className={`dashboard-layout ${isShelfOpen ? 'shelf-open' : ''} ${isChatOpen ? 'chat-open' : ''}`}
      style={{ '--dynamic-chat-width': `${chatWidth}px` }}
    >
      <Sidebar
        onToggleShelf={toggleShelf}
        isShelfOpen={isShelfOpen}
        activeMenu={activeMenu}
      />
      <div className="main-container">
        {isShelfOpen && <div className="shelf-backdrop" onClick={() => toggleShelf(false)} />}

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
        
        {/* ── Global Footer (Live Twin Theme) ── */}
        {isFullBleed && (
          <footer className="global-footer">
            <div className="f-left">Port Safety Digital Twin - v3.5.0</div>
            <div className="f-center">
               <span>AIS: <span className="green">Live</span></span>
               <span>CCTV: <span className="green">32/34</span></span>
               <span>IoT Sensors: <span className="green">316/350</span></span>
               <span>Hazmat Detect: <span className="green">Active</span></span>
               <span>Comms: <span className="green">Secure</span></span>
            </div>
            <div className="f-right">North Container Terminal - Port Klang</div>
          </footer>
        )}
      </div>

      {/* ── Slide-in Chat Panel ── */}
      <div className={`chat-panel ${isChatOpen ? 'chat-panel--open' : ''}`}>
        <div className="chat-resizer" onMouseDown={startResizing} />
        <ChatAI isPanel onClose={toggleChat} />
      </div>
    </div>
  );
};

export default DashboardLayout;
