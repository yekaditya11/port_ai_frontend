import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Eye, 
  Paperclip,
  Mic,
  Languages,
  Play
} from 'lucide-react';
import Loader from '../common/Loader';
import { api } from '../../services/api';
import './CreateIncident.css';

// --- CUSTOM COMPONENTS ---

/**
 * Unified AppDropdown component for both single and multi-select.
 */
const AppDropdown = ({ label, options = [], value, onChange, multi = false, required, error, icon: Icon, placeholder = 'Select' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const getOptionLabel = (option) => (typeof option === 'object' ? option.value : option);
  const getOptionKey = (option) => (typeof option === 'object' ? (option.id || option.value) : option);

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
    <div className={`form-field ${error ? 'has-error' : ''} ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className={`app-dropdown-container ${isOpen ? 'is-open' : ''}`}>
        <div 
          className={`app-dropdown-trigger ${isOpen ? 'is-open' : ''}`} 
          onClick={handleToggle}
          tabIndex={0}
        >
          <span className={`app-dropdown-value ${(multi ? (Array.isArray(value) && value.length > 0) : (value && value !== 'Select')) ? 'has-value' : ''}`}>
            {getDisplayValue()}
          </span>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
        
        {isOpen && (
          <div 
            className="app-dropdown-menu"
            style={{ 
              backgroundColor: '#ffffff', 
              opacity: 1, 
              zIndex: 9999,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            {options.map(option => (
              <div 
                key={getOptionKey(option)} 
                className={`app-dropdown-option ${isOptionSelected(option) ? 'is-selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {multi && (
                  <input 
                    type="checkbox" 
                    className="app-dropdown-checkbox" 
                    checked={isOptionSelected(option)}
                    readOnly
                  />
                )}
                <span>{getOptionLabel(option)}</span>
              </div>
            ))}
            {options.length === 0 && <div className="app-dropdown-option" style={{ color: '#94a3b8', fontStyle: 'italic' }}>No options available</div>}
          </div>
        )}
        {Icon && <Icon size={16} className="field-icon" />}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

const PremiumAIButton = ({ onClick, tooltip, loading = false }) => (
  <button 
    className={`premium-ai-btn ${loading ? 'loading' : ''}`} 
    onClick={onClick} 
    title={tooltip}
    disabled={loading}
    type="button"
  >
    <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2 C 14 2, 14.4 9.2, 19.8 14 C 14.4 18.8, 14 26, 14 26 C 14 26, 13.6 18.8, 8.2 14 C 13.6 9.2, 14 2, 14 2 Z"
        fill="#6366f1"
      />
      <path
        d="M2 14 C 2 14, 9.2 14.4, 14 19.8 C 14 13.6, 26 14, 26 14 C 26 14, 18.8 13.6, 14 8.2 C 9.2 13.6, 2 14, 2 14 Z"
        fill="#6366f1"
        opacity="0.65"
      />
    </svg>
  </button>
);

