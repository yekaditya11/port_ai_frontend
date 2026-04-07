import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bot } from 'lucide-react';

const AppDropdown = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  multi = false, 
  required, 
  error, 
  auditInsight, 
  placeholder = 'Select', 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => !disabled && setIsOpen(!isOpen);

  const getOptionLabel = (option) => (typeof option === 'object' ? option.value : option);

  const handleSelect = (option) => {
    const optionValue = getOptionLabel(option);
    if (multi) {
      const newValue = Array.isArray(value)
        ? value.includes(optionValue)
          ? value.filter(v => v !== optionValue)
          : [...value, optionValue]
        : [optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (multi) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      if (value.length === 1) return value[0];
      return `${value[0]}, +${value.length - 1} More...`;
    }
    return value && value !== 'Select' ? value : placeholder;
  };

  const isOptionSelected = (option) => {
    const optionValue = getOptionLabel(option);
    if (multi) return Array.isArray(value) && value.includes(optionValue);
    return value === optionValue;
  };

  return (
    <div className={`rev-field ${error ? 'has-error' : ''} ${auditInsight ? 'has-ai-discrepancy' : ''} ${disabled ? 'rev-field-disabled' : ''} ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <label className="rev-field-label">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {required && <span className="required-star">*</span>}
          {auditInsight && (
            <div
              className="ai-audit-badge"
              onMouseEnter={() => setShowInsight(true)}
              onMouseLeave={() => setShowInsight(false)}
              onClick={() => setShowInsight(!showInsight)}
              style={{ cursor: 'pointer' }}
            >
              <Bot size={10} /> AUDIT
            </div>
          )}
        </span>
      </label>

      {auditInsight && showInsight && (
        <div className="ai-insight-card">
          <div className="ai-insight-title">
            <Bot size={14} /> AI Insight
          </div>
          <p className="ai-insight-reason">{auditInsight.reason}</p>
        </div>
      )}

      <div className={`rev-dropdown-container ${isOpen ? 'is-open' : ''}`}>
        <div
          className={`rev-dropdown-trigger ${isOpen ? 'is-open' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleToggle}
          tabIndex={0}
        >
          <div className={`rev-dropdown-value ${value && value !== 'Select' ? 'has-value' : ''}`}>
            {getDisplayValue()}
          </div>
          <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'is-open' : ''}`} />
        </div>

        {isOpen && (
          <div className="rev-dropdown-menu">
            {options.map((option, index) => (
              <div
                key={index}
                className={`rev-dropdown-option ${isOptionSelected(option) ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {multi && (
                  <div className={`dot ${isOptionSelected(option) ? 'active' : ''}`} />
                )}
                {getOptionLabel(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDropdown;
