import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Eye, 
  Paperclip,
  Languages,
  Loader2
} from 'lucide-react';
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
    <div className={`form-field ${error ? 'has-error' : ''}`} ref={containerRef}>
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="app-dropdown-container">
        <div 
          className={`app-dropdown-trigger ${isOpen ? 'is-open' : ''}`} 
          onClick={handleToggle}
        >
          <span className={`app-dropdown-value ${(multi ? (Array.isArray(value) && value.length > 0) : (value && value !== 'Select')) ? 'has-value' : ''}`}>
            {getDisplayValue()}
          </span>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
        
        {isOpen && (
          <div className="app-dropdown-menu">
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

const CreateIncident = () => {
  const [openSections, setOpenSections] = useState({
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

  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const [formData, setFormData] = useState({
    incident_title: '',
    incident_type: [], // Adjusted to array for multi-select
    incident_group: [], 
    sub_group: [], // Adjusted to array for multi-select
    area_of_incident: '',
    sub_area: '',
    operational_activity: '',
    risk_category: '',
    actual_severity: 'Select',
    potential_severity: 'Select',
    critical_incident: 'Select',
    shift: 'Shift 3',
    time_of_day: 'Twilight',
    weather: 'Select',
    classification: 'Work Related Incident',
    reported_by_id: '',
    reported_to_id: '',
    shift_manager_id: 'Select',
    shift_superintendent_id: 'Select',
    incident_date: currentDate,
    incident_time: currentTime,
    reported_date: currentDate,
    reported_time: currentTime,
    description: '',
    immediate_action: '',
    shipping_line: 'Select',
    container_number: '',
  });

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
    const typeLabel = formData.incident_type.length > 0 ? formData.incident_type.join(', ') : '';
    const groupLabel = formData.incident_group.length > 0 ? formData.incident_group.join(', ') : 'Select';
    const dateFormatted = new Date(formData.incident_date).toLocaleDateString('en-GB');
    const userName = users.find(u => u.id === formData.reported_by_id)?.name || 'Martin Debeloz';
    
    // Combining types and groups into title
    const prefix = typeLabel ? `${typeLabel} - ${groupLabel}` : groupLabel;
    const newTitle = `${prefix} - ${dateFormatted} - ${formData.incident_time} - ${userName}`;
    setFormData(prev => ({ ...prev, incident_title: newTitle }));
  }, [formData.incident_type, formData.incident_group, formData.incident_date, formData.incident_time, formData.reported_by_id, users]);

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
    if (!formData.risk_category) newErrors.risk_category = 'Risk Category is required.';
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
      const payload = {
        ...formData,
        reported_date: new Date().toISOString(),
        incident_date: `${formData.incident_date}T${formData.incident_time}:00Z`,
        attachments: attachments
      };
      const result = await api.createIncident(payload);
      alert(`Incident created successfully! Ref: ${result.incident_ref}`);
    } catch (err) {
      alert(`Failed to create incident: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
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
        <Loader2 className="animate-spin" size={48} color="#22d3ee" />
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
                      <input type="text" className="field-input" value={formData.incident_title} readOnly />
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                       <label className="field-label">Incident Description <span className="required-star">*</span></label>
                       <div className="add-btn"><Languages size={14} /> Translate</div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                       <label className="field-label">Immediate Action Taken</label>
                       <div className="add-btn"><Languages size={14} /> Translate</div>
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

          {/* Involved Sections */}
          <div className="incident-section">
            <SectionHeader title="INVOLVED PERSON" isOpen={openSections.involved} onToggle={() => toggleSection('involved')} />
            {openSections.involved && (
              <div className="section-content">
                 <div className="grid-involved" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr 0.5fr 1.5fr 1fr 1fr', gap: '8px', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    {involvedHeaders.map(h => (
                      <span key={h} className="field-label">{h}</span>
                    ))}
                 </div>
                 <div className="grid-involved" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr 0.5fr 1.5fr 1fr 1fr', gap: '8px' }}>
                    <AppDropdown placeholder="Select" options={['Regular', 'Contractor']} value="Select" onChange={()=>{}} />
                    <AppDropdown placeholder="Select" options={users.map(u => u.name)} value="Select" onChange={()=>{}} />
                    <input type="text" className="field-input" />
                    <input type="text" className="field-input" />
                    <input type="text" className="field-input" readOnly />
                    <input type="text" className="field-input" readOnly />
                    <div className="field-input-wrapper">
                      <input type="text" className="field-input" readOnly />
                      <Paperclip size={14} className="field-icon" />
                    </div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="add-btn"><Plus size={14} /> ADD</div>
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
            onUpload={(newAttr) => setAttachments(prev => [...prev, newAttr])}
          />

        </div>
      </div>
    </div>
  );
};

// --- MODAL COMPONENTS ---

/**
 * High-fidelity Upload Modal
 */
const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file && preview) {
      onUpload({
        file_name: file.name,
        file_url: preview, // Base64 data
        description
      });
      setFile(null);
      setPreview(null);
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
               <Plus size={18} />
            </div>
            <span>Upload File</span>
          </div>
          <Paperclip size={20} color="#94a3b8" />
        </div>

        <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef}
            hidden 
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="dropzone-content">
            <Paperclip size={24} color="#94a3b8" />
            <p>{file ? file.name : 'Browse file or drag and drop your file'}</p>
          </div>
        </div>

        {preview && (
          <div className="upload-preview-container">
            <img src={preview} alt="Upload preview" className="upload-preview-img" />
          </div>
        )}

        <div className="modal-form-field">
          <div className="modal-label-row">
            <label className="modal-label">Description</label>
            <div className="modal-label-actions">
              <span>Translate</span>
              <Languages size={14} />
            </div>
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
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>CANCEL</button>
          <button className="modal-btn modal-btn-submit" onClick={handleSubmit} disabled={!file}>SUBMIT</button>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
