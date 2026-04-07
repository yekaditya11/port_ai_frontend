import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpFromLine, Languages, Plus, Video, X, Loader2, MapPin,
  ChevronDown, Clock, PlusCircle, Paperclip
} from 'lucide-react';
import { api } from '../../services/api';
import './CreateObservation.css';
/**
 * Unified AppDropdown component for both single and multi-select.
 * Adapted for Observation screen styling.
 */
const AppDropdown = ({ label, options = [], value, onChange, multi = false, required, error, icon: Icon, placeholder = 'Select', disabled = false }) => {
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

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

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
    <div className={`obs-field ${error ? 'has-error' : ''} ${disabled ? 'obs-disabled' : ''}`} ref={containerRef}>
      <label className="obs-label">
        {label}
        {required && <span className="obs-required">*</span>}
      </label>
      <div className="obs-input-wrapper">
        <div 
          className={`obs-input obs-dropdown-trigger ${isOpen ? 'is-open' : ''} ${disabled ? 'disabled' : ''}`} 
          onClick={handleToggle}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <span className={`obs-dropdown-value ${(multi ? (Array.isArray(value) && value.length > 0) : (value && value !== 'Select')) ? 'has-value' : ''}`} style={{ color: (value && value !== 'Select') ? '#334155' : '#94a3b8' }}>
            {getDisplayValue()}
          </span>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
        
        {isOpen && (
          <div className="obs-dropdown-menu">
            {options.map(option => (
              <div 
                key={getOptionKey(option)} 
                className={`obs-dropdown-option ${isOptionSelected(option) ? 'is-selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {multi && (
                  <input 
                    type="checkbox" 
                    className="obs-dropdown-checkbox" 
                    checked={isOptionSelected(option)}
                    readOnly
                  />
                )}
                <span>{getOptionLabel(option)}</span>
              </div>
            ))}
            {options.length === 0 && <div className="obs-dropdown-option" style={{ color: '#94a3b8', fontStyle: 'italic' }}>No options available</div>}
          </div>
        )}
        {Icon && <Icon size={16} className="obs-icon-right" />}
      </div>
      {error && <span className="obs-error-message">{error}</span>}
    </div>
  );
};

const CreateObservation = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isNearMiss, setIsNearMiss] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(true);

  // --- API DATA STATE ---
  const [enums, setEnums] = useState({});
  const [users, setUsers] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const [formData, setFormData] = useState({
    reported_date: currentDate,
    reported_time: currentTime,
    video_feed: 'Select',
    time_of_day: 'Afternoon',
    shift: 'Shift 2',
    operational_department: 'Select',
    area: 'Select',
    sub_area: 'Select',
    reported_by: 'Select',
    business_unit: 'Select',
    department: 'Select',
    designation: 'Select',
    weather: 'Select',
    observation_type: 'Select',
    operational_activity: 'Select',
    potential_severity: 'Select',
    observation_category: 'Select',
    hazard_category: 'Select',
    observation_group: 'Select',
    specific_detail: '',
    risk_category: '',
    repeated_number: 'Select',
    involved_personnel: 'Select',
    description: '',
    immediate_action: ''
  });

  const [attachments, setAttachments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [enumData, userData] = await Promise.all([
          api.getObservationEnums(),
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

  // Fetch sub-areas when area changes
  useEffect(() => {
    if (formData.area && formData.area !== 'Select') {
      api.getSubAreas(formData.area).then(data => {
        setSubAreas(data.map(item => item.sub_area));
      });
    } else {
      setSubAreas([]);
    }
  }, [formData.area]);

  const handleValueChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.area || formData.area === 'Select') newErrors.area = 'Area is required.';
    if (!formData.business_unit || formData.business_unit === 'Select') newErrors.business_unit = 'Business Unit is required.';
    if (!formData.department || formData.department === 'Select') newErrors.department = 'Department is required.';
    if (!formData.designation || formData.designation === 'Select') newErrors.designation = 'Designation is required.';
    if (!formData.operational_activity || formData.operational_activity === 'Select') newErrors.operational_activity = 'Operational Activity is required.';
    if (!formData.observation_group || formData.observation_group === 'Select') newErrors.observation_group = 'Observation Group is required.';
    if (!formData.specific_detail) newErrors.specific_detail = 'Specific Detail is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!isConfirmed) newErrors.confirmation = 'Reporter confirmation is required.';
    
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
        reported_date: formData.reported_date,
        reported_time: formData.reported_time.includes(':') ? formData.reported_time : `${formData.reported_time}:00`, // Ensure HH:MM:SS
        area_of_observation: formData.area,
        business_unit: formData.business_unit,
        department: formData.department,
        designation: formData.designation,
        operational_activity: formData.operational_activity,
        observation_group: formData.observation_group,
        specific_detail: formData.specific_detail,
        description: formData.description,
        reporter_confirmation: isConfirmed,
        // Optional fields
        video_feed: formData.video_feed !== 'Select' ? formData.video_feed : null,
        is_anonymous: isAnonymous,
        near_miss: isNearMiss,
        time_of_day: formData.time_of_day !== 'Select' ? formData.time_of_day : null,
        shift: formData.shift !== 'Select' ? formData.shift : null,
        operational_department: formData.operational_department !== 'Select' ? formData.operational_department : null,
        sub_area: formData.sub_area !== 'Select' ? formData.sub_area : null,
        reported_by: !isAnonymous ? formData.reported_by : null,
        weather: formData.weather !== 'Select' ? formData.weather : null,
        observation_type: formData.observation_type !== 'Select' ? formData.observation_type : null,
        potential_severity: formData.potential_severity !== 'Select' ? formData.potential_severity : null,
        observation_category: formData.observation_category !== 'Select' ? formData.observation_category : null,
        hazard_category: formData.hazard_category !== 'Select' ? formData.hazard_category : null,
        risk_category: formData.risk_category !== 'Select' ? formData.risk_category : null,
        repeated_observation_number: formData.repeated_number !== 'Select' ? formData.repeated_number : null,
        involved_personnel: formData.involved_personnel !== 'Select' ? formData.involved_personnel : null,
        immediate_action: formData.immediate_action || null,
        attachments: attachments // Array of {file_name, file_url, type, description}
      };

      // Ensure time format is HH:MM:SS if user entered HH:MM
      if (payload.reported_time.length === 5) {
        payload.reported_time += ':00';
      }

      const result = await api.createObservation(payload);
      alert(`Observation created successfully! Ref: ${result.observation_ref}`);
      // Reset full form after successful submission
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().slice(0, 5);
      setFormData({
        reported_date: today,
        reported_time: now,
        video_feed: 'Select',
        time_of_day: 'Select',
        shift: 'Select',
        operational_department: 'Select',
        area: 'Select',
        sub_area: 'Select',
        reported_by: 'Select',
        business_unit: 'Select',
        department: 'Select',
        designation: 'Select',
        weather: 'Select',
        observation_type: 'Select',
        operational_activity: 'Select',
        potential_severity: 'Select',
        observation_category: 'Select',
        hazard_category: 'Select',
        observation_group: 'Select',
        specific_detail: '',
        risk_category: '',
        repeated_number: 'Select',
        involved_personnel: 'Select',
        description: '',
        immediate_action: ''
      });
      setAttachments([]);
      setIsAnonymous(false);
      setIsNearMiss(false);
      setIsConfirmed(true);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(`Failed to create observation: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="obs-loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <Loader2 className="obs-animate-spin" size={48} color="#22d3ee" />
        <p style={{ color: '#64748b', fontSize: '18px' }}>Loading observation data...</p>
      </div>
    );
  }

  return (
    <div className="create-obs-container">
      <div className="obs-header">
        <h2 className="obs-title">New Observation</h2>
      </div>

      {/* Row 1 */}
      <div className="obs-grid-5">
        <div className="obs-field">
          <label className="obs-label">Observation ID</label>
          <input type="text" className="obs-input" value="--" disabled />
        </div>
        <div className="obs-field">
          <label className="obs-label">Status</label>
          <input type="text" className="obs-input" value="New" disabled />
        </div>
        <div className="obs-field">
          <label className="obs-label">Reported Date<span className="obs-required">*</span></label>
          <input 
            type="date" 
            className="obs-input" 
            value={formData.reported_date}
            onChange={(e) => handleValueChange('reported_date', e.target.value)}
          />
        </div>
        <div className="obs-field">
          <label className="obs-label">Reported Time <span className="obs-required">*</span></label>
          <div className="obs-input-wrapper">
            <input 
              type="text" 
              className="obs-input" 
              value={formData.reported_time}
              onChange={(e) => handleValueChange('reported_time', e.target.value)}
            />
            <Clock className="obs-icon-right" size={16} />
          </div>
        </div>
        
        <AppDropdown 
          label="Video Feed"
          options={['CCTV 1', 'CCTV 2', 'Mobile Camera']}
          value={formData.video_feed}
          onChange={(val) => handleValueChange('video_feed', val)}
        />
      </div>

      {/* Row 2: Toggles */}
      <div className="obs-toggles-row">
        <div className="obs-toggle-group">
          <span className="obs-label">Anonymous</span>
          <div 
            className={`obs-toggle-switch ${isAnonymous ? 'active' : ''}`}
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            <div className="obs-toggle-knob"></div>
          </div>
        </div>
        <div className="obs-checkbox-group">
          <input 
            type="checkbox" 
            className="obs-checkbox" 
            checked={isNearMiss}
            onChange={() => setIsNearMiss(!isNearMiss)}
          />
          <span className="obs-label">Near Miss</span>
        </div>
      </div>

      {/* Row 3 */}
      <div className="obs-grid-5">
        <AppDropdown 
          label="Time of Day"
          options={enums.time_of_day?.map(opt => opt.value) || enums.time_of_day || []}
          value={formData.time_of_day}
          onChange={(val) => handleValueChange('time_of_day', val)}
        />
        
        <AppDropdown 
          label="Shift"
          options={enums.shift?.map(opt => opt.value) || enums.shift || []}
          value={formData.shift}
          onChange={(val) => handleValueChange('shift', val)}
        />

        <AppDropdown 
          label="Operational Department"
          options={enums.operational_department?.map(opt => opt.value) || enums.operational_department || []}
          value={formData.operational_department}
          onChange={(val) => handleValueChange('operational_department', val)}
        />

        <AppDropdown 
          label="Area"
          required
          error={errors.area}
          options={enums.area_of_incident?.map(opt => opt.value) || enums.area_of_incident || []}
          value={formData.area}
          onChange={(val) => handleValueChange('area', val)}
        />

        <AppDropdown 
          label="Sub Area"
          icon={MapPin}
          options={subAreas}
          value={formData.sub_area}
          onChange={(val) => handleValueChange('sub_area', val)}
        />
      </div>

      {/* Row 4 */}
      <div className="obs-grid-5">
        <AppDropdown 
          label="Reported By"
          required
          disabled={isAnonymous}
          options={users.map(u => `${u.name}(${u.employee_id})`)}
          value={isAnonymous ? 'Select' : formData.reported_by}
          onChange={(val) => handleValueChange('reported_by', val)}
        />

        <AppDropdown 
          label="Business Unit"
          required
          error={errors.business_unit}
          disabled={isAnonymous}
          options={enums.business_unit?.map(opt => opt.value) || enums.business_unit || []}
          value={isAnonymous ? 'Select' : formData.business_unit}
          onChange={(val) => handleValueChange('business_unit', val)}
        />

        <AppDropdown 
          label="Department"
          required
          error={errors.department}
          disabled={isAnonymous}
          options={enums.department?.map(opt => opt.value) || enums.department || []}
          value={isAnonymous ? 'Select' : formData.department}
          onChange={(val) => handleValueChange('department', val)}
        />

        <AppDropdown 
          label="Designation"
          required
          error={errors.designation}
          disabled={isAnonymous}
          options={enums.designation?.map(opt => opt.value) || enums.designation || []}
          value={isAnonymous ? 'Select' : formData.designation}
          onChange={(val) => handleValueChange('designation', val)}
        />

        <AppDropdown 
          label="Weather"
          options={enums.weather?.map(opt => opt.value) || enums.weather || []}
          value={formData.weather}
          onChange={(val) => handleValueChange('weather', val)}
        />
      </div>

      {/* Row 5 */}
      <div className="obs-grid-5">
        <AppDropdown 
          label="Observation Type"
          options={enums.observation_type?.map(opt => opt.value) || []}
          value={formData.observation_type}
          onChange={(val) => handleValueChange('observation_type', val)}
        />

        <AppDropdown 
          label="Operational Activity"
          required
          error={errors.operational_activity}
          options={enums.operational_activities?.map(a => a.name) || []}
          value={formData.operational_activity}
          onChange={(val) => handleValueChange('operational_activity', val)}
        />

        <AppDropdown 
          label="Potential Severity"
          options={enums.severity_level}
          value={formData.potential_severity}
          onChange={(val) => handleValueChange('potential_severity', val)}
        />

        <AppDropdown 
          label="Observation Category"
          options={enums.observation_category?.map(opt => opt.value) || []}
          value={formData.observation_category}
          onChange={(val) => handleValueChange('observation_category', val)}
        />

        <AppDropdown 
          label="Hazard Category"
          options={enums.hazard_category?.map(opt => opt.value) || []}
          value={formData.hazard_category}
          onChange={(val) => handleValueChange('hazard_category', val)}
        />
      </div>

      {/* Row 6 */}
      <div className="obs-grid-5">
        <AppDropdown 
          label="Observation Group"
          required
          error={errors.observation_group}
          options={enums.incident_group?.map(opt => opt.value) || enums.incident_group || []}
          value={formData.observation_group}
          onChange={(val) => handleValueChange('observation_group', val)}
        />

        <div className={`obs-field ${errors.specific_detail ? 'has-error' : ''}`}>
          <label className="obs-label">Specific Detail<span className="obs-required">*</span></label>
          <input 
            type="text" 
            className="obs-input" 
            value={formData.specific_detail}
            onChange={(e) => handleValueChange('specific_detail', e.target.value)}
          />
          {errors.specific_detail && <span className="obs-error-message">{errors.specific_detail}</span>}
        </div>

        <AppDropdown 
          label="Risk Category"
          options={enums.risk_category?.map(opt => opt.value) || []}
          value={formData.risk_category}
          onChange={(val) => handleValueChange('risk_category', val)}
        />

        <AppDropdown 
          label="Repeated Observation Number"
          options={['None', 'OBS/2026/001', 'OBS/2026/042']}
          value={formData.repeated_number}
          onChange={(val) => handleValueChange('repeated_number', val)}
        />

        <div className="obs-field">
          <label className="obs-label">Involved Personnel</label>
          <div className="obs-input-wrapper">
             <div className="obs-input" style={{ backgroundColor: '#f8fafc', color: '#94a3b8' }}>Select</div>
             <PlusCircle className="add-personnel-icon" size={16} />
          </div>
        </div>
      </div>

      {/* Row 7: Textareas */}
      <div className="obs-grid-2">
        <div className="obs-field">
          <label className="obs-label">Description<span className="obs-required">*</span></label>
          <div className="obs-textarea-container">
            <textarea 
              className={`obs-textarea ${errors.description ? 'is-invalid' : ''}`}
              value={formData.description}
              onChange={(e) => handleValueChange('description', e.target.value)}
            ></textarea>
            <div className="obs-textarea-footer">
              <span className="obs-translate">Translate <ArrowUpFromLine size={12} /></span>
              <span className="obs-char-count">{formData.description.length}/3000</span>
            </div>
          </div>
        </div>
        <div className="obs-field">
          <label className="obs-label">Immediate Action</label>
          <div className="obs-textarea-container">
            <textarea 
               className="obs-textarea"
               value={formData.immediate_action}
               onChange={(e) => handleValueChange('immediate_action', e.target.value)}
            ></textarea>
            <div className="obs-textarea-footer">
              <span className="obs-translate">Translate <ArrowUpFromLine size={12} /></span>
              <span className="obs-char-count">{formData.immediate_action.length}/3000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className={`obs-confirmation ${errors.confirmation ? 'has-error' : ''}`}>
        <input 
          type="checkbox" 
          className="obs-checkbox" 
          checked={isConfirmed}
          onChange={() => setIsConfirmed(!isConfirmed)}
          style={{ marginTop: '2px' }}
        />
        <span className="obs-confirmation-text">
          I confirm the above information is accurate - ISO-45001 requires a confirmation that the reporter agrees the information is accurate and may be used for investigation.
        </span>
        {errors.confirmation && <div className="obs-error-message" style={{ marginLeft: '28px' }}>{errors.confirmation}</div>}
      </div>

      {/* Attachments Display Section */}
      <div className="obs-attachments-section">
        <h3 className="obs-attachments-title">Attachments ({attachments.length}/4)</h3>
        {attachments.length > 0 && (
          <div className="obs-attachments-list">
            {attachments.map((attr, idx) => (
              <div key={idx} className="obs-attachment-item">
                <div className="obs-attachment-preview">
                  {attr.type.startsWith('video/') ? (
                    <Video size={20} color="#0ea5e9" />
                  ) : (
                    <img src={attr.file_url} alt="Preview" className="obs-thumbnail" />
                  )}
                </div>
                <div className="obs-attachment-info">
                  <p className="obs-attachment-name">{attr.file_name}</p>
                  <p className="obs-attachment-desc">{attr.description || 'No description'}</p>
                </div>
                <button 
                  className="obs-remove-attachment" 
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="obs-actions">
        <button className="obs-btn obs-btn-cancel">CANCEL</button>
        <button className="obs-btn obs-btn-secondary" onClick={() => setIsUploadModalOpen(true)}>UPLOAD</button>
        <button className="obs-btn obs-btn-secondary">DRAFT</button>
        <button 
          className="obs-btn obs-btn-primary" 
          onClick={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? 'SUBMITTING...' : 'SUBMIT'}
        </button>
      </div>

      {/* Upload Modal Implementation */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={(newAttr) => setAttachments(prev => [...prev, newAttr])}
        existingAttachments={attachments}
        onPrefill={(suggestions) => {
          // Map AI suggestions → formData fields
          setFormData(prev => ({
            ...prev,
            area:                suggestions.area_of_observation  ?? prev.area,
            sub_area:            suggestions.sub_area             ?? prev.sub_area,
            business_unit:       suggestions.business_unit        ?? prev.business_unit,
            department:          suggestions.department           ?? prev.department,
            designation:         suggestions.designation          ?? prev.designation,
            operational_activity: suggestions.operational_activity ?? prev.operational_activity,
            operational_department: suggestions.operational_department ?? prev.operational_department,
            observation_group:   suggestions.observation_group    ?? prev.observation_group,
            specific_detail:     suggestions.specific_detail      ?? prev.specific_detail,
            description:         suggestions.description          ?? prev.description,
            weather:             suggestions.weather              ?? prev.weather,
            observation_type:    suggestions.observation_type     ?? prev.observation_type,
            potential_severity:  suggestions.potential_severity   ?? prev.potential_severity,
            observation_category: suggestions.observation_category ?? prev.observation_category,
            hazard_category:     suggestions.hazard_category      ?? prev.hazard_category,
            risk_category:       suggestions.risk_category        ?? prev.risk_category,
            immediate_action:    suggestions.immediate_action     ?? prev.immediate_action,
            time_of_day:         suggestions.time_of_day          ?? prev.time_of_day,
            shift:               suggestions.shift                ?? prev.shift,
          }));
          if (suggestions.near_miss !== undefined) setIsNearMiss(suggestions.near_miss);
        }}
      />

    </div>
  );
};

/**
 * Enhanced Upload Modal with AI Analysis
 */
const UploadModal = ({ isOpen, onClose, onUpload, existingAttachments, onPrefill }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState(null); // 'success' | 'error' | null
  const [analyzeMessage, setAnalyzeMessage] = useState('');
  const fileInputRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null); setPreview(null); setType(null);
      setDescription(''); setAnalyzing(false);
      setAnalyzeStatus(null); setAnalyzeMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const videoCount = existingAttachments.filter(a => a.type.startsWith('video/')).length;
  const imageCount = existingAttachments.filter(a => a.type.startsWith('image/')).length;
  const totalCount = existingAttachments.length;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Running counts so limits are checked across the batch being added
    let runningTotal = totalCount;
    let runningVideos = videoCount;
    let runningImages = imageCount;

    selectedFiles.forEach((selectedFile) => {
      const isVideo = selectedFile.type.startsWith('video/');
      const isImage = selectedFile.type.startsWith('image/');

      if (runningTotal >= 4) {
        alert(`Skipped "${selectedFile.name}" — maximum of 4 attachments reached.`);
        return;
      }
      if (isVideo && runningVideos >= 1) {
        alert(`Skipped "${selectedFile.name}" — only 1 video is allowed.`);
        return;
      }
      if (isImage && runningImages >= 3) {
        alert(`Skipped "${selectedFile.name}" — maximum of 3 images allowed.`);
        return;
      }

      // Read and add this file
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          file_name: selectedFile.name,
          file_url: reader.result,
          type: selectedFile.type,
          description: '',
        });
      };
      reader.readAsDataURL(selectedFile);

      // Update running counts
      runningTotal++;
      if (isVideo) runningVideos++;
      if (isImage) runningImages++;
    });

    // Update the label to show how many were picked
    setFile(selectedFiles[0]); // just for the dropzone label
    e.target.value = '';        // reset so same files can be re-selected if needed
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setAnalyzeStatus(null);
    setAnalyzeMessage('');
    try {
      const fd = new FormData();
      fd.append('files', file);
      if (description.trim()) fd.append('description', description.trim());
      const suggestions = await api.analyzeObservation(fd);
      if (suggestions.error) throw new Error(suggestions.message || suggestions.error);
      onPrefill(suggestions);
      // Auto-close modal so the user sees the pre-filled form immediately
      onClose();
    } catch (err) {
      setAnalyzeStatus('error');
      setAnalyzeMessage(err.message || 'AI analysis failed. Please fill the form manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        {/* Header */}
        <div className="upload-modal-header">
          <div className="header-title">
            <div className="upload-icon-circle"><Plus size={18} /></div>
            <span>Upload File</span>
          </div>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: '#64748b' }} />
        </div>

        {/* Drop zone */}
        <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <div className="dropzone-content">
            <Paperclip size={24} color="#94a3b8" />
            <p>{file ? `${file.name}${totalCount > 0 ? ` (+${totalCount} added)` : ''}` : 'Browse files or drag and drop (images & video)'}</p>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="upload-preview-container">
            {type.startsWith('video/') ? (
              <video src={preview} controls style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            )}
          </div>
        )}

        {/* Description */}
        <div className="modal-form-field">
          <div className="modal-label-row">
            <label className="modal-label">Description / Context</label>
            <div className="modal-label-actions"><span>Translate</span> <Languages size={14} /></div>
          </div>
          <textarea
            className="modal-textarea"
            rows={3}
            placeholder="Optional: give the AI extra context about this file..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-char-count">{description.length}/300</div>
        </div>

        {/* AI error banner — only shown on failure */}
        {analyzeStatus === 'error' && (
          <div className="ai-status ai-status-error">✗ {analyzeMessage}</div>
        )}

        {/* Footer: only two buttons */}
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>CANCEL</button>
          <button
            className="modal-btn modal-btn-analyze"
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            title="Use Gemini AI to auto-fill the form based on this image/video"
          >
            {analyzing
              ? <><Loader2 size={14} className="obs-animate-spin" style={{ display:'inline', marginRight: 6 }} />ANALYZING...</>
              : 'ANALYSE WITH AI'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateObservation;
