import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, ChevronDown,
  SaveAll, AlertTriangle,
  Loader2, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import './ObservationDetailView.css';


const ObservationDetailView = () => {
  const { id } = useParams();           // observation_ref
  const navigate = useNavigate();

  const [obs, setObs]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Review form state
  const [reviewMode, setReviewMode]       = useState('NEAR_MISS'); // 'NEAR_MISS' | 'INCIDENT'
  const [reviewComments, setReviewComments] = useState('');
  const [unsafeAbcRows, setUnsafeAbcRows] = useState([{
    primaryFactor: '', precondition: '', underlyingCause: '', cause: ''
  }]);
  const [unsafeExpanded, setUnsafeExpanded] = useState(true);
  const [nextAction, setNextAction] = useState('');

  // UNSAFE ABC factor options (dynamic from API)
  const [primaryFactors, setPrimaryFactors] = useState([]);
  const [rowFactorOptions, setRowFactorOptions] = useState({});
  // rowFactorOptions is keyed by row index: { 0: { preconditions: [], underlying_causes: [] }, 1: { ... } }

  // ── Fetch observation detail ────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getObservationById(id);
        setObs(data);
      } catch (err) {
        setError(err.message || 'Failed to load observation.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Load primary factors on mount ──────────────────────────────────────
  useEffect(() => {
    const loadFactors = async () => {
      try {
        const factors = await api.getPrimaryFactors();
        setPrimaryFactors(factors);
      } catch (err) {
        console.error('Failed to load primary factors:', err);
      }
    };
    loadFactors();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const fmt = (isoStr) => {
    if (!isoStr) return '--';
    const d = new Date(isoStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
  };

  const fmtTime = (isoStr) => {
    if (!isoStr) return '--';
    return new Date(isoStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const val = (v) => v || '--';

  // ── UNSAFE ABC row handlers ───────────────────────────────────────────

  const updateRow = (i, field, value) => {
    setUnsafeAbcRows(prev => prev.map((r, idx) => {
      if (idx !== i) return r;
      if (field === 'primaryFactor') {
        // When primary factor changes, clear precondition & underlyingCause and fetch new options
        return { ...r, primaryFactor: value, precondition: '', underlyingCause: '' };
      }
      return { ...r, [field]: value };
    }));

    // If primary factor changed, fetch its children
    if (field === 'primaryFactor' && value) {
      const fetchChildren = async () => {
        try {
          const options = await api.getFactorOptions(value);
          setRowFactorOptions(prev => ({ ...prev, [i]: options }));
        } catch (err) {
          console.error('Failed to load factor options:', err);
          setRowFactorOptions(prev => ({ ...prev, [i]: { preconditions: [], underlying_causes: [] } }));
        }
      };
      fetchChildren();
    } else if (field === 'primaryFactor' && !value) {
      // Clear options when deselected
      setRowFactorOptions(prev => ({ ...prev, [i]: { preconditions: [], underlying_causes: [] } }));
    }
  };

  // ── Auto Fill by AI ─────────────────────────────────────────────────────
  const handleAiReview = async () => {
    setIsAiLoading(true);
    try {
      const data = await api.getObservationReviewAI(id);
      
      if (data.review_mode) setReviewMode(data.review_mode);
      if (data.review_comments) setReviewComments(data.review_comments);
      if (data.next_action) setNextAction(data.next_action);
      
      if (data.unsafe_abc && data.unsafe_abc.length > 0) {
        setUnsafeAbcRows(data.unsafe_abc);
        
        // Ensure child factor dropdown options are loaded for the selected AI primary factor
        const pf = data.unsafe_abc[0].primaryFactor;
        if (pf) {
          const options = await api.getFactorOptions(pf);
          setRowFactorOptions({ 0: options });
        }
      }
    } catch (err) {
      showToast(`AI configuration failed: ${err.message}`, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // ── Save review ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveObservationReview(id, {
        review_mode: reviewMode,
        review_comments: reviewComments,
        next_action: nextAction,
        unsafe_abc: unsafeAbcRows,
      });
      showToast('✅ Review saved successfully!', 'success');
      // Navigate back to listing after 2s to show success toast
      setTimeout(() => navigate('/observation/listing'), 2000);
    } catch (err) {
      showToast(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading / Error ─────────────────────────────────────────────────────
  if (loading) return (
    <div className="odv-loading">
      <Loader2 className="odv-spinner" size={40} />
      <span>Loading observation...</span>
    </div>
  );

  if (error) return (
    <div className="odv-error">
      <AlertTriangle size={20} />
      <span>{error}</span>
      <button onClick={() => navigate(-1)}><ArrowLeft size={14} /> Back</button>
    </div>
  );

  return (
    <div className="odv-container">
      {toastMessage && (
        <div className={`custom-toast ${toastType === 'error' ? 'error' : ''}`}>
          {toastMessage}
        </div>
      )}

      {/* ── Summary header row ──────────────────────────────────────────── */}
      <div className="odv-summary-bar">
        <button className="odv-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="odv-summary-col">
          <span className="odv-summary-title">
            {obs.observation_group || obs.observation_type || 'Observation'}
          </span>
          <span className="odv-summary-ref">{obs.observation_ref}</span>
        </div>
        <div className="odv-summary-col">
          <span className="odv-summary-label">{val(obs.reported_by_name)}</span>
          <span className="odv-summary-sub">{val(obs.designation)}</span>
        </div>
        <div className="odv-summary-col">
          <span className="odv-summary-label">{fmt(obs.reported_date)}</span>
          <span className="odv-summary-sub">{fmtTime(obs.reported_date)}</span>
        </div>
        <div className="odv-summary-col">
          <span className="odv-summary-label">
            <MapPin size={12} style={{ marginRight:4 }} />
            {val(obs.area_of_observation)}
          </span>
          <span className="odv-summary-sub">{val(obs.sub_area)}</span>
        </div>
        <div className="odv-summary-col">
          <span className="odv-summary-label">{val(obs.observation_group)}</span>
          <span className="odv-summary-sub">{val(obs.observation_type)}</span>
        </div>
        <div className="odv-summary-col">
          <span className={`odv-status-badge odv-status-${(obs.status||'new').toLowerCase()}`}>
            {obs.status || 'New'}
          </span>
        </div>
      </div>



      {/* ── Review body ───────────────────────────────────────────────── */}
      <div className="odv-review-body">

          {/* ── Reviewer info bar ──────────────────────────────────────── */}
          <div className="odv-reviewer-bar">
            <div className="odv-reviewer-field">
              <span className="odv-reviewer-label">Reviewed By</span>
              <span className="odv-reviewer-val odv-link">{val(obs.reported_by_name)}</span>
            </div>
            <div className="odv-reviewer-field">
              <span className="odv-reviewer-label">Designation</span>
              <span className="odv-reviewer-val">{val(obs.designation)}</span>
            </div>
            <div className="odv-reviewer-field">
              <span className="odv-reviewer-label">Business Unit</span>
              <span className="odv-reviewer-val">{val(obs.business_unit)}</span>
            </div>
            <div className="odv-reviewer-field">
              <span className="odv-reviewer-label">Review Date</span>
              <span className="odv-reviewer-val">{fmt(obs.reported_date)}</span>
            </div>
            <div className="odv-reviewer-field">
              <span className="odv-reviewer-label">Review Time</span>
              <span className="odv-reviewer-val">{fmtTime(obs.reported_date)}</span>
            </div>
          </div>

          {/* ── Two-column panel ───────────────────────────────────────── */}
          <div className="odv-panel-grid">

            {/* LEFT — Observation details ─────────────────────────────── */}
            <div className="odv-left-panel">
              <div className="odv-detail-grid">

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Observation Group</span>
                  <span className="odv-detail-val odv-bold">{val(obs.observation_group)}</span>
                </div>
                <div className="odv-detail-item">
                  <span className="odv-detail-label">Specific Detail</span>
                  <span className="odv-detail-val">{val(obs.specific_detail)}</span>
                </div>

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Risk Category</span>
                  <span className="odv-detail-val">{val(obs.risk_category)}</span>
                </div>
                <div className="odv-detail-item">
                  <span className="odv-detail-label">Area of Observation</span>
                  <span className="odv-detail-val">{val(obs.area_of_observation)}</span>
                </div>

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Observation Category</span>
                  <span className="odv-detail-val">{val(obs.observation_category)}</span>
                </div>
                <div className="odv-detail-item">
                  <span className="odv-detail-label">Observation Type</span>
                  <span className="odv-detail-val">{val(obs.observation_type)}</span>
                </div>

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Operational Activity</span>
                  <span className="odv-detail-val">{val(obs.operational_activity)}</span>
                </div>
                <div className="odv-detail-item">
                  <span className="odv-detail-label">Involved Personnel</span>
                  <span className="odv-detail-val">{val(obs.involved_personnel)}</span>
                </div>

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Sub Area</span>
                  <span className="odv-detail-val">
                    {obs.sub_area
                      ? <><MapPin size={11} style={{ marginRight:4 }} />{obs.sub_area}</>
                      : '--'
                    }
                  </span>
                </div>
                <div className="odv-detail-item">{/* spacer */}</div>

                <div className="odv-detail-item">
                  <span className="odv-detail-label">Weather</span>
                  <span className="odv-detail-val">{val(obs.weather)}</span>
                </div>
                <div className="odv-detail-item">
                  <span className="odv-detail-label">Time of Day</span>
                  <span className="odv-detail-val">{val(obs.time_of_day)}</span>
                </div>

                <div className="odv-detail-item odv-detail-wide">
                  <span className="odv-detail-label">Description</span>
                  <p className="odv-detail-desc">{val(obs.description)}</p>
                </div>

                {obs.immediate_action && (
                  <div className="odv-detail-item odv-detail-wide">
                    <span className="odv-detail-label">Immediate Action</span>
                    <p className="odv-detail-desc">{obs.immediate_action}</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Review form ────────────────────────────────────── */}
            <div className="odv-right-panel">

              {/* Mode selector */}
              <div className="odv-mode-row">
                {[
                  { key: 'NEAR_MISS',  label: 'NEAR MISS' },
                  { key: 'INCIDENT',   label: 'INCIDENT' },
                ].map(m => (
                  <label key={m.key} className="odv-mode-option">
                    <input
                      type="radio"
                      name="reviewMode"
                      checked={reviewMode === m.key}
                      onChange={() => setReviewMode(m.key)}
                    />
                    <span className={`odv-mode-label ${reviewMode === m.key ? 'odv-mode-active' : ''}`}>
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Review Comments */}
              <div className="odv-section-block">
                <label className="odv-section-label">Review Comments</label>
                <textarea
                  className="odv-review-textarea"
                  rows={5}
                  placeholder="Enter your review comments here..."
                  value={reviewComments}
                  onChange={e => setReviewComments(e.target.value)}
                />
                <div className="odv-textarea-footer">
                  <span className="odv-translate-btn">Translate ↑</span>
                  <span className="odv-char-count">{reviewComments.length}/3000</span>
                </div>
              </div>

              {/* UNSAFE ABC section */}
              <div className="odv-abc-section">
                <div className="odv-abc-header" onClick={() => setUnsafeExpanded(!unsafeExpanded)}>
                  <div className="odv-abc-title">
                    <span className="odv-abc-dot" />
                    UNSAFE ABC
                  </div>
                  <div className="odv-abc-header-right">
                    <Check size={14} color="#16a34a" />

                    <ChevronDown
                      size={14}
                      style={{ transform: unsafeExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s', color: '#94a3b8' }}
                    />
                  </div>
                </div>

                {unsafeExpanded && (
                  <div className="odv-abc-body">
                    {/* Column headers */}
                    <div className="odv-abc-cols-header">
                      <span>Primary Factor <span className="odv-required">*</span></span>
                      <span>Precondition <span className="odv-required">*</span></span>
                      <span>Underlying Cause</span>
                      <span>Cause <span className="odv-required">*</span></span>
                      <span></span>
                    </div>
                    {/* Input rows */}
                    {unsafeAbcRows.map((row, i) => {
                      const opts = rowFactorOptions[i] || { preconditions: [], underlying_causes: [] };
                      return (
                      <div key={i} className="odv-abc-row">
                        <div className="odv-abc-cell">
                          <select
                            className="odv-abc-select"
                            value={row.primaryFactor}
                            onChange={e => updateRow(i, 'primaryFactor', e.target.value)}
                          >
                            <option value="">Select</option>
                            {primaryFactors.map(pf => (
                              <option key={pf.id} value={pf.id}>{pf.label || pf.value || pf.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="odv-abc-cell">
                          <select
                            className="odv-abc-select"
                            value={row.precondition}
                            onChange={e => updateRow(i, 'precondition', e.target.value)}
                            disabled={!row.primaryFactor}
                          >
                            <option value="">Select</option>
                            {opts.preconditions.map(p => (
                              <option key={p.id} value={p.id}>{p.label || p.value || p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="odv-abc-cell">
                          <select
                            className="odv-abc-select"
                            value={row.underlyingCause}
                            onChange={e => updateRow(i, 'underlyingCause', e.target.value)}
                            disabled={!row.primaryFactor}
                          >
                            <option value="">Select</option>
                            {opts.underlying_causes.map(u => (
                              <option key={u.id} value={u.id}>{u.label || u.value || u.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="odv-abc-cell">
                          <input
                            className="odv-abc-input"
                            placeholder="Enter"
                            value={row.cause}
                            onChange={e => updateRow(i, 'cause', e.target.value)}
                          />
                        </div>
                        <div className="odv-abc-cell odv-abc-actions">

                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Next Action */}
              <div className="odv-section-block">
                <label className="odv-section-label">Next Action</label>
                <div className="odv-select-wrapper">
                  <select
                    className="odv-select"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Action">Action</option>
                    <option value="Close">Close</option>
                    <option value="Reject">Reject</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                  <ChevronDown size={14} className="odv-select-arrow" />
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="odv-footer">
        <button className="odv-footer-btn odv-btn-cancel" onClick={() => navigate(-1)}>
          CANCEL
        </button>
        <button
          className="odv-footer-btn odv-btn-ai"
          onClick={handleAiReview}
          disabled={isAiLoading || saving}
          style={{ backgroundColor: '#fdf4ff', color: '#c026d3', border: '1px solid #f0abfc', marginLeft: 'auto', marginRight: '8px' }}
        >
          {isAiLoading ? <><Loader2 size={13} className="odv-spin" /> GENERATING...</> : <><Sparkles size={13} /> REVIEW BY AI</>}
        </button>
        <button
          className="odv-footer-btn odv-btn-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><Loader2 size={13} className="odv-spin" /> SAVING...</> : <><SaveAll size={13} /> SAVE</>}
        </button>
      </div>

    </div>
  );
};

export default ObservationDetailView;
