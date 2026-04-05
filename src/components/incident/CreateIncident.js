import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Plus, 
  Eye, 
  Paperclip,
  Languages
} from 'lucide-react';
import './CreateIncident.css';

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

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [formData] = useState({
    incidentRef: '--',
    status: '--',
    reportedDate: '05/04/2026',
    reportedTime: '12:42',
    incidentDate: '05/04/2026',
    incidentTime: '12:42',
    area: '',
    subArea: '',
    operationalActivity: '',
    incidentType: '',
    incidentGroup: '',
    subGroup: '',
    criticalIncident: '',
    riskCategory: '',
    actualSeverity: '',
    potentialSeverity: '',
    shiftManager: '',
    shiftSuperintendent: '',
    weather: '',
    shippingLine: '',
    containerNumber: '',
    shift: 'Shift 2',
    timeOfDay: 'Afternoon',
    description: '',
    actions: ''
  });

  const FormField = ({ label, required, children, icon: Icon, span = 1 }) => (
    <div className="form-field" style={{ gridColumn: `span ${span}` }}>
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="field-input-wrapper">
        {children}
        {Icon && <Icon size={16} className="field-icon" />}
      </div>
    </div>
  );

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

  return (
    <div className="dashboard-layout-main">
      <div className="content-padding">
        <div className="create-incident-container">
          
          <div className="incident-section" style={{ marginTop: '20px' }}>
            <div className="section-content">
              <div className="grid-5">
                <FormField label="Incident Reference Number">
                  <input type="text" className="field-input" value={formData.incidentRef} readOnly />
                </FormField>
                <FormField label="Status">
                  <input type="text" className="field-input" value={formData.status} readOnly />
                </FormField>
                <FormField label="Reported Date" required icon={Calendar}>
                  <input type="text" className="field-input" value={formData.reportedDate} readOnly />
                </FormField>
                <FormField label="Reported Time" required icon={Clock}>
                  <input type="text" className="field-input" value={formData.reportedTime} readOnly />
                </FormField>
                <FormField label="CCTV Footages">
                   <select className="field-select">
                     <option>Select</option>
                   </select>
                </FormField>

                <FormField label="Incident Date" required icon={Calendar}>
                   <input type="text" className="field-input" value={formData.incidentDate} />
                </FormField>
                <FormField label="Incident Time" required icon={Clock}>
                   <input type="text" className="field-input" value={formData.incidentTime} />
                </FormField>
                <FormField label="Area of Incident" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Sub Area" icon={MapPin}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Operational Activity" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>

                <FormField label="Incident Type" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Incident Group" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Sub Group" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Critical Incident" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Risk Category" required icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>

                <FormField label="Actual Severity" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Potential Severity" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Shift Manager" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Shift Superintendent" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Weather" icon={ChevronDown}>
                   <select className="field-select"><option>Select</option></select>
                </FormField>

                <FormField label="Shipping Line Details">
                   <input type="text" className="field-input" placeholder="Enter text" />
                </FormField>
                <FormField label="Container Number">
                   <input type="text" className="field-input" placeholder="Enter text" />
                </FormField>
                <FormField label="Shipping Line Informed ?">
                   <select className="field-select"><option>Select</option></select>
                </FormField>
                <FormField label="Shift" required icon={ChevronDown}>
                   <select className="field-select"><option>Shift 2</option></select>
                </FormField>
                <FormField label="Time of Day" icon={ChevronDown}>
                   <select className="field-select"><option>Afternoon</option></select>
                </FormField>
              </div>

              <div className="status-bar-container">
                <div className="status-bar">Reportable</div>
                <div className="status-bar">Recordable</div>
              </div>

              <div className="grid-4">
                 <FormField label="UIN Number" icon={Eye}>
                    <input type="text" className="field-input" placeholder="Enter text" />
                 </FormField>
                 <FormField label="Incident Title" span={2}>
                    <input type="text" className="field-input" placeholder="Enter text" />
                 </FormField>
                 <div className="grid-2-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', gridColumn: 'span 1' }}>
                    <FormField label="Reportable">
                      <input type="text" className="field-input" placeholder="Enter text" />
                    </FormField>
                    <FormField label="Recordable">
                      <input type="text" className="field-input" placeholder="Enter text" />
                    </FormField>
                 </div>
              </div>

              <div className="narrative-grid">
                 <div className="narrative-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                       <label className="field-label">Incident Description<span className="required-star">*</span></label>
                       <div className="add-btn"><Languages size={14} /> Translate</div>
                    </div>
                    <textarea className="field-textarea" rows={6} placeholder="Enter description"></textarea>
                    <div className="char-counter">0 / 3000</div>
                 </div>
                 <div className="narrative-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                       <label className="field-label">Immediate Action Taken</label>
                       <div className="add-btn"><Languages size={14} /> Translate</div>
                    </div>
                    <textarea className="field-textarea" rows={6} placeholder="Enter action taken"></textarea>
                    <div className="char-counter">0 / 3000</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Involved Person Section */}
          <div className="incident-section">
            <SectionHeader title="INVOLVED PERSON" isOpen={openSections.involved} onToggle={() => toggleSection('involved')} />
            {openSections.involved && (
              <div className="section-content">
                 <div className="grid-involved" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr 0.5fr 1.5fr 1fr 1fr', gap: '8px', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Worker Type</span>
                    <span className="field-label">Name</span>
                    <span className="field-label">ID</span>
                    <span className="field-label">Age</span>
                    <span className="field-label">Department / Company</span>
                    <span className="field-label">Designation</span>
                    <span className="field-label">Particulars</span>
                 </div>
                 <div className="grid-involved" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr 0.5fr 1.5fr 1fr 1fr', gap: '8px' }}>
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <input type="text" className="field-input" placeholder="ID" />
                    <input type="text" className="field-input" placeholder="Age" />
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

          {/* Collapsible Sections */}
          <div className="incident-section">
            <SectionHeader title="WITNESS" isOpen={openSections.witness} onToggle={() => toggleSection('witness')} />
            {openSections.witness && (
              <div className="section-content">
                 <div className="grid-5" style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Worker Type</span>
                    <span className="field-label">Name</span>
                    <span className="field-label">Department / Company</span>
                    <span className="field-label">Designation</span>
                    <span className="field-label">Testimony</span>
                 </div>
                 <div className="grid-5">
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
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

          <div className="incident-section">
            <SectionHeader title="EQUIPMENT INVOLVED" isOpen={openSections.equipment} onToggle={() => toggleSection('equipment')} />
            {openSections.equipment && (
              <div className="section-content">
                 <div className="sub-section-title" style={{ fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>Owned</div>
                 <div className="grid-5" style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Equipment Name</span>
                    <span className="field-label">Equipment ID</span>
                    <span className="field-label">Operator</span>
                    <span className="field-label">Particulars</span>
                    <span className="field-label">Predominant</span>
                 </div>
                 <div className="grid-5">
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <div className="field-input-wrapper">
                      <input type="text" className="field-input" readOnly />
                      <ChevronRight size={14} className="field-icon" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" /> <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Predominant</span>
                    </div>
                 </div>
                 
                 <div className="sub-section-title" style={{ fontSize: '12px', fontWeight: '800', margin: '20px 0 10px' }}>Third Party</div>
                 <div className="grid-5" style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Company Name</span>
                    <span className="field-label">Equipment ID</span>
                    <span className="field-label">Operator Name</span>
                    <span className="field-label">Equipment Position</span>
                    <span className="field-label">Degree of Damage</span>
                 </div>
                 <div className="grid-5">
                    <input type="text" className="field-input" placeholder="Enter" />
                    <input type="text" className="field-input" placeholder="Enter" />
                    <input type="text" className="field-input" placeholder="Enter" />
                    <input type="text" className="field-input" placeholder="Enter" />
                    <input type="text" className="field-input" placeholder="Enter" />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="add-btn"><Plus size={14} /> ADD</div>
                 </div>
              </div>
            )}
          </div>

          <div className="incident-section">
            <SectionHeader title="CONTAINER DETAILS" isOpen={openSections.container} onToggle={() => toggleSection('container')} />
            {openSections.container && (
              <div className="section-content">
                 <div className="grid-3" style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Container Number</span>
                    <span className="field-label">Damage Location</span>
                    <span className="field-label">Description</span>
                 </div>
                 <div className="grid-3">
                    <input type="text" className="field-input" placeholder="Enter" />
                    <select className="field-select"><option>Select</option></select>
                    <input type="text" className="field-input" placeholder="Enter" />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <div className="add-btn"><Plus size={14} /> ADD</div>
                 </div>
              </div>
            )}
          </div>

          <div className="incident-section">
            <SectionHeader title="ENVIRONMENTAL DETAILS" isOpen={openSections.environmental} onToggle={() => toggleSection('environmental')} />
            {openSections.environmental && (
              <div className="section-content">
                 <div className="grid-3">
                    <div className="form-field">
                      <label className="field-label">Designated Environmentally Sensitive Area?</label>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="radio" name="env1" /> Yes</label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="radio" name="env1" /> No</label>
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="field-label">Remarks</label>
                      <input type="text" className="field-input" placeholder="Remarks" />
                    </div>
                 </div>
                 <div className="grid-3" style={{ marginTop: '16px' }}>
                    <div className="form-field">
                      <label className="field-label">Recovery Clean-up / Remediation Required?</label>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="radio" name="env2" /> Yes</label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="radio" name="env2" /> No</label>
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="field-label">Remarks</label>
                      <input type="text" className="field-input" placeholder="Remarks" />
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="incident-section">
            <SectionHeader title="TASK CONDITION" isOpen={openSections.task} onToggle={() => toggleSection('task')} />
            {openSections.task && (
              <div className="section-content">
                 <div className="grid-5" style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <span className="field-label">Roster Shift</span>
                    <span className="field-label">Traffic Volume</span>
                    <span className="field-label">Traffic Flow</span>
                    <span className="field-label">Lighting Condition</span>
                    <span className="field-label">Road Surface</span>
                 </div>
                 <div className="grid-5">
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                    <select className="field-select"><option>Select</option></select>
                 </div>
              </div>
            )}
          </div>

          <div className="incident-section">
            <SectionHeader title="PERMIT TO WORK DETAILS" isOpen={openSections.permit} onToggle={() => toggleSection('permit')} />
            {openSections.permit && (
              <div className="section-content">
                 <div className="grid-3">
                    <FormField label="Work Permit Obtained?">
                      <select className="field-select"><option>Select</option></select>
                    </FormField>
                    <FormField label="Remarks">
                      <div className="field-input-wrapper">
                        <input type="text" className="field-input" placeholder="Remarks" />
                        <Paperclip size={14} className="field-icon" />
                      </div>
                    </FormField>
                 </div>
              </div>
            )}
          </div>

          <div className="incident-section">
            <SectionHeader title="REPORTED PERSON" isOpen={openSections.reported} onToggle={() => toggleSection('reported')} />
            {openSections.reported && (
              <div className="section-content">
                 <div className="grid-4">
                    <div className="form-field">
                      <label className="field-label">Incident Reported By</label>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" /> Me</label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" /> Someone Else</label>
                      </div>
                    </div>
                    <FormField label="Person" required>
                      <select className="field-select"><option>Select</option></select>
                    </FormField>
                 </div>
                 <div className="grid-4" style={{ marginTop: '16px' }}>
                    <div className="form-field">
                      <label className="field-label">Incident Reported To</label>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" /> Me</label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" /> Someone Else</label>
                      </div>
                    </div>
                    <FormField label="Person">
                      <select className="field-select"><option>Select</option></select>
                    </FormField>
                 </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="form-footer">
            <button className="btn btn-cancel">CANCEL</button>
            <button className="btn btn-primary">UPLOAD</button>
            <button className="btn btn-primary">DRAFT</button>
            <button className="btn btn-primary">SUBMIT</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