const CreateIncident = ({ prefillData = null, prefillPersons = null }) => {
  const navigate = useNavigate();

  // Strip "--" placeholder values that come from the server's format_incident
  const cleanPrefill = (data) => {
    if (!data) return null;
    const cleaned = {};
    for (const [key, val] of Object.entries(data)) {
      if (val === '--' || val === 'Select') {
        cleaned[key] = Array.isArray(val) ? [] : '';
      } else {
        cleaned[key] = val;
      }
    }
    // Ensure array fields are always arrays
    cleaned.incident_type = Array.isArray(cleaned.incident_type) ? cleaned.incident_type : [];
    cleaned.incident_group = Array.isArray(cleaned.incident_group) ? cleaned.incident_group : [];
    cleaned.sub_group = Array.isArray(cleaned.sub_group) ? cleaned.sub_group : [];
    cleaned.risk_category = Array.isArray(cleaned.risk_category) ? cleaned.risk_category : (cleaned.risk_category ? [cleaned.risk_category] : []);
    // These are read-only display fields — clear them so a new incident gets fresh values
    cleaned.incident_ref = '';
    cleaned.status = '';
    return cleaned;
  };
  const [openSections, setOpenSections] = useState({
    work_activity: true,
    involved: true,
    witness: true,
    equipment: true,
    container: true,
    environmental: true,
    task: true,
    permit: true,
    reported: true
  });

  // --- API DATA STATE ---
  const [enums, setEnums] = useState({});
  const [users, setUsers] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isManualTitle, setIsManualTitle] = useState(false);

  const [involvedPersons, setInvolvedPersons] = useState(
    prefillPersons && prefillPersons.length > 0 ? prefillPersons :
    [{ worker_type: 'Select', name: 'Select', id: '', age: '', department: '', designation: '', particulars: '' }]
  );
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const [formData, setFormData] = useState(() => {
    const clean = cleanPrefill(prefillData);
    return clean ? { ...clean } : {
    incident_title: '',
    incident_type: [],
    incident_group: [], 
    sub_group: [],
    area_of_incident: '',
    sub_area: '',
    operational_activity: '',
    risk_category: [],
    actual_severity: 'Select',
    potential_severity: 'Select',
    critical_incident: 'Select',
    shift: 'Shift 3',
    time_of_day: 'Twilight',
    weather: 'Select',
    work_activity_classification: 'Work Related Incident',
    reported_by_id: '',
    reported_to_id: '',
    shift_manager_id: 'Select',
    shift_superintendent_id: 'Select',
    incident_date: currentDate,
    incident_time: currentTime,
    reported_date: currentDate,
    reported_time: currentTime,
    reported_by_type: 'Someone Else',
    reported_to_type: 'Someone Else',
    description: '',
    immediate_action: '',
    shipping_line: 'Select',
    container_number: '',
  }});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [enumData, userData] = await Promise.all([
          api.getEnumsAll(),
          api.getUsers()
        ]);
        setEnums(enumData);
        setUsers(userData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Sync title dynamically
  useEffect(() => {
    if (isManualTitle) return;
    
    const typeLabel = formData.incident_type.length > 0 ? formData.incident_type.join(', ') : '';
    const groupLabel = formData.incident_group.length > 0 ? formData.incident_group.join(', ') : 'Select';
    const userName = users.find(u => u.id === formData.reported_by_id)?.name || 'Martin Debeloz';
    
    // Combining types and groups into title
    const prefix = typeLabel ? `${typeLabel} - ${groupLabel}` : groupLabel;
    const newTitle = `${prefix} - ${userName}`;
    setFormData(prev => ({ ...prev, incident_title: newTitle }));
  }, [formData.incident_type, formData.incident_group, formData.incident_date, formData.incident_time, formData.reported_by_id, users, isManualTitle]);

  // Fetch sub-areas when area changes
  useEffect(() => {
    if (formData.area_of_incident) {
      api.getSubAreas(formData.area_of_incident).then(data => {
        // Extract only the sub_area names as strings for the dropdown
        setSubAreas(data.map(item => item.sub_area));
      });
    } else {
      setSubAreas([]);
    }
  }, [formData.area_of_incident]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleValueChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.incident_type.length === 0) newErrors.incident_type = 'Incident Type is required.';
    if (formData.incident_group.length === 0) newErrors.incident_group = 'Incident Group is required.';
    if (formData.sub_group.length === 0) newErrors.sub_group = 'Sub Group is required.';
    if (!formData.risk_category || formData.risk_category.length === 0) newErrors.risk_category = 'Risk Category is required.';
    if (!formData.description) newErrors.description = 'Incident Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    try {
      // Sanitize fields: convert "Select" and empty strings to null for the backend
      const sanitizedData = {};
      Object.keys(formData).forEach(key => {
        const val = formData[key];
        if (val === 'Select' || val === '') {
          sanitizedData[key] = null;
        } else {
          sanitizedData[key] = val;
        }
      });

      const payload = {
        ...sanitizedData,
        reported_date: new Date().toISOString(),
        incident_date: `${formData.incident_date}T${formData.incident_time}:00Z`,
        attachments: attachments,
        involved_persons: involvedPersons.map(p => ({
          worker_type: p.worker_type !== 'Select' ? p.worker_type : null,
          person_name: p.name !== 'Select' ? p.name : null,
          employee_id: p.id || null,
          department: p.department || null,
          designation: p.designation || null,
          particulars: p.particulars || null,
          person_id: p.person_id || null
        })).filter(p => p.person_name || p.worker_type) // Only send if at least name or type is set
      };
      const result = await api.createIncident(payload);
      
      // Show custom notification instead of alert
      setNotification({
        type: 'success',
        message: 'Incident Created Successfully',
        ref: result.incident_ref
      });

      // Redirect after a short delay to let user see the success message
      setTimeout(() => {
        setNotification(null);
        navigate('/incident/listing');
      }, 2000);

    } catch (err) {
      setNotification({
        type: 'error',
        message: `Failed to create incident: ${err.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIAnalysis = async (file, modalDescription = '') => {
    setAnalyzing(true);
    try {
      const aiData = await api.analyzeIncidentMedia(file, modalDescription);
      
      if (aiData.error) {
        throw new Error(aiData.message || aiData.error);
      }

      // Helper to strip accidental HTML tags
      const stripHtml = (str) => {
        if (!str) return '';
        return str.replace(/<[^>]*>?/gm, '');
      };

      setFormData(prev => ({
        ...prev,
        incident_title: aiData.incident_title || prev.incident_title,
        description: stripHtml(aiData.description) || prev.description,
        immediate_action: stripHtml(aiData.immediate_action) || prev.immediate_action,
        incident_type: Array.isArray(aiData.incident_type) ? aiData.incident_type : prev.incident_type,
        incident_group: Array.isArray(aiData.incident_group) ? aiData.incident_group : prev.incident_group,
        sub_group: Array.isArray(aiData.sub_group) ? aiData.sub_group : prev.sub_group,
        operational_activity: aiData.operational_activity || prev.operational_activity,
        area_of_incident: aiData.area_of_incident || prev.area_of_incident,
        // Risk category must be an array for multi-select
        risk_category: aiData.risk_category ? (Array.isArray(aiData.risk_category) ? aiData.risk_category : [aiData.risk_category]) : prev.risk_category,
        actual_severity: aiData.actual_severity || prev.actual_severity,
        potential_severity: aiData.potential_severity || prev.potential_severity,
        critical_incident: aiData.critical_incident || prev.critical_incident,
      }));
      setIsManualTitle(true);

      setNotification({
        type: 'success',
        message: 'AI has analyzed the media and populated the form. Please review.'
      });
      setTimeout(() => setNotification(null), 5000);

    } catch (err) {
      setNotification({
        type: 'error',
        message: `AI Analysis failed: ${err.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddInvolvedPerson = () => {
    setInvolvedPersons([...involvedPersons, { worker_type: 'Select', name: 'Select', id: '', age: '', department: '', designation: '', particulars: '' }]);
  };

  const handleInvolvedPersonChange = (index, field, value) => {
    const updated = [...involvedPersons];
    updated[index][field] = value;
    
    // Auto-populate if name changes
    if (field === 'name') {
      const user = users.find(u => u.name === value);
      if (user) {
        updated[index].id = user.employee_id || '';
        updated[index].department = user.department || 'Operations';
        updated[index].designation = user.designation || 'Operator';
        updated[index].person_id = user.id; // Store user ID
      } else {
        updated[index].person_id = null;
      }
    }
    setInvolvedPersons(updated);
  };

  const SectionHeader = ({ title, isOpen, onToggle, hasCheckbox = true }) => (
    <div className="section-header" onClick={onToggle}>
      <div className="header-left">
        {hasCheckbox && <input type="checkbox" className="section-checkbox" checked={isOpen} readOnly />}
        <span className="section-title">{title}</span>
        <span className="section-na">N/A</span>
      </div>
      <ChevronDown size={16} color="#94a3b8" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
    </div>
  );

  const involvedHeaders = ['Worker Type', 'Name', 'ID', 'Age', 'Department / Company', 'Designation', 'Particulars'];

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <Loader size={48} />
        <p style={{ color: '#64748b', fontSize: '18px' }}>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout-main">
      <div className="content-padding">
        <div className="create-incident-container">
          
          <div className="incident-section" style={{ marginTop: '20px' }}>
            <div className="section-content">
              <div className="grid-5">
                <div className="form-field">
                  <label className="field-label">Incident Reference Number</label>
                  <input type="text" className="field-input" value="--" readOnly />
                </div>
                <div className="form-field">
                  <label className="field-label">Status</label>
                  <input type="text" className="field-input" value="--" readOnly />
                </div>
                <div className="form-field">
                  <label className="field-label">Reported Date <span className="required-star">*</span></label>
                  <div className="field-input-wrapper">
                    <input type="text" className="field-input" value={new Date(formData.reported_date).toLocaleDateString('en-GB')} readOnly />
                    <Calendar size={16} className="field-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Reported Time <span className="required-star">*</span></label>
                  <div className="field-input-wrapper">
                    <input type="text" className="field-input" value={formData.reported_time} readOnly />
                    <Clock size={16} className="field-icon" />
                  </div>
                </div>
                
                <AppDropdown 
                  label="CCTV Footages"
                  options={['Available', 'Not Available']}
                  value={formData.cctv}
                  onChange={(val) => handleValueChange('cctv', val)}
                />

                <div className="form-field">
                  <label className="field-label">Incident Date <span className="required-star">*</span></label>
                  <div className="field-input-wrapper">
                    <input type="text" className="field-input" value={new Date(formData.incident_date).toLocaleDateString('en-GB')} readOnly />
                    <Calendar size={16} className="field-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Incident Time <span className="required-star">*</span></label>
                  <div className="field-input-wrapper">
                    <input type="text" className="field-input" value={formData.incident_time} readOnly />
                    <Clock size={16} className="field-icon" />
                  </div>
                </div>

                <AppDropdown 
                  label="Area of Incident"
                  required
                  options={enums.area_of_incident}
                  value={formData.area_of_incident}
                  onChange={(val) => handleValueChange('area_of_incident', val)}
                />

                <AppDropdown 
                  label="Sub Area"
                  icon={MapPin}
                  options={subAreas}
                  value={formData.sub_area}
                  onChange={(val) => handleValueChange('sub_area', val)}
                />

                <AppDropdown 
                  label="Operational Activity"
                  required
                  options={enums.operational_activities?.map(a => a.name) || enums.operational_activity || []}
                  value={formData.operational_activity}
                  onChange={(val) => handleValueChange('operational_activity', val)}
                />

                {/* Second Row */}
                <AppDropdown 
                  label="Incident Type"
                  multi
                  required
                  error={errors.incident_type}
                  options={enums.incident_type}
                  value={formData.incident_type}
                  onChange={(val) => handleValueChange('incident_type', val)}
                />

                <AppDropdown 
                  label="Incident Group"
                  multi
                  required
                  error={errors.incident_group}
                  options={enums.incident_group}
                  value={formData.incident_group}
                  onChange={(val) => handleValueChange('incident_group', val)}
                />

                <AppDropdown 
                  label="Sub Group"
                  multi
                  required
                  error={errors.sub_group}
                  options={enums.incident_subgroup?.filter(s => formData.incident_group.includes(s.parent)).map(s => s.value) || []}
                  value={formData.sub_group}
                  onChange={(val) => handleValueChange('sub_group', val)}
                />

                <AppDropdown 
                  label="Critical Incident"
                  options={['No', 'Yes']}
                  value={formData.critical_incident}
                  onChange={(val) => handleValueChange('critical_incident', val)}
                />

                <AppDropdown 
                  label="Risk Category"
                  multi
                  required
                  error={errors.risk_category}
                  options={enums.risk_category}
                  value={formData.risk_category}
                  onChange={(val) => handleValueChange('risk_category', val)}
                />

                {/* Third Row */}
                <AppDropdown 
                  label="Actual Severity"
                  options={enums.severity_level}
                  value={formData.actual_severity}
                  onChange={(val) => handleValueChange('actual_severity', val)}
                />

                <AppDropdown 
                  label="Potential Severity"
                  options={enums.severity_level}
                  value={formData.potential_severity}
                  onChange={(val) => handleValueChange('potential_severity', val)}
                />

                <AppDropdown 
                  label="Shift Manager"
                  options={users.map(u => `${u.name} (${u.employee_id})`)}
                  value={formData.shift_manager_name || 'Select'}
                  onChange={(val) => {
                    const user = users.find(u => `${u.name} (${u.employee_id})` === val);
                    setFormData(prev => ({ ...prev, shift_manager_id: user?.id, shift_manager_name: val }));
                  }}
                />

                <AppDropdown 
                  label="Shift Superintendent"
                  options={users.map(u => `${u.name} (${u.employee_id})`)}
                  value={formData.shift_superintendent_name || 'Select'}
                  onChange={(val) => {
                    const user = users.find(u => `${u.name} (${u.employee_id})` === val);
                    setFormData(prev => ({ ...prev, shift_superintendent_id: user?.id, shift_superintendent_name: val }));
                  }}
                />

                <AppDropdown 
                  label="Weather"
                  options={enums.weather}
                  value={formData.weather}
                  onChange={(val) => handleValueChange('weather', val)}
                />

                {/* Shipping Line */}
                <AppDropdown 
                  label="Shipping Line Details"
                  options={enums.shipping_lines?.map(s => s.name) || enums.shipping_line || []}
                  value={formData.shipping_line}
                  onChange={(val) => handleValueChange('shipping_line', val)}
                />

                <div className="form-field">
                  <label className="field-label">Container Number</label>
                  <input 
                    type="text" 
                    className="field-input" 
                    value={formData.container_number}
                    onChange={(e) => handleValueChange('container_number', e.target.value)}
                  />
                </div>

                <AppDropdown 
                  label="Shipping Line Informed ?"
                  options={['No', 'Yes']}
                  value={formData.shipping_line_informed || 'Select'}
                  onChange={(val) => handleValueChange('shipping_line_informed', val)}
                />

                <AppDropdown 
                  label="Shift"
                  required
                  options={enums.shift}
                  value={formData.shift}
                  onChange={(val) => handleValueChange('shift', val)}
                />

                <AppDropdown 
                  label="Time of Day"
                  options={enums.time_of_day}
                  value={formData.time_of_day}
                  onChange={(val) => handleValueChange('time_of_day', val)}
                />
              </div>

              <div className="status-bar-container">
                <div className="status-bar">Reportable</div>
                <div className="status-bar">Recordable</div>
              </div>

              <div className="grid-4">
                 <div className="form-field">
                    <label className="field-label">UIN Number</label>
                    <div className="field-input-wrapper">
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.uin_number}
                        onChange={(e) => handleValueChange('uin_number', e.target.value)}
                      />
                      <Eye size={16} className="field-icon" />
                    </div>
                 </div>
                  <div className="form-field" style={{ gridColumn: 'span 2' }}>
                    <label className="field-label">Incident Title</label>
                    <div className="field-input-wrapper">
                      <input 
                        type="text" 
                        className="field-input" 
                        value={formData.incident_title} 
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, incident_title: e.target.value }));
                          setIsManualTitle(true);
                        }}
                      />
                      <Eye size={16} className="field-icon" />
                    </div>
                  </div>
                 <div className="grid-2-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', gridColumn: 'span 1' }}>
                    <div className="form-field">
                      <label className="field-label">Reportable</label>
                      <input type="text" className="field-input" />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Recordable</label>
                      <input type="text" className="field-input" />
                    </div>
                 </div>
              </div>

              <div className="narrative-grid">
                 <div className="narrative-box">
                    <div style={{ marginBottom: '8px' }}>
                       <label className="field-label">Incident Description <span className="required-star">*</span></label>
                    </div>
                    <textarea 
                       className={`field-textarea ${errors.description ? 'is-invalid' : ''}`}
                       rows={6} 
                       value={formData.description}
                       onChange={(e) => handleValueChange('description', e.target.value)}
                    ></textarea>
                    {errors.description && <span className="error-message">{errors.description}</span>}
                    <div className="char-counter">{formData.description.length} / 3000</div>
                 </div>
                 <div className="narrative-box">
                    <div style={{ marginBottom: '8px' }}>
                       <label className="field-label">Immediate Action Taken</label>
                    </div>
                    <textarea 
                       className="field-textarea" 
                       rows={6} 
                       value={formData.immediate_action}
                       onChange={(e) => handleValueChange('immediate_action', e.target.value)}
                    ></textarea>
                    <div className="char-counter">{formData.immediate_action.length} / 3000</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Work Activity Classification */}
          <div className="incident-section">
            <SectionHeader title="WORK ACTIVITY CLASSIFICATION" isOpen={openSections.work_activity} onToggle={() => toggleSection('work_activity')} />
            {openSections.work_activity && (
              <div className="section-content">
                <div className="work-activity-radio-group">
                   {['Work Related Incident', 'Non Work Related Incident', 'Third Party Incident'].map(option => (
                     <label key={option} className="work-radio-option">
                        <input 
                          type="radio" 
                          name="work_activity_classification"
                          value={option}
                          checked={formData.work_activity_classification === option}
                          onChange={(e) => handleValueChange('work_activity_classification', e.target.value)}
                        />
                        <div className="custom-radio-circle"></div>
                        <span className="radio-text">{option}</span>
                     </label>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Involved Sections */}
          <div className="incident-section">
            <SectionHeader title="INVOLVED PERSON" isOpen={openSections.involved} onToggle={() => toggleSection('involved')} />
            {openSections.involved && (
              <div className="section-content">
                 <div className="grid-involved-header">
                    {involvedHeaders.map(h => (
                      <span key={h} className="field-label">{h}</span>
                    ))}
                 </div>
                 {involvedPersons.map((person, idx) => (
                   <div key={idx} className="grid-involved-row">
                      <AppDropdown 
                        placeholder="Select" 
                        options={['3rd Party', 'Contract', 'Employee', 'Visitor']} 
                        value={person.worker_type} 
                        onChange={(val) => handleInvolvedPersonChange(idx, 'worker_type', val)} 
                      />
                      <AppDropdown 
                        placeholder="Select" 
                        options={users.map(u => u.name)} 
                        value={person.name} 
                        onChange={(val) => handleInvolvedPersonChange(idx, 'name', val)} 
                      />
                      <input 
                        type="text" 
                        className="field-input" 
                        value={person.id} 
                        onChange={(e) => handleInvolvedPersonChange(idx, 'id', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="field-input" 
                        value={person.department} 
                        onChange={(e) => handleInvolvedPersonChange(idx, 'department', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="field-input" 
                        value={person.designation} 
                        onChange={(e) => handleInvolvedPersonChange(idx, 'designation', e.target.value)} 
                      />
                      <div className="involved-particulars-icons">
                         <div className="p-icon-box"><Paperclip size={14} /><span>0</span></div>
                         <div className="p-icon-box"><Languages size={14} /><span>0</span></div>
                         <div className="p-icon-box"><Eye size={14} /><span>0</span></div>
                         <div className="p-icon-edit"><Plus size={12} style={{ transform: 'rotate(45deg)' }} /></div>
                      </div>
                   </div>
                 ))}
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="add-btn" onClick={handleAddInvolvedPerson}><Plus size={14} /> ADD</div>
                 </div>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="incident-section">
            <SectionHeader title="ATTACHMENTS" isOpen={true} onToggle={() => {}} />
            <div className="section-content">
              {attachments.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No images taken yet. Click UPLOAD below to add images.</p>
              ) : (
                <div className="attachments-grid">
                  {attachments.map((attr, idx) => (
                    <div key={idx} className="attachment-card-preview">
                      <img src={attr.file_url} alt={attr.file_name} />
                      <div className="attachment-info">
                        <span className="attachment-name">{attr.file_name}</span>
                        <p className="attachment-desc">{attr.description || 'No description'}</p>
                      </div>
                      <button className="remove-attachment" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reported Person Section (Moved to end) */}
          <div className="incident-section">
            <SectionHeader title="REPORTED PERSON" isOpen={openSections.reported} onToggle={() => toggleSection('reported')} />
            {openSections.reported && (
              <div className="section-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Reported By */}
                  <div className="reported-row">
                    <div className="reported-label">Incident reported by</div>
                    <div className="reported-toggles">
                      <label className="toggle-option">
                        <input 
                          type="checkbox" 
                          checked={formData.reported_by_type === 'Me'} 
                          onChange={() => {
                            const user = users.find(u => u.name === 'Martin Debeloz');
                            setFormData(prev => ({ 
                              ...prev, 
                              reported_by_type: 'Me', 
                              reported_by_id: user?.id || prev.reported_by_id,
                              reported_by_name: user ? `${user.name} (${user.employee_id})` : prev.reported_by_name 
                            }));
                          }}
                        />
                        <div className="toggle-box"></div>
                        <span>Me</span>
                      </label>
                      <label className="toggle-option">
                        <input 
                          type="checkbox" 
                          checked={formData.reported_by_type === 'Someone Else'} 
                          onChange={() => setFormData(prev => ({ ...prev, reported_by_type: 'Someone Else' }))}
                        />
                        <div className="toggle-box"></div>
                        <span>Someone Else</span>
                      </label>
                    </div>
                    <div className="reported-dropdown">
                      <AppDropdown 
                        label="Person" 
                        required 
                        options={users.map(u => `${u.name} (${u.employee_id})`)}
                        value={formData.reported_by_name || 'Select'}
                        onChange={(val) => {
                          const user = users.find(u => `${u.name} (${u.employee_id})` === val);
                          setFormData(prev => ({ 
                            ...prev, 
                            reported_by_id: user?.id, 
                            reported_by_name: val,
                            reported_by_type: 'Someone Else'
                          }));
                        }}
                      />
                    </div>
                  </div>

                  {/* Reported To */}
                  <div className="reported-row">
                    <div className="reported-label">Incident Reported to</div>
                    <div className="reported-toggles">
                      <label className="toggle-option">
                        <input 
                          type="checkbox" 
                          checked={formData.reported_to_type === 'Me'} 
                          onChange={() => {
                            const user = users.find(u => u.name === 'Martin Debeloz');
                            setFormData(prev => ({ 
                              ...prev, 
                              reported_to_type: 'Me', 
                              reported_to_id: user?.id || prev.reported_to_id,
                              reported_to_name: user ? `${user.name} (${user.employee_id})` : prev.reported_to_name
                            }));
                          }}
                        />
                        <div className="toggle-box"></div>
                        <span>Me</span>
                      </label>
                      <label className="toggle-option">
                        <input 
                          type="checkbox" 
                          checked={formData.reported_to_type === 'Someone Else'} 
                          onChange={() => setFormData(prev => ({ ...prev, reported_to_type: 'Someone Else' }))}
                        />
                        <div className="toggle-box"></div>
                        <span>Someone Else</span>
                      </label>
                    </div>
                    <div className="reported-dropdown">
                      <AppDropdown 
                        label="Person" 
                        options={users.map(u => `${u.name} (${u.employee_id})`)}
                        value={formData.reported_to_name || 'Select'}
                        onChange={(val) => {
                          const user = users.find(u => `${u.name} (${u.employee_id})` === val);
                          setFormData(prev => ({ 
                            ...prev, 
                            reported_to_id: user?.id, 
                            reported_to_name: val,
                            reported_to_type: 'Someone Else'
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-footer">
            <button className="btn btn-cancel">CANCEL</button>
            <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>UPLOAD</button>
            <button className="btn btn-primary" disabled={submitting}>DRAFT</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>

          <UploadModal 
            isOpen={isUploadModalOpen} 
            onClose={() => setIsUploadModalOpen(false)} 
            onUpload={(newAttr) => {
              setAttachments(prev => [...prev, newAttr]);
            }} 
            onAnalyze={handleAIAnalysis}
            isAnalyzing={analyzing}
          />

          {analyzing && (
            <div className="ai-analyzing-overlay">
              <div className="ai-loader-content">
                <Loader size={48} className="spin" />
                <h3>🤖 AI is analyzing your media...</h3>
                <p>Generating incident title, description, and classifications.</p>
              </div>
            </div>
          )}

          {notification && (
            <div className={`notification-toast ${notification.type}`}>
              <div className="toast-icon">
                {notification.type === 'success' ? '✓' : '!'}
              </div>
              <div className="toast-content">
                <div className="toast-title">{notification.message}</div>
                {notification.ref && <div className="toast-ref">Ref: {notification.ref}</div>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- MODAL COMPONENTS ---

/**
 * High-fidelity Upload Modal
 */
const UploadModal = ({ isOpen, onClose, onUpload, onAnalyze, isAnalyzing }) => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews(prev => [...prev, { name: file.name, type: 'image', url: reader.result }]);
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          setPreviews(prev => [...prev, { name: file.name, type: 'video', url: 'video_placeholder' }]);
        } else if (file.type.startsWith('audio/')) {
          setPreviews(prev => [...prev, { name: file.name, type: 'audio', url: 'audio_placeholder' }]);
        }
      });
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleModalSubmit = () => {
    if (files.length > 0) {
      files.forEach((file, idx) => {
        const p = previews[idx];
        onUpload({
          file_name: file.name,
          file_url: (p.url === 'video_placeholder' || p.url === 'audio_placeholder') ? (p.type) : p.url,
          description: idx === 0 ? description : '' // Only attach desc to first if batching
        });
      });
      setFiles([]);
      setPreviews([]);
      setDescription('');
      onClose();
    }
  };

  const handleAIButtonClick = async () => {
    if (files.length > 0) {
      await onAnalyze(files, description);
      setFiles([]);
      setPreviews([]);
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="upload-modal-header">
          <div className="header-title">
            <div className="upload-icon-circle">
               <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                 <path d="M14 2 C 14 2, 14.4 9.2, 19.8 14 C 14.4 18.8, 14 26, 14 26 C 14 26, 13.6 18.8, 8.2 14 C 13.6 9.2, 14 2, 14 2 Z" fill="#22d3ee" />
                 <path d="M2 14 C 2 14, 9.2 14.4, 14 19.8 C 14 13.6, 26 14, 26 14 C 26 14, 18.8 13.6, 14 8.2 C 9.2 13.6, 2 14, 2 14 Z" fill="#22d3ee" opacity="0.65" />
               </svg>
            </div>
            <span>Upload File</span>
          </div>
          <PremiumAIButton 
            onClick={handleAIButtonClick} 
            loading={isAnalyzing} 
            tooltip="AI Scene Analysis"
          />
        </div>

        <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef}
            hidden 
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
          />
          <div className="dropzone-content">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '8px' }}>
              <path d="M14 2 C 14 2, 14.4 9.2, 19.8 14 C 14.4 18.8, 14 26, 14 26 C 14 26, 13.6 18.8, 8.2 14 C 13.6 9.2, 14 2, 14 2 Z" fill="#94a3b8" />
              <path d="M2 14 C 2 14, 9.2 14.4, 14 19.8 C 14 13.6, 26 14, 26 14 C 26 14, 18.8 13.6, 14 8.2 C 9.2 13.6, 2 14, 2 14 Z" fill="#94a3b8" opacity="0.65" />
            </svg>
            <p>{files.length > 0 ? `${files.length} file(s) selected` : 'Browse files or drag and drop your files'}</p>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="upload-previews-gallery">
            {previews.map((p, idx) => (
              <div key={idx} className="mini-preview-card">
                <div className="remove-preview" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>
                  <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                </div>
                {p.type === 'image' && <img src={p.url} alt="Preview" />}
                {p.type === 'video' && <Play size={24} color="#94a3b8" />}
                {p.type === 'audio' && <Mic size={24} color="#00c4f4" />}
                <span className="file-name-tag">{p.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-form-field">
          <div className="modal-label-row">
            <label className="modal-label">Description</label>
          </div>
          <textarea 
            className="modal-textarea" 
            rows={4} 
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-char-count">{description.length}/100</div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose} disabled={isAnalyzing}>CANCEL</button>
          <button className="modal-btn modal-btn-submit" onClick={handleModalSubmit} disabled={files.length === 0 || isAnalyzing}>SUBMIT</button>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
