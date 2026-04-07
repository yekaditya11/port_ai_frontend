import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  MapPin,
  AlertCircle,
  ArrowRight,
  Paperclip,
  Languages,
  Plus,
  Sparkles
} from 'lucide-react';
import Loader from '../common/Loader';
import { api } from '../../services/api';
import CreateIncident from './CreateIncident';
import IncidentInspection from './IncidentInspection';
import IncidentInvestigation from './IncidentInvestigation';
import AppDropdown from '../common/AppDropdown';
import './IncidentReviewPage.css';


// --- MAIN PAGE ---

const IncidentReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [enums, setEnums] = useState({});
  const [users, setUsers] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [activeTab, setActiveTab] = useState('Review');
  const [auditInsights, setAuditInsights] = useState({});
  const [isAuditing, setIsAuditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAiAudit = async () => {
    setIsAuditing(true);
    setAuditInsights({});
    try {
      const results = await api.auditIncident(id);
      setAuditInsights(results);
      if (Object.keys(results).length === 0) {
        showToast("✅ AI Audit Complete: No data mismatches found!", "success");
      }
    } catch (err) {
      console.error("AI Audit failed:", err);
      showToast("❌ AI Audit Failed. Please check console for details.", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  const [involvedPersons, setInvolvedPersons] = useState([
    { worker_type: 'Select', name: 'Select', id: '', age: '', department: '', designation: '', particulars: '' }
  ]);
  const [witnesses, setWitnesses] = useState([]);
  const [equipmentInvolved, setEquipmentInvolved] = useState([]);
  const [environmentalDetail, setEnvironmentalDetail] = useState({ sensitive_area: false, sensitive_remarks: '', remediation_required: false, remediation_remarks: '' });
  const [taskCondition, setTaskCondition] = useState({ roster_shift: '', traffic_volume: '', traffic_flow: '', lighting_condition: '', road_surface: '' });
  const [permitDetail, setPermitDetail] = useState({ work_permit_obtained: 'No', remarks: '' });

  const [investigationTeam, setInvestigationTeam] = useState({ lead_investigator_id: '', team_members: [] });
  const [sequenceOfEvents, setSequenceOfEvents] = useState([]);
  const [peepos, setPeepos] = useState([]);
  const [investigationAnalyses, setInvestigationAnalyses] = useState([]);

  // Local form state
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inc, enumData, userData] = await Promise.all([
          api.getIncidentById(id),
          api.getEnumsAll(),
          api.getUsers()
        ]);

        setIncident(inc);
        setEnums(enumData);
        setUsers(userData);

        // Initialize form data
        setFormData({
          ...inc,
          incident_date: inc.incident_date?.split('T')[0] || '',
          incident_time: inc.incident_date ? new Date(inc.incident_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
          reported_date: inc.reported_date?.split('T')[0] || '',
          reported_time: inc.reported_date ? new Date(inc.reported_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
          reported_by_type: inc.reported_by_type || 'Someone Else',
          reported_to_type: inc.reported_to_type || 'Someone Else',
          incident_type: inc.incident_type || [],
          incident_group: inc.incident_group || [],
          sub_group: inc.sub_group || [],
          work_activity_classification: inc.work_activity_classification || 'Work Related Incident',
          risk_category: Array.isArray(inc.risk_category) ? inc.risk_category : (inc.risk_category && inc.risk_category !== '--' ? [inc.risk_category] : [])
        });

        if (inc.involved_persons && inc.involved_persons.length > 0) {
          setInvolvedPersons(inc.involved_persons);
        }

        if (inc.witnesses) setWitnesses(inc.witnesses);
        if (inc.equipment_involved) setEquipmentInvolved(inc.equipment_involved);
        if (inc.environmental_detail) setEnvironmentalDetail(inc.environmental_detail);
        if (inc.task_condition) setTaskCondition(inc.task_condition);
        if (inc.permit_detail) setPermitDetail(inc.permit_detail);

        if (inc.investigation_team) setInvestigationTeam(inc.investigation_team);
        if (inc.sequence_of_events) setSequenceOfEvents(inc.sequence_of_events);
        if (inc.peepos) setPeepos(inc.peepos);
        if (inc.investigation_analyses) setInvestigationAnalyses(inc.investigation_analyses);

        if (inc.area_of_incident) {
          const subs = await api.getSubAreas(inc.area_of_incident);
          setSubAreas(subs.map(s => s.sub_area));
        }

      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleValueChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const sanitizedInvolved = involvedPersons.map(p => ({
        ...p,
        age: p.age === '' ? null : p.age,
        person_id: p.person_id === '' ? null : p.person_id
      }));

      const sanitizedTeam = investigationTeam ? {
        ...investigationTeam,
        lead_investigator_id: investigationTeam.lead_investigator_id === '' ? null : investigationTeam.lead_investigator_id
      } : null;

      const payload = {
        ...formData,
        status: activeTab !== 'New Incident' ? activeTab : formData.status,
        involved_persons: sanitizedInvolved,
        witnesses: witnesses,
        equipment_involved: equipmentInvolved,
        environmental_detail: environmentalDetail,
        task_condition: taskCondition,
        permit_detail: permitDetail,
        investigation_team: sanitizedTeam,
        sequence_of_events: sequenceOfEvents,
        peepos: peepos,
        investigation_analyses: investigationAnalyses,
        incident_date: formData.incident_date ? `${formData.incident_date}T${formData.incident_time || '00:00'}:00Z` : null,
        reported_date: formData.reported_date ? `${formData.reported_date}T${formData.reported_time || '00:00'}:00Z` : null,
      };
      await api.updateIncident(id, payload);
      showToast('Incident updated successfully!', 'success');
    } catch (err) {
      console.error('Update failed:', err);
      showToast('Failed to update incident.', 'error');
    } finally {
      setUpdating(false);
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
      }
    }
    setInvolvedPersons(updated);
  };

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ height: '80vh' }}>
        <Loader size={40} />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="rev-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <h3>Incident not found or failed to load.</h3>
      </div>
    );
  }

  const tabs = ['New Incident', 'Review', 'Inspection', 'Investigation'];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex >= 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="rev-page-wrapper">
      {toastMessage && (
        <div className={`custom-toast ${toastType === 'error' ? 'error' : ''}`}>
          {toastMessage}
        </div>
      )}

      {/* Header Summary Bar */}
      <div className="rev-summary-bar">
        <div className="summary-item">
          <span className="summary-label">Infrastructure Damage</span>
          <span className="summary-value cyan-link">{incident.incident_ref}</span>
        </div>
        <div className="summary-item">
          <AlertCircle size={14} color="#f97316" />
          <span className="summary-value">{formData.incident_type?.join(', ') || 'Select'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Reported By</span>
          <span className="summary-value">Martin Debeloz</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Reported Date</span>
          <span className="summary-value">{new Date(formData.reported_date).toLocaleDateString()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Incident Date</span>
          <span className="summary-value">{new Date(formData.incident_date).toLocaleDateString()}</span>
        </div>
        <div className="summary-item" style={{ flex: 1.5 }}>
          <span className="summary-label">{formData.area_of_incident || 'Select Area'}</span>
          <MapPin size={14} color="#94a3b8" />
          <span className="summary-value">{formData.sub_area || 'Select Sub'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{formData.operational_activity || 'Select Activity'}</span>
          <span className="summary-value">{formData.risk_category || 'Select Risk'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Status</span>
          <span className="summary-value">{formData.status}</span>
        </div>
        <div className="summary-item">
          <Clock size={16} color="#94a3b8" />
          <span className="summary-value">12:00:18</span>
        </div>
        <div className="summary-item">
          <Eye size={18} color="#22d3ee" style={{ cursor: 'pointer' }} />
        </div>

        {/* AI Audit Activation */}
        <div className="summary-item" style={{ marginLeft: 'auto', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
          <button
            className={`btn-ai-audit ${isAuditing ? 'analyzing' : ''}`}
            onClick={handleAiAudit}
            disabled={isAuditing}
            title="AI Audit"
          >
            {isAuditing ? (
              <Loader size={14} color="#00c4f4" />
            ) : (
              <Sparkles size={18} color="#00c4f4" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="rev-tabs-nav">
        {tabs.map(tab => (
          <div
            key={tab}
            className={`rev-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rev-content-body">
        {activeTab === 'New Incident' && (
          <CreateIncident
            prefillData={formData}
            prefillPersons={involvedPersons}
          />
        )}

        {activeTab === 'Inspection' && (
          <IncidentInspection
            incident={incident}
            formData={formData}
            involvedPersons={involvedPersons}
            setInvolvedPersons={setInvolvedPersons}
            witnesses={witnesses}
            setWitnesses={setWitnesses}
            equipmentInvolved={equipmentInvolved}
            setEquipmentInvolved={setEquipmentInvolved}
            environmentalDetail={environmentalDetail}
            setEnvironmentalDetail={setEnvironmentalDetail}
            taskCondition={taskCondition}
            setTaskCondition={setTaskCondition}
            permitDetail={permitDetail}
            setPermitDetail={setPermitDetail}
            handleValueChange={handleValueChange}
            handleSave={handleSave}
            users={users}
          />
        )}

        {activeTab === 'Investigation' && (
          <IncidentInvestigation
            incident={incident}
            formData={formData}
            users={users}
            investigationTeam={investigationTeam}
            setInvestigationTeam={setInvestigationTeam}
            sequenceOfEvents={sequenceOfEvents}
            setSequenceOfEvents={setSequenceOfEvents}
            peepos={peepos}
            setPeepos={setPeepos}
            investigationAnalyses={investigationAnalyses}
            setInvestigationAnalyses={setInvestigationAnalyses}
            handleValueChange={handleValueChange}
            handleSave={handleSave}
            handleNext={handleNext}
          />
        )}

        {activeTab === 'Review' && (
          <div className="rev-form-container">
            {/* Overview Left Sidebar */}
            <div className="rev-overview-sidebar">
              <Eye size={18} />
              <span className="sidebar-text">Overview</span>
            </div>

            {/* Form Grid */}
            <div className="rev-form-main">
              <div className="rev-grid-5">
                <div className="rev-field-group">
                  <label className="rev-field-label">Incident Reference Number</label>
                  <input type="text" className="rev-input" value={incident.incident_ref} readOnly />
                </div>

                <div className="rev-field-group">
                  <label className="rev-field-label">Status</label>
                  <input type="text" className="rev-input" value={activeTab} readOnly style={{ backgroundColor: '#f8fafc', color: '#64748b' }} />
                </div>

                <div className="rev-field-group">
                  <label className="rev-field-label">Reported Date <span className="required-star">*</span></label>
                  <div className="rev-input-with-icon">
                    <input
                      type="date"
                      className="rev-input"
                      value={formData.reported_date}
                      onChange={(e) => handleValueChange('reported_date', e.target.value)}
                    />
                    <Calendar size={14} className="icon-right" />
                  </div>
                </div>

                <div className="rev-field-group">
                  <label className="rev-field-label">Reported Time <span className="required-star">*</span></label>
                  <div className="rev-input-with-icon">
                    <input
                      type="time"
                      className="rev-input"
                      value={formData.reported_time}
                      onChange={(e) => handleValueChange('reported_time', e.target.value)}
                    />
                    <Clock size={14} className="icon-right" />
                  </div>
                </div>

                <div className="rev-field-group">
                  <label className="rev-field-label">Incident Date <span className="required-star">*</span></label>
                  <div className="rev-input-with-icon">
                    <input
                      type="date"
                      className="rev-input"
                      value={formData.incident_date}
                      onChange={(e) => handleValueChange('incident_date', e.target.value)}
                    />
                    <Calendar size={14} className="icon-right" />
                  </div>
                </div>

                {/* Second Row */}
                <AppDropdown
                  label="Shift"
                  options={enums.shift}
                  value={formData.shift}
                  onChange={(val) => handleValueChange('shift', val)}
                  auditInsight={auditInsights.shift}
                />

                <div className="rev-field-group">
                  <label className="rev-field-label">Incident Time <span className="required-star">*</span></label>
                  <div className="rev-input-with-icon">
                    <input
                      type="time"
                      className="rev-input"
                      value={formData.incident_time}
                      onChange={(e) => handleValueChange('incident_time', e.target.value)}
                    />
                    <Clock size={14} className="icon-right" />
                  </div>
                </div>

                <AppDropdown
                  label="Incident Type"
                  multi
                  options={enums.incident_type}
                  value={formData.incident_type}
                  onChange={(val) => handleValueChange('incident_type', val)}
                  auditInsight={auditInsights.incident_type}
                />

                <AppDropdown
                  label="Time of Day"
                  options={enums.time_of_day}
                  value={formData.time_of_day}
                  onChange={(val) => handleValueChange('time_of_day', val)}
                  auditInsight={auditInsights.time_of_day}
                />

                <AppDropdown
                  label="Weather"
                  options={enums.weather}
                  value={formData.weather}
                  onChange={(val) => handleValueChange('weather', val)}
                  auditInsight={auditInsights.weather}
                />

                {/* Third Row */}
                <AppDropdown
                  label="Area of Incident"
                  required
                  options={enums.area_of_incident}
                  value={formData.area_of_incident}
                  onChange={(val) => handleValueChange('area_of_incident', val)}
                  auditInsight={auditInsights.area_of_incident}
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
                  auditInsight={auditInsights.operational_activity}
                />

                <AppDropdown
                  label="Risk Category"
                  multi
                  required
                  options={enums.risk_category}
                  value={formData.risk_category}
                  onChange={(val) => handleValueChange('risk_category', val)}
                  auditInsight={auditInsights.risk_category}
                />

                <AppDropdown
                  label="Shift Manager"
                  options={users.map(u => `${u.name} (${u.employee_id})`)}
                  value={formData.shift_manager_name || 'Select'}
                  onChange={(val) => handleValueChange('shift_manager_name', val)}
                />

                {/* Fourth Row */}
                <AppDropdown
                  label="Work Activity Classification"
                  options={['Work Related Incident', 'Non Work Related Incident', 'Third Party Incident']}
                  value={formData.work_activity_classification}
                  onChange={(val) => handleValueChange('work_activity_classification', val)}
                  auditInsight={auditInsights.work_activity_classification}
                />

                <AppDropdown
                  label="Incident Group"
                  multi
                  options={enums.incident_group}
                  value={formData.incident_group}
                  onChange={(val) => handleValueChange('incident_group', val)}
                  auditInsight={auditInsights.incident_group}
                />

                <AppDropdown
                  label="Sub Group"
                  multi
                  options={enums.incident_subgroup?.map(s => s.value) || []}
                  value={formData.sub_group}
                  onChange={(val) => handleValueChange('sub_group', val)}
                  auditInsight={auditInsights.sub_group}
                />

                <AppDropdown
                  label="Actual Severity"
                  options={enums.severity_level}
                  value={formData.actual_severity}
                  onChange={(val) => handleValueChange('actual_severity', val)}
                  auditInsight={auditInsights.actual_severity}
                />

                <AppDropdown
                  label="Potential Severity"
                  options={enums.severity_level}
                  value={formData.potential_severity}
                  onChange={(val) => handleValueChange('potential_severity', val)}
                  auditInsight={auditInsights.potential_severity}
                />

                <AppDropdown
                  label="Critical Incident"
                  options={['No', 'Yes']}
                  value={formData.critical_incident}
                  onChange={(val) => handleValueChange('critical_incident', val)}
                />

                {/* Fifth Row */}
                <div className="rev-field-group">
                  <label className="rev-field-label">Shipping Line Details</label>
                  <input
                    type="text"
                    className="rev-input"
                    value={formData.shipping_line}
                    onChange={(e) => handleValueChange('shipping_line', e.target.value)}
                  />
                </div>

                <AppDropdown
                  label="Shipping Line Informed ?"
                  options={['No', 'Yes']}
                  value={formData.shipping_line_informed}
                  onChange={(val) => handleValueChange('shipping_line_informed', val)}
                />

                <AppDropdown
                  label="CCTV Footages"
                  options={['Available', 'Not Available']}
                  value={formData.cctv_footages}
                  onChange={(val) => handleValueChange('cctv_footages', val)}
                />

                <div className="rev-field-group">
                  <label className="rev-field-label">Container Number</label>
                  <input
                    type="text"
                    className="rev-input"
                    value={formData.container_number}
                    onChange={(e) => handleValueChange('container_number', e.target.value)}
                  />
                </div>

                <div className="rev-field-group">
                  <label className="rev-field-label">Shift Superintendent</label>
                  <input
                    type="text"
                    className="rev-input"
                    value={formData.shift_superintendent_name || ''}
                    onChange={(e) => handleValueChange('shift_superintendent_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="rev-field-full" style={{ marginTop: '20px' }}>
                <label className="rev-field-label">Incident Title</label>
                <textarea
                  className="rev-textarea-title"
                  rows={1}
                  value={formData.incident_title}
                  readOnly
                />
              </div>

              <div className="rev-narrative-grid">
                <div className="rev-box">
                  <div className="rev-box-header">
                    <label className="rev-field-label">Incident Description <span className="required-star">*</span></label>
                  </div>
                  <textarea
                    className="rev-textarea"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleValueChange('description', e.target.value)}
                  />
                </div>
                <div className="rev-box">
                  <div className="rev-box-header">
                    <label className="rev-field-label">Immediate Action Taken</label>
                  </div>
                  <textarea
                    className="rev-textarea"
                    rows={5}
                    value={formData.immediate_action}
                    onChange={(e) => handleValueChange('immediate_action', e.target.value)}
                  />
                </div>
              </div>

              {/* Work Activity Classification */}
              <div className="rev-classification-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <label className="rev-field-label">WORK ACTIVITY CLASSIFICATION</label>
                <div className="rev-radio-group">
                  <label className="rev-radio-label">
                    <input
                      type="radio"
                      name="classification"
                      value="Work Related Incident"
                      checked={formData.classification === 'Work Related Incident'}
                      onChange={(e) => handleValueChange('classification', e.target.value)}
                    />
                    <div className="radio-custom"></div>
                    Work Related Incident
                  </label>
                  <label className="rev-radio-label">
                    <input
                      type="radio"
                      name="classification"
                      value="Non-Work Related Incident"
                      checked={formData.classification === 'Non-Work Related Incident'}
                      onChange={(e) => handleValueChange('classification', e.target.value)}
                    />
                    <div className="radio-custom"></div>
                    Non-Work Related Incident
                  </label>
                  <label className="rev-radio-label">
                    <input
                      type="radio"
                      name="classification"
                      value="Third Party Incident"
                      checked={formData.classification === 'Third Party Incident'}
                      onChange={(e) => handleValueChange('classification', e.target.value)}
                    />
                    <div className="radio-custom"></div>
                    Third Party Incident
                  </label>
                </div>
              </div>

              {/* Involved Person Section */}
              <div className="rev-classification-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <div className="rev-field-label" style={{ marginBottom: '15px' }}>INVOLVED PERSON <span className="section-na" style={{ marginLeft: '20px' }}>N/A</span></div>
                <div style={{ marginTop: '10px' }}>
                  <div className="rev-involved-grid-header">
                    <span>Worker Type</span>
                    <span>Name</span>
                    <span>ID</span>
                    <span>Age</span>
                    <span>Dept</span>
                    <span>Designation</span>
                    <span>Particulars</span>
                  </div>
                  {involvedPersons.map((person, idx) => (
                    <div key={idx} className="rev-involved-grid-row">
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
                        className="rev-input"
                        value={person.id}
                        onChange={(e) => handleInvolvedPersonChange(idx, 'id', e.target.value)}
                      />
                      <input
                        type="text"
                        className="rev-input"
                        value={person.age}
                        onChange={(e) => handleInvolvedPersonChange(idx, 'age', e.target.value)}
                      />
                      <input
                        type="text"
                        className="rev-input"
                        value={person.department}
                        onChange={(e) => handleInvolvedPersonChange(idx, 'department', e.target.value)}
                      />
                      <input
                        type="text"
                        className="rev-input"
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
                    <div className="rev-add-btn" onClick={handleAddInvolvedPerson}><Plus size={14} /> ADD</div>
                  </div>
                </div>
              </div>

              {/* Reported Person Section (Moved to End) */}
              <div className="rev-classification-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <div className="rev-field-label" style={{ marginBottom: '15px' }}>REPORTED PERSON <span className="section-na" style={{ marginLeft: '20px' }}>N/A</span></div>
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

            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="rev-footer">
        <div className="rev-buttons" style={{ marginLeft: 'auto' }}>
          <button className="btn-rev btn-grey">CANCEL</button>
          <button className="btn-rev btn-cyan">PRINT</button>
          <button className="btn-rev btn-grey">UPLOAD</button>
          <button className="btn-rev btn-cyan" onClick={() => navigate(`/rca/create/${id}`)}>ROOT CAUSE</button>
          <button className="btn-rev btn-cyan" onClick={handleSave} disabled={updating}>
            {updating ? 'SAVING...' : 'SAVE'}
          </button>
          <button className="btn-rev btn-grey" onClick={handleNext}>NEXT <ArrowRight size={14} /></button>
        </div>
      </div>

    </div>
  );
};

export default IncidentReviewPage;
