import React, { useState } from 'react';
import { Clock, MapPin, PlusCircle, ArrowUpFromLine } from 'lucide-react';
import './CreateObservation.css';

const CreateObservation = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isNearMiss, setIsNearMiss] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(true);

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
          <input type="date" className="obs-input" defaultValue="2026-04-05" />
        </div>
        <div className="obs-field">
          <label className="obs-label">Reported Time <span className="obs-required">*</span></label>
          <div className="obs-input-wrapper">
            <input type="text" className="obs-input" defaultValue="15:32" />
            <Clock className="obs-icon-right" size={16} />
          </div>
        </div>
        <div className="obs-field">
          <label className="obs-label">Video Feed</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
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
        <div className="obs-field">
          <label className="obs-label">Time of Day</label>
          <select className="obs-select">
            <option>Afternoon</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Shift</label>
          <select className="obs-select">
            <option>Shift 2</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Operational Department</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Area<span className="obs-required">*</span></label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Sub Area</label>
          <div className="obs-input-wrapper">
            <select className="obs-select">
              <option>Select</option>
            </select>
            <MapPin className="location-pin-icon" size={18} fill="#1a202c" color="#fff" />
          </div>
        </div>
      </div>

      {/* Row 4 */}
      <div className="obs-grid-5">
        <div className="obs-field">
          <label className="obs-label">Reported By<span className="obs-required">*</span></label>
          <select className="obs-select" disabled={isAnonymous}>
            {isAnonymous ? (
              <option>Select</option>
            ) : (
              <option>Martin Debeloz(104)</option>
            )}
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Business Unit<span className="obs-required">*</span></label>
          <select className="obs-select" disabled={isAnonymous}>
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Department<span className="obs-required">*</span></label>
          <select className="obs-select" disabled={isAnonymous}>
            {isAnonymous ? (
              <option>Select</option>
            ) : (
              <option>Administration</option>
            )}
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Designation<span className="obs-required">*</span></label>
          <select className="obs-select" disabled={isAnonymous}>
            {isAnonymous ? (
              <option>Select</option>
            ) : (
              <option>General Manager</option>
            )}
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Weather</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
      </div>

      {/* Row 5 */}
      <div className="obs-grid-5">
        <div className="obs-field">
          <label className="obs-label">Observation Type</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Operational Activity<span className="obs-required">*</span></label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Potential Severity</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Observation Category</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Hazard Category</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
      </div>

      {/* Row 6 */}
      <div className="obs-grid-5">
        <div className="obs-field">
          <label className="obs-label">Observation Group<span className="obs-required">*</span></label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Specific Detail<span className="obs-required">*</span></label>
          <input type="text" className="obs-input" defaultValue="--" />
        </div>
        <div className="obs-field">
          <label className="obs-label">Risk Category</label>
          <input type="text" className="obs-input" defaultValue="--" />
        </div>
        <div className="obs-field">
          <label className="obs-label">Repeated Observation Number</label>
          <select className="obs-select">
            <option>Select</option>
          </select>
        </div>
        <div className="obs-field">
          <label className="obs-label">Involved Personnel</label>
          <div className="obs-input-wrapper">
            <select className="obs-select">
              <option>Select</option>
            </select>
            <PlusCircle className="add-personnel-icon" size={16} />
          </div>
        </div>
      </div>

      {/* Row 7: Textareas */}
      <div className="obs-grid-2">
        <div className="obs-field">
          <label className="obs-label">Description<span className="obs-required">*</span></label>
          <div className="obs-textarea-container">
            <textarea className="obs-textarea"></textarea>
            <div className="obs-textarea-footer">
              <span className="obs-translate">Translate <ArrowUpFromLine size={12} /></span>
              <span className="obs-char-count">0/3000</span>
            </div>
          </div>
        </div>
        <div className="obs-field">
          <label className="obs-label">Immediate Action</label>
          <div className="obs-textarea-container">
            <textarea className="obs-textarea"></textarea>
            <div className="obs-textarea-footer">
              <span className="obs-translate">Translate <ArrowUpFromLine size={12} /></span>
              <span className="obs-char-count">0/3000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="obs-confirmation">
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
      </div>

      {/* Action Buttons */}
      <div className="obs-actions">
        <button className="obs-btn obs-btn-cancel">CANCEL</button>
        <button className="obs-btn obs-btn-secondary">UPLOAD</button>
        <button className="obs-btn obs-btn-secondary">DRAFT</button>
        <button className="obs-btn obs-btn-primary">SUBMIT</button>
      </div>

    </div>
  );
};

export default CreateObservation;
