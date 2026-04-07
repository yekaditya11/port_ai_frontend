import React, { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import AppDropdown from '../common/AppDropdown';
import './IncidentInspection.css';

const InspectionAccordion = ({ title, status = 'N/A', defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`inspection-accordion-item ${isOpen ? 'active' : ''}`}>
      <div className="inspection-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title-box">
          <div className="accordion-checkbox">
            {isOpen && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '1px' }}></div>}
          </div>
          <span className="accordion-label">{title}</span>
          <span className="accordion-status">{status}</span>
        </div>
        {isOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
      </div>
      {isOpen && (
        <div className="inspection-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

const IncidentInspection = ({ 
  incident = {}, 
  formData = {}, 
  involvedPersons = [],
  setInvolvedPersons,
  witnesses = [],
  setWitnesses,
  equipmentInvolved = [],
  setEquipmentInvolved,
  environmentalDetail = {},
  setEnvironmentalDetail,
  taskCondition = {},
  setTaskCondition,
  permitDetail = {},
  setPermitDetail,
  handleValueChange,
  handleSave,
  users = []
}) => {

  const handleInvolvedPersonChange = (index, field, value) => {
    const updated = [...involvedPersons];
    updated[index][field] = value;

    if (field === 'name') {
      const user = users.find(u => u.name === value);
      if (user) {
        updated[index].id = user.employee_id || '';
        updated[index].department = user.department || 'Operations';
        updated[index].designation = user.designation || 'Operator';
      }
    }
    setInvolvedPersons(updated);
  };

  const handleAddWitness = () => {
    setWitnesses([...witnesses, { worker_type: 'Employee', person_name: 'Select', employee_id: '', designation: '', company_name: '', testimony: '' }]);
  };

  const handleWitnessChange = (index, field, value) => {
    const updated = [...witnesses];
    updated[index][field] = value;

    if (field === 'person_name') {
      const user = users.find(u => u.name === value);
      if (user) {
        updated[index].employee_id = user.employee_id || '';
        updated[index].company_name = user.department || 'Operations';
        updated[index].designation = user.designation || 'Operator';
      }
    }
    setWitnesses(updated);
  };

  const handleTaskConditionChange = (field, value) => {
    setTaskCondition(prev => ({ ...prev, [field]: value }));
  };

  const handleEnvironmentalChange = (field, value) => {
    setEnvironmentalDetail(prev => ({ ...prev, [field]: value }));
  };

  const handlePermitChange = (field, value) => {
    setPermitDetail(prev => ({ ...prev, [field]: value }));
  };

  const userOptions = users.map(u => u.name);

  return (
    <div className="rev-form-container">
      {/* Overview Left Sidebar */}
      <div className="rev-overview-sidebar">
        <Eye size={18} />
        <span className="sidebar-text">Overview</span>
      </div>

      <div className="rev-form-main">
        {/* Top Header Grid */}
        <div className="inspection-header-grid">
          <div className="inspection-header-item">
            <span className="inspection-header-label">Event Based</span>
            <span className="inspection-header-value">{formData.incident_type?.join(', ') || '--'}</span>
          </div>
          <div className="inspection-header-item">
            <span className="inspection-header-label">Group</span>
            <span className="inspection-header-value">{formData.incident_group?.join(', ') || '--'}</span>
          </div>
          <div className="inspection-header-item">
            <span className="inspection-header-label">Inspection Title</span>
            <span className="inspection-header-value">{formData.incident_title || '--'}</span>
          </div>
          <div className="inspection-header-item">
            <span className="inspection-header-label">Criticality</span>
            <span className="inspection-header-value">{formData.actual_severity || '--'}</span>
          </div>
          <div className="inspection-header-item">
            <span className="inspection-header-label">Priority</span>
            <span className="inspection-header-value">{formData.priority || '--'}</span>
          </div>
        </div>



        {/* Accordion Sections */}
        <div className="inspection-accordions">
          <InspectionAccordion title="INVOLVED PERSON" status={involvedPersons.length > 0 ? '' : 'N/A'} defaultOpen={true}>
            <div className="inspection-table-container">
              <table className="inspection-table">
                <thead>
                  <tr>
                    <th>Worker Type</th>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Dept</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {involvedPersons.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <select 
                          className="rev-input" 
                          value={p.worker_type} 
                          onChange={(e) => handleInvolvedPersonChange(i, 'worker_type', e.target.value)}
                        >
                          <option>Employee</option>
                          <option>Contractor</option>
                          <option>Visitor</option>
                        </select>
                      </td>
                      <td style={{ minWidth: '180px' }}>
                        <AppDropdown 
                          placeholder="Search Name..."
                          options={userOptions}
                          value={p.name}
                          onChange={(val) => handleInvolvedPersonChange(i, 'name', val)}
                        />
                      </td>
                      <td><input className="rev-input" value={p.id} readOnly /></td>
                      <td><input className="rev-input" value={p.department} readOnly /></td>
                      <td><input className="rev-input" value={p.designation} readOnly /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InspectionAccordion>

          <InspectionAccordion title="WITNESS" status={witnesses.length > 0 ? '' : 'N/A'} defaultOpen={true}>
            <div className="inspection-table-container">
              <table className="inspection-table">
                <thead>
                  <tr>
                    <th>Worker Type</th>
                    <th>Name</th>
                    <th>Dept/Company</th>
                    <th>Designation</th>
                    <th>Testimony</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {witnesses.map((w, i) => (
                    <tr key={i}>
                      <td>
                        <select 
                          className="rev-input" 
                          value={w.worker_type} 
                          onChange={(e) => handleWitnessChange(i, 'worker_type', e.target.value)}
                        >
                          <option>Employee</option>
                          <option>Contractor</option>
                          <option>Visitor</option>
                        </select>
                      </td>
                      <td style={{ minWidth: '180px' }}>
                        <AppDropdown 
                          placeholder="Search Name..."
                          options={userOptions}
                          value={w.person_name}
                          onChange={(val) => handleWitnessChange(i, 'person_name', val)}
                        />
                      </td>
                      <td><input className="rev-input" value={w.company_name} readOnly /></td>
                      <td><input className="rev-input" value={w.designation} readOnly /></td>
                      <td><input className="rev-input" value={w.testimony} onChange={(e) => handleWitnessChange(i, 'testimony', e.target.value)} /></td>
                      <td><Trash2 size={14} color="#f87171" onClick={() => setWitnesses(witnesses.filter((_, idx) => idx !== i))} style={{ cursor: 'pointer' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={handleAddWitness}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#22d3ee', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={14} /> ADD WITNESS
              </button>
            </div>
          </InspectionAccordion>

          <InspectionAccordion title="EQUIPMENT INVOLVED" status={equipmentInvolved.length > 0 ? '' : 'N/A'}>
            <div className="inspection-table-container">
               <table className="inspection-table">
                 <thead>
                   <tr>
                     <th>Ownership</th>
                     <th>Equipment</th>
                     <th>ID/Ext ID</th>
                     <th>Operator</th>
                     <th>Position</th>
                     <th>Damage</th>
                   </tr>
                 </thead>
                 <tbody>
                   {equipmentInvolved.map((e, i) => (
                     <tr key={i}>
                       <td>{e.ownership_type}</td>
                       <td>{e.equipment_name || '--'}</td>
                       <td>{e.equipment_ext_id || '--'}</td>
                       <td>{e.operator_name || '--'}</td>
                       <td>{e.equipment_position || '--'}</td>
                       <td>{e.degree_of_damage || '--'}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </InspectionAccordion>

          <InspectionAccordion title="ENVIRONMENTAL DETAILS">
            <div className="inspection-detail-grid">
              <div className="rev-field-group">
                <label className="rev-field-label">Sensitive Area</label>
                <select className="rev-input" value={environmentalDetail.sensitive_area ? 'Yes' : 'No'} onChange={(e) => handleEnvironmentalChange('sensitive_area', e.target.value === 'Yes')}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="rev-field-group" style={{ gridColumn: 'span 4' }}>
                <label className="rev-field-label">Sensitive Area Remarks</label>
                <input className="rev-input" value={environmentalDetail.sensitive_remarks} onChange={(e) => handleEnvironmentalChange('sensitive_remarks', e.target.value)} />
              </div>
              <div className="rev-field-group">
                <label className="rev-field-label">Remediation Required</label>
                <select className="rev-input" value={environmentalDetail.remediation_required ? 'Yes' : 'No'} onChange={(e) => handleEnvironmentalChange('remediation_required', e.target.value === 'Yes')}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="rev-field-group" style={{ gridColumn: 'span 4' }}>
                <label className="rev-field-label">Remediation Remarks</label>
                <input className="rev-input" value={environmentalDetail.remediation_remarks} onChange={(e) => handleEnvironmentalChange('remediation_remarks', e.target.value)} />
              </div>
            </div>
          </InspectionAccordion>

          <InspectionAccordion title="TASK CONDITION" defaultOpen={true}>
            <div className="inspection-table-container" style={{ padding: '0px' }}>
              <table className="inspection-table">
                <thead>
                  <tr>
                    <th>Roster Shift</th>
                    <th>Traffic Volume</th>
                    <th>Traffic Flow</th>
                    <th>Lighting Condition</th>
                    <th>Road Surface</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select className="rev-input" value={taskCondition.roster_shift} onChange={(e) => handleTaskConditionChange('roster_shift', e.target.value)}>
                        <option>Select</option>
                        <option>A Shift</option>
                        <option>B Shift</option>
                        <option>C Shift</option>
                      </select>
                    </td>
                    <td>
                      <select className="rev-input" value={taskCondition.traffic_volume} onChange={(e) => handleTaskConditionChange('traffic_volume', e.target.value)}>
                        <option>Select</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </td>
                    <td>
                      <select className="rev-input" value={taskCondition.traffic_flow} onChange={(e) => handleTaskConditionChange('traffic_flow', e.target.value)}>
                        <option>Select</option>
                        <option>Smooth</option>
                        <option>Moderate</option>
                        <option>Congested</option>
                      </select>
                    </td>
                    <td>
                      <select className="rev-input" value={taskCondition.lighting_condition} onChange={(e) => handleTaskConditionChange('lighting_condition', e.target.value)}>
                        <option>Select</option>
                        <option>Daylight</option>
                        <option>Artificial</option>
                        <option>Poor</option>
                      </select>
                    </td>
                    <td>
                      <select className="rev-input" value={taskCondition.road_surface} onChange={(e) => handleTaskConditionChange('road_surface', e.target.value)}>
                        <option>Select</option>
                        <option>Dry</option>
                        <option>Wet</option>
                        <option>Icy</option>
                        <option>Damaged</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InspectionAccordion>

          <InspectionAccordion title="PERMIT TO WORK DETAILS">
            <div className="inspection-detail-grid">
              <div className="rev-field-group">
                <label className="rev-field-label">Work Permit Obtained</label>
                <select className="rev-input" value={permitDetail.work_permit_obtained} onChange={(e) => handlePermitChange('work_permit_obtained', e.target.value)}>
                  <option>No</option>
                  <option>Yes</option>
                  <option>N/A</option>
                </select>
              </div>
              <div className="rev-field-group" style={{ gridColumn: 'span 4' }}>
                <label className="rev-field-label">Remarks</label>
                <input className="rev-input" value={permitDetail.remarks} onChange={(e) => handlePermitChange('remarks', e.target.value)} />
              </div>
            </div>
          </InspectionAccordion>
        </div>

        {/* Narratives */}
        <div className="inspector-narratives">
          <div className="narrative-box">
            <div className="narrative-header">
              <span className="narrative-label">INSPECTOR NOTES</span>
            </div>
            <div className="narrative-input-box">
              <span className="narrative-placeholder">Enter</span>
              <textarea 
                style={{ width: '100%', height: '80px', border: 'none', resize: 'none', background: 'transparent', outline: 'none', marginTop: '10px', fontSize: '12px' }}
                value={formData.inspector_notes || ''}
                onChange={(e) => handleValueChange('inspector_notes', e.target.value)}
              />
              <div className="narrative-translate">Translate</div>
            </div>
          </div>
          <div className="narrative-box">
            <div className="narrative-header">
              <span className="narrative-label">INSPECTOR COMMENTS</span>
            </div>
            <div className="narrative-input-box">
              <span className="narrative-placeholder">Enter</span>
              <textarea 
                style={{ width: '100%', height: '80px', border: 'none', resize: 'none', background: 'transparent', outline: 'none', marginTop: '10px', fontSize: '12px' }}
                value={formData.inspector_comments || ''}
                onChange={(e) => handleValueChange('inspector_comments', e.target.value)}
              />
              <div className="narrative-translate">Translate</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncidentInspection;
