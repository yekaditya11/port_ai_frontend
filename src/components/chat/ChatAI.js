import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ArrowUp, AlertCircle, X, ChevronLeft, BarChart2, Table } from 'lucide-react';
import { api } from '../../services/api';
import ChatbotChart from './ChatbotChart';
import './ChatAI.css';

/* ── Gemini Logo ── */
const GeminiLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="geminiGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4f6ef7" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <path
      d="M14 1
         C 14 1, 14.5 8.5, 20.5 14
         C 14.5 19.5, 14 27, 14 27
         C 14 27, 13.5 19.5, 7.5 14
         C 13.5 8.5, 14 1, 14 1 Z"
      fill="url(#geminiGrad)"
    />
    <path
      d="M1 14
         C 1 14, 8.5 14.5, 14 20.5
         C 14 14.5, 27 14, 27 14
         C 27 14, 19.5 13.5, 14 7.5
         C 8.5 13.5, 1 14, 1 14 Z"
      fill="url(#geminiGrad)"
      opacity="0.7"
    />
  </svg>
);

/* ── Suggestion chips ── */
const SUGGESTIONS = [
  {
    highlighted: 'safety events',
    text: 'How many safety events were reported today?',
  },
  {
    highlighted: 'latest incidents and observations',
    text: 'Show me the latest incidents and observations.',
  },
  {
    highlighted: 'observations events',
    text: 'Which areas have the most observations events',
  },
  {
    highlighted: 'near miss observations',
    text: 'How many near miss observations do we have?',
  },
  {
    highlighted: 'OBS471813435',
    text: 'Explain observation OBS471813435 in simple terms.',
  },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Renders a data table from the API response ── */
const ResponseTable = ({ table }) => {
  if (!table || !table.columns || !table.rows) return null;
  return (
    <div className="chat-table-wrapper">
      <table className="chat-table">
        <thead>
          <tr>
            {table.columns.map((col, i) => (
              <th key={i}>{col.replace(/_/g, ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ── Text streaming effect ── */
const TypewriterText = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      if (onComplete) onComplete();
      return;
    }
    
    let index = 0;
    setDisplayedText('');
    const messagesContainer = document.querySelector('.chat-messages');

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      
      // Auto-scroll the container as text streams naturally
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

/* ── Renders the AI message content based on response_type ── */
const AIMessageContent = ({ msg }) => {
  const [activeView, setActiveView] = useState('chart');
  const [isTypingComplete, setIsTypingComplete] = useState(!msg.answer);

  // User message — plain text
  if (msg.role === 'user') {
    return <span>{msg.content}</span>;
  }

  // Error message
  if (msg.isError) {
    return (
      <div className="chat-error-content">
        <AlertCircle size={15} />
        <span>{msg.content}</span>
      </div>
    );
  }

  const { response_type, answer, table } = msg;

  const isValidChart = !!(msg.chart && msg.chart.chart_type && msg.chart.chart_type !== "none" && msg.chart.chart_data && msg.chart.chart_data.length > 0);
  const isValidTable = !!(table && table.columns && table.rows);

  if (response_type === 'text') {
    return (
      <>
        <span><TypewriterText text={answer} onComplete={() => setIsTypingComplete(true)} /></span>
        {isTypingComplete && isValidChart && <ChatbotChart chart={msg.chart} />}
      </>
    );
  }

  if (response_type === 'table') {
    return (
      <>
        {isTypingComplete && isValidTable && <ResponseTable table={table} />}
        {isTypingComplete && isValidChart && <ChatbotChart chart={msg.chart} />}
      </>
    );
  }

  if (response_type === 'both') {
    return (
      <>
        {answer && <p className="chat-answer-text"><TypewriterText text={answer} onComplete={() => setIsTypingComplete(true)} /></p>}
        {isTypingComplete && isValidTable && isValidChart ? (
          <div className="chat-combined-view">
            <div className="chat-view-toggle">
              <button 
                className={`view-toggle-btn ${activeView === 'chart' ? 'active' : ''}`}
                onClick={() => setActiveView('chart')}
                title="View Chart"
              >
                <BarChart2 size={16} /> <span>Chart</span>
              </button>
              <button 
                className={`view-toggle-btn ${activeView === 'table' ? 'active' : ''}`}
                onClick={() => setActiveView('table')}
                title="View Table"
              >
                <Table className="lucide-icon" size={16} /> <span>Table</span>
              </button>
            </div>
            
            <div className="chat-view-content">
              {activeView === 'chart' ? (
                <ChatbotChart chart={msg.chart} />
              ) : (
                <ResponseTable table={table} />
              )}
            </div>
          </div>
        ) : (
          isTypingComplete && (
            <>
              {isValidChart && <ChatbotChart chart={msg.chart} />}
              {isValidTable && <ResponseTable table={table} />}
            </>
          )
        )}
      </>
    );
  }

  // Fallback
  return (
    <>
      <span>{answer ? <TypewriterText text={answer} onComplete={() => setIsTypingComplete(true)} /> : msg.content}</span>
      {isTypingComplete && isValidChart && <ChatbotChart chart={msg.chart} />}
      {isTypingComplete && isValidTable && <ResponseTable table={table} />}
    </>
  );
};

const ChatAI = ({ isPanel = false, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);

  const handleSend = async (text = input.trim()) => {
    if (!text || isTyping) return;

    const now = new Date();
    const userMsg = { role: 'user', content: text, time: formatTime(now) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.chatbotQuery(text);
      const aiMsg = {
        role: 'ai',
        time: formatTime(new Date()),
        response_type: data.response_type,
        answer: data.answer,
        table: data.table,
        chart: data.chart,
        intent: data.intent,
        query_id: data.query_id,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = {
        role: 'ai',
        isError: true,
        content: err.message || 'Something went wrong. Please try again.',
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    setMessages([]);
    setIsTyping(false);
    setInput('');
  };

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <div className={`chat-ai-page ${isPanel ? 'chat-ai-page--panel' : ''}`}>

      {/* ── Panel header (only in panel mode) ── */}
      {isPanel && (
        <div className="chat-panel-header">
          <div className="chat-panel-header-logo">
            <GeminiLogo />
          </div>
          <span className="chat-panel-header-title">Chat AI</span>
          {onClose && (
            <button className="chat-panel-close-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          )}
        </div>
      )}
      {/* ── Back-to-home bar — shown whenever conversation is active ── */}
      {!isEmpty && (
        <button className="chat-back-bar" onClick={handleBack}>
          <ChevronLeft size={15} />
          <span>Back to home</span>
        </button>
      )}

      {/* ── Welcome / Empty State ── */}
      {isEmpty && (
        <div className="chat-welcome">
          <div className="chat-welcome-logo">
            <GeminiLogo />
          </div>
          <h2>This is Chat AI, How can I assist you?</h2>

          {/* Input sits between heading and suggestion chips */}
          <div className="chat-input-dock chat-input-dock--inline">
            <div className="chat-input-inner">
              <button className="chat-attach-btn" title="Attach file">
                <Plus size={18} />
              </button>
              <textarea
                ref={textareaRef}
                className="chat-input-field"
                placeholder="Ask me anything about safety events…"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button className="chat-mic-btn" title="Voice input">
                <Mic size={18} />
              </button>
              <button
                className="chat-send-btn"
                title="Send"
                disabled={!input.trim() || isTyping}
                onClick={() => handleSend()}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>

          <div className="chat-suggestions">
            {SUGGESTIONS.map((s, i) => {
              const parts = s.text.split(s.highlighted);
              return (
                <button
                  key={i}
                  className="chat-suggestion-chip"
                  onClick={() => handleSend(s.text)}
                >
                  {parts[0]}
                  <span className="chip-accent">{s.highlighted}</span>
                  {parts[1]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Conversation Messages ── */}
      {!isEmpty && (
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}
            >
              <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                {msg.role === 'user' ? 'MD' : <GeminiLogo />}
              </div>
              <div className="message-body">
                <div className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                  <AIMessageContent msg={msg} />
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="message-row ai-row">
              <div className="message-avatar ai-avatar">
                <GeminiLogo />
              </div>
              <div className="message-bubble ai-bubble">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ── Input Dock — shown only when conversation has started ── */}
      {!isEmpty && (
        <div className="chat-input-dock">
          <div className="chat-input-inner">
            <button className="chat-attach-btn" title="Attach file">
              <Plus size={18} />
            </button>

            <textarea
              ref={textareaRef}
              className="chat-input-field"
              placeholder="Ask a follow-up question…"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />

            <button className="chat-mic-btn" title="Voice input">
              <Mic size={18} />
            </button>

            <button
              className="chat-send-btn"
              title="Send"
              disabled={!input.trim() || isTyping}
              onClick={() => handleSend()}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAI;
