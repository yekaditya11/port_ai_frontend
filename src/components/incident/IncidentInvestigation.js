import React, { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Trash2,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import AppDropdown from '../common/AppDropdown';
import '../incident/IncidentInspection.css'; /* Reuse common accordion CSS */
import './IncidentInvestigation.css';

const InvestigationAccordion = ({ title, status = '', defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`inspection-accordion-item ${isOpen ? 'active' : ''}`}>
      <div className="inspection-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title-box">
          <div className="accordion-checkbox">
            {isOpen && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '1px' }}></div>}
          </div>
          <span className="accordion-label" style={{ fontWeight: 700, color: '#1e293b' }}>{title}</span>
          {status && <span className="accordion-status">{status}</span>}
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

const IncidentInvestigation = ({ 
  incident = {}, 
  formData = {}, 
  users = [],
  investigationTeam = { lead_investigator_id: null, team_members: [] },
  setInvestigationTeam,
  sequenceOfEvents = [],
  setSequenceOfEvents,
  peepos = [],
  setPeepos,
  investigationAnalyses = [],
  setInvestigationAnalyses,
  handleValueChange,
  handleSave,
  handleNext
}) => {

  const userOptions = users.map(u => u.name);

  // --- Helpers for User mapping ---
  const getUserById = (id) => users.find(u => u.employee_id === id || u.id === id);
  const getUserByName = (name) => users.find(u => u.name === name);

  const getLeadUserName = () => {
    if (!investigationTeam.lead_investigator_id) return 'Select';
    const u = getUserById(investigationTeam.lead_investigator_id);
    return u ? u.name : 'Select';
  };

  const handleLeadChange = (val) => {
    const u = getUserByName(val);
    setInvestigationTeam({
      ...investigationTeam,
      lead_investigator_id: u ? (u.employee_id || u.id) : null
    });
  };

  const currentLeadUser = getUserById(investigationTeam.lead_investigator_id);

  // --- Sequences ---

  const handleEventChange = (index, field, value) => {
    const up = [...sequenceOfEvents];
    up[index][field] = value;
    setSequenceOfEvents(up);
  };

  const removeEvent = (index) => {
    setSequenceOfEvents(sequenceOfEvents.filter((_, i) => i !== index));
  };

  // --- Peepos ---
  const handleAddPeepo = () => {
    setPeepos([...peepos, { category: 'Select', sub_category: 'Select', description: '' }]);
  };

  const handlePeepoChange = (index, field, value) => {
    const up = [...peepos];
    up[index][field] = value;
    setPeepos(up);
  };

  const removePeepo = (index) => {
    setPeepos(peepos.filter((_, i) => i !== index));
  };

  // --- Analysis ---
  const [newAnalysis, setNewAnalysis] = useState({ absent_failed_barriers: '', immediate_cause: 'Select', precondition: '', underlying_cause: '' });

  const handleAnalysisAdd = () => {
    setInvestigationAnalyses([...investigationAnalyses, { ...newAnalysis }]);
    setNewAnalysis({ absent_failed_barriers: '', immediate_cause: 'Select', precondition: '', underlying_cause: '' });
  };

  const removeAnalysis = (index) => {
    setInvestigationAnalyses(investigationAnalyses.filter((_, i) => i !== index));
  };


  const renderSequencePhase = (phaseLabel) => {
    const events = sequenceOfEvents.map((evt, i) => ({ evt, i })).filter(x => x.evt.phase === phaseLabel);

    return (
      <div className="seq-phase-block">
        <h5 className="seq-phase-title">{phaseLabel}</h5>
        
        {/* The List of Existing Events */}
        {events.length > 0 && (
          <div className="seq-list">
            {events.map(({evt, i}) => (
              <div key={i} className="seq-item-row">
                <div className="seq-checkbox">
                   <input type="checkbox" checked={evt.is_main_event} onChange={(e) => handleEventChange(i, 'is_main_event', e.target.checked)} />
                </div>
                <div className="seq-date">{evt.event_date || '--'}</div>
                <div className="seq-time">{evt.event_time || '--'}</div>
                <div className="seq-desc">{evt.description}</div>
                <div className="seq-actions">
                  <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeEvent(i)}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* The Input For New Event */}
        <div className="seq-input-row" style={{ marginTop: '10px' }}>
             <div className="seq-inputs-grid">
                <div className="rev-field-group">
                  <label className="rev-field-label">Date</label>
                  <input type="date" className="rev-input" 
                    onChange={(e) => {
                       // Temporary state logic could be extracted, but mapped directly for ADD ease
                       const dummy = document.getElementById(`temp-date-${phaseLabel}`);
                       if(dummy) dummy.value = e.target.value;
                    }}
                    id={`temp-date-${phaseLabel}`}
                  />
                </div>
                <div className="rev-field-group">
                  <label className="rev-field-label">Time</label>
                  <input type="time" className="rev-input" id={`temp-time-${phaseLabel}`} />
                </div>
                <div className="rev-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="rev-field-label">Description</label>
                  <input type="text" className="rev-input" style={{ borderBottom: '1px solid #cbd5e1' }} id={`temp-desc-${phaseLabel}`} />
                </div>
             </div>
             <button className="btn-seq-add" onClick={() => {
                const dt = document.getElementById(`temp-date-${phaseLabel}`)?.value || '';
                const tm = document.getElementById(`temp-time-${phaseLabel}`)?.value || '';
                const desc = document.getElementById(`temp-desc-${phaseLabel}`)?.value || '';
                if(dt || desc) {
                    setSequenceOfEvents([...sequenceOfEvents, { phase: phaseLabel, event_date: dt, event_time: tm, description: desc, is_main_event: false }]);
                    document.getElementById(`temp-date-${phaseLabel}`).value = '';
                    document.getElementById(`temp-time-${phaseLabel}`).value = '';
                    document.getElementById(`temp-desc-${phaseLabel}`).value = '';
                }
             }}>
                <Plus size={14} /> ADD
             </button>
        </div>
      </div>
    );
  };

  return (
    <div className="rev-form-container">
      <div className="rev-overview-sidebar">
        <Eye size={18} />
        <span className="sidebar-text">Overview</span>
      </div>

      <div className="rev-form-main">
        <div className="inspection-accordions">

          {/* TEAM */}
          <InvestigationAccordion title="INVESTIGATION TEAM" status={<span style={{color: '#94a3b8'}}>N/A</span>} defaultOpen={true}>
            <div className="inv-team-grid">
               <div className="inv-box">
                  <label className="inv-label">Lead Investigator</label>
                  <AppDropdown 
                     options={userOptions}
                     value={getLeadUserName()}
                     onChange={handleLeadChange}
                     placeholder="Select"
                  />
               </div>
               <div className="inv-box">
                  <label className="inv-label">Designation</label>
                  <div className="inv-readonly">{currentLeadUser?.designation || '--'}</div>
               </div>
               <div className="inv-box">
                  <label className="inv-label">Department</label>
                  <div className="inv-readonly">{currentLeadUser?.department || '--'}</div>
               </div>
               <div className="inv-box" style={{ gridColumn: 'span 3' }}>
                  <label className="inv-label" style={{ marginBottom: '5px', display: 'block' }}>Team Member(s)</label>
                  <AppDropdown 
                     options={userOptions}
                     value={investigationTeam.team_members || []}
                     onChange={(val) => setInvestigationTeam({...investigationTeam, team_members: val})}
                     placeholder="Select"
                     multiSelect={true}
                  />
               </div>
            </div>
          </InvestigationAccordion>

          {/* SEQUENCE */}
          <InvestigationAccordion title="SEQUENCE OF EVENTS" status={<CheckCircle2 size={16} color="#10b981"/>} defaultOpen={true}>
             <div className="seq-container">
                {renderSequencePhase('Pre Incident')}
                {renderSequencePhase('At The Time Of Event')}
                {renderSequencePhase('Post Incident')}
             </div>
          </InvestigationAccordion>

          {/* PEEPO */}
          <InvestigationAccordion title="PEEPO" status={<CheckCircle2 size={16} color="#10b981"/>} defaultOpen={true}>
             <div className="peepo-container">
                <table className="inv-table peepo-table">
                   <thead>
                      <tr>
                         <th>CATEGORY</th>
                         <th>SUB CATEGORY</th>
                         <th style={{ width: '45%' }}>DESCRIPTION</th>
                         <th className="peepo-header-evidence">EVIDENCE LOG</th>
                      </tr>
                   </thead>
                   <tbody>
                      {peepos.map((p, i) => (
                         <tr key={i}>
                            <td>
                               <div style={{ display: 'flex', alignItems: 'center' }}>
                                 <input type="checkbox" style={{ marginRight: '8px' }} />
                                 <select className="rev-input" value={p.category} onChange={(e) => handlePeepoChange(i, 'category', e.target.value)}>
                                    <option>Select</option>
                                    <option>Environment</option>
                                    <option>Process</option>
                                    <option>Organization</option>
                                    <option>People</option>
                                    <option>Equipment</option>
                                 </select>
                               </div>
                            </td>
                            <td>
                               <select className="rev-input" value={p.sub_category} onChange={(e) => handlePeepoChange(i, 'sub_category', e.target.value)}>
                                  <option>Select</option>
                                  <option>Traffic Condition</option>
                                  <option>RA, SOP for process</option>
                                  <option>Infrastructure</option>
                                  <option>Tools</option>
                               </select>
                            </td>
                            <td>
                               <input className="rev-input" value={p.description} placeholder="Enter" onChange={(e) => handlePeepoChange(i, 'description', e.target.value)} />
                            </td>
                            <td>
                               <div className="peepo-actions">
                                 <Paperclip size={14} color="#64748b" />
                                 <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removePeepo(i)} />
                               </div>
                            </td>
                         </tr>
                      ))}
                      {peepos.length > 0 && (
                          <tr><td colSpan="4" style={{ padding: '0' }} /></tr> 
                      )}
                      <tr>
                          <td colSpan="4">
                             <button className="btn-peepo-add" onClick={handleAddPeepo}><Plus size={14} /> ADD</button>
                          </td>
                      </tr>
                   </tbody>
                </table>
             </div>

             {/* PLACHOLDERS FOR COMPLIANCE */}
             <div className="compliance-placeholders" style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
                <button className="btn-compliance">APPLY CHECKLIST</button>
                <div style={{ fontSize: '12px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <span>1. Improper stacking of containers <Eye size={14} style={{marginLeft: '10px', verticalAlign: 'middle', color: '#000'}}/></span>
                   <span style={{ color: '#64748b' }}>Score : 0%</span>
                </div>
                <button className="btn-compliance" style={{ marginTop: '20px' }}>APPLY COMPLIANCE</button>
             </div>
          </InvestigationAccordion>

          {/* ANALYSIS */}
          <InvestigationAccordion title="ANALYSIS" status={<CheckCircle2 size={16} color="#10b981"/>} defaultOpen={true}>
             <div className="analysis-container">
                 <div className="analysis-input-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '15px' }}>
                    <div className="rev-field-group" style={{ flex: 1 }}>
                       <label className="rev-field-label">Absent/Failed Barriers *</label>
                       <input className="rev-input" value={newAnalysis.absent_failed_barriers} onChange={(e) => setNewAnalysis({...newAnalysis, absent_failed_barriers: e.target.value})} placeholder="--" />
                    </div>
                    <div className="rev-field-group" style={{ flex: 1 }}>
                       <label className="rev-field-label">Immediate Cause *</label>
                       <select className="rev-input" value={newAnalysis.immediate_cause} onChange={(e) => setNewAnalysis({...newAnalysis, immediate_cause: e.target.value})}>
                          <option>Select</option>
                          <option>Unsafe Act</option>
                          <option>Unsafe Conditions</option>
                       </select>
                    </div>
                    <div className="rev-field-group" style={{ flex: 1 }}>
                       <label className="rev-field-label">Precondition *</label>
                       <input className="rev-input" value={newAnalysis.precondition} onChange={(e) => setNewAnalysis({...newAnalysis, precondition: e.target.value})} placeholder="--" />
                    </div>
                    <div className="rev-field-group" style={{ flex: 1 }}>
                       <label className="rev-field-label">Underlying Cause</label>
                       <input className="rev-input" value={newAnalysis.underlying_cause} onChange={(e) => setNewAnalysis({...newAnalysis, underlying_cause: e.target.value})} placeholder="--" />
                    </div>
                    <button className="btn-seq-add" onClick={handleAnalysisAdd} style={{ marginTop: '20px' }}>
                       <Plus size={14} /> ADD
                    </button>
                 </div>

                 {investigationAnalyses.length > 0 && (
                     <div className="analysis-list">
                         <table className="inv-table analysis-table">
                            <tbody>
                                {investigationAnalyses.map((a, i) => (
                                    <tr key={i}>
                                        <td style={{ width: '25%' }}><input type="checkbox" style={{ marginRight: '8px' }}/> {a.absent_failed_barriers}</td>
                                        <td style={{ width: '25%' }}>{a.immediate_cause}</td>
                                        <td style={{ width: '25%' }}>{a.precondition}</td>
                                        <td style={{ width: '20%' }}>{a.underlying_cause}</td>
                                        <td style={{ width: '5%', textAlign: 'right' }}>
                                           <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeAnalysis(i)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                     </div>
                 )}

                 <div className="analysis-comments">
                    <label className="rev-field-label" style={{ padding: '0 15px' }}>Comments</label>
                    <div className="analysis-rtf-box">
                       <div className="rtf-toolbar">
                          <b>B</b> <i>I</i> <u>U</u> <ChevronDown size={14} />
                       </div>
                       <textarea 
                          className="rtf-textarea" 
                          value={formData.investigation_comments || ''}
                          onChange={(e) => handleValueChange('investigation_comments', e.target.value)}
                       />
                    </div>
                 </div>
             </div>
          </InvestigationAccordion>

        </div>

        {/* Footer Actions */}
        <div className="rev-footer-layout" style={{ justifyContent: 'flex-end', gap: '15px', marginTop: '20px', padding: '20px' }}>
           <button className="btn-cancel">CANCEL</button>
           <button className="btn-action">UPLOAD</button>
           <button className="btn-action">PRINT</button>
           <button className="btn-action">ROOT CAUSE</button>
           <button className="btn-save" onClick={handleSave}>SAVE</button>
           <button className="btn-cancel" onClick={handleNext}>NEXT</button>
        </div>

      </div>
    </div>
  );
};

export default IncidentInvestigation;
