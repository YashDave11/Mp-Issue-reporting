import { useEffect, useState } from 'react';
import { 
  getDashboardIssues, updateIssueStatus, mergeIssues, getHotspots 
} from '../utils/api';
import type { IssueRecord } from '../types';
import { 
  TrendingUp, AlertOctagon, Layers, ClipboardList, MapPin, 
  Search, ShieldAlert, Merge, FileText, Loader2 
} from 'lucide-react';

export const StaffDashboard = () => {
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('priority_score');

  // Detail Drill-down Panel State
  const [selectedIssue, setSelectedIssue] = useState<IssueRecord | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [parentIssueIdToMerge, setParentIssueIdToMerge] = useState('');
  const [merging, setMerging] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardIssues({
        category: categoryFilter || undefined,
        ward: wardFilter || undefined,
        status: statusFilter || undefined,
        sort_by: sortBy
      });
      if (res.status === 'success') {
        setIssues(res.issues);
      }
      
      const hsRes = await getHotspots();
      if (hsRes.status === 'success') {
        setHotspots(hsRes.hotspots);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, wardFilter, statusFilter, sortBy]);

  // Trigger reloading and selecting active issue if it is updated
  const handleStatusUpdate = async (status: string) => {
    if (!selectedIssue) return;
    try {
      const res = await updateIssueStatus(selectedIssue.id, status, statusNote);
      if (res.status === 'success') {
        setSelectedIssue(res.issue);
        setStatusNote('');
        loadData(); // Reload list
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !parentIssueIdToMerge.trim()) return;
    
    try {
      setMerging(true);
      const res = await mergeIssues(selectedIssue.id, parentIssueIdToMerge.trim());
      if (res.status === 'success') {
        alert("Issues merged successfully!");
        setSelectedIssue(null);
        setParentIssueIdToMerge('');
        loadData();
      } else {
        alert(res.message || "Failed to merge issues");
      }
    } catch (err) {
      alert("Merge request failed");
    } finally {
      setMerging(false);
    }
  };

  const totalOpen = issues.filter(i => i.status === 'open').length;
  const topPriorityIssue = issues.length > 0 ? issues[0] : null;
  // Coordinates mapping to SVG 400x250 viewport
  const mapCoords = (lat: number, lng: number) => {
    const minLat = 26.23;
    const maxLat = 26.25;
    const minLng = 73.01;
    const maxLng = 73.04;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 400;
    const y = 250 - (((lat - minLat) / (maxLat - minLat)) * 250);
    return { x, y };
  };

  return (
    <div className="container py-4" style={{ maxWidth: '1400px' }}>
      
      {/* Dashboard Header Banner */}
      <div className="d-flex align-items-center gap-3 mb-4 bg-white p-3 rounded-lg border">
        <ShieldAlert className="text-primary pulse-element" size={36} />
        <div>
          <h1 className="h3 fw-bold m-0" style={{ color: 'var(--primary-900)' }}>Constituency Staff Priority Cockpit</h1>
          <p className="text-muted m-0">MP Office decision-support dashboard driven by explainable AI scoring.</p>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6 col-12">
          <div className="metric-card">
            <div>
              <span className="metric-title">Active Complaints</span>
              <div className="metric-val">{issues.length}</div>
              <span className="body-3 text-muted">Excluding duplicate threads</span>
            </div>
            <ClipboardList size={36} className="text-primary opacity-50" />
          </div>
        </div>

        <div className="col-lg-3 col-sm-6 col-12">
          <div className="metric-card danger">
            <div>
              <span className="metric-title">Needs Attention (Open)</span>
              <div className="metric-val">{totalOpen}</div>
              <span className="body-3 text-muted">Requires initial triage</span>
            </div>
            <AlertOctagon size={36} className="text-danger opacity-50" />
          </div>
        </div>

        <div className="col-lg-3 col-sm-6 col-12">
          <div className="metric-card warning">
            <div>
              <span className="metric-title">Top Priority Issue</span>
              <div className="metric-val" style={{ fontSize: '1.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                {topPriorityIssue ? topPriorityIssue.title : 'None'}
              </div>
              <span className="body-3 text-muted">Priority: {topPriorityIssue ? Math.round(topPriorityIssue.priority_score * 100) : 0}%</span>
            </div>
            <TrendingUp size={36} className="text-warning opacity-50" />
          </div>
        </div>

        <div className="col-lg-3 col-sm-6 col-12">
          <div className="metric-card success">
            <div>
              <span className="metric-title">Primary Wards In Focus</span>
              <div className="metric-val">4 Wards</div>
              <span className="body-3 text-muted">Jodhpur Constituency</span>
            </div>
            <Layers size={36} className="text-success opacity-50" />
          </div>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Left Side: filters, map and list table */}
        <div className="col-lg-8 col-12">
          
          {/* Filter Toolbar */}
          <div className="card shadow-sm border-0 mb-4 bg-white rounded-lg">
            <div className="card-body p-3 d-flex flex-wrap gap-3 align-items-center">
              <div className="d-flex align-items-center gap-2">
                <Search size={18} className="text-primary" />
                <span className="fw-semibold">Filter Controls:</span>
              </div>
              
              <select 
                className="form-select w-auto"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="roads">Roads</option>
                <option value="water">Water</option>
                <option value="sanitation">Sanitation</option>
                <option value="school infrastructure">School Infrastructure</option>
                <option value="health">Health</option>
                <option value="public safety">Public Safety</option>
              </select>

              <select 
                className="form-select w-auto"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option value="">All Wards</option>
                <option value="Ward 7">Ward 7</option>
                <option value="Ward 8">Ward 8</option>
                <option value="Ward 9">Ward 9</option>
                <option value="Ward 10">Ward 10</option>
              </select>

              <select 
                className="form-select w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select 
                className="form-select w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority_score">Sort by Priority Score</option>
                <option value="upvote_count">Sort by Upvotes</option>
                <option value="created_at">Sort by Date Created</option>
              </select>
            </div>
          </div>

          {/* Dual visualizers: SVGMAP + Table */}
          <div className="row g-4">
            
            {/* SVGMAP overlay */}
            <div className="col-12">
              <div className="card shadow-sm border-0 bg-white rounded-lg p-3">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--primary-900)' }}>
                  <MapPin size={18} />
                  <span>Constituency Heatmap Overlay (SVG Render)</span>
                </h5>
                <div style={{ height: '250px', background: '#f4f6fa', borderRadius: '8px', overflow: 'hidden' }}>
                  <svg viewBox="0 0 400 250" className="w-100 h-100">
                    <defs>
                      <pattern id="grid-db" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e3e8f0" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-db)" />
                    
                    {/* Wards polygons */}
                    <polygon points="10,60 120,30 140,150 60,220" fill="rgba(97, 58, 245, 0.02)" stroke="#ddd" />
                    <text x="50" y="120" fill="#bbb" fontSize="10">Ward 9</text>

                    <polygon points="120,30 250,50 240,170 140,150" fill="rgba(97, 58, 245, 0.05)" stroke="#ddd" />
                    <text x="170" y="100" fill="#bbb" fontSize="10">Ward 7</text>

                    <polygon points="140,150 240,170 300,240 60,220" fill="rgba(97, 58, 245, 0.02)" stroke="#ddd" />
                    <text x="180" y="200" fill="#bbb" fontSize="10">Ward 8</text>

                    <polygon points="250,50 380,80 350,200 240,170" fill="rgba(97, 58, 245, 0.03)" stroke="#ddd" />
                    <text x="290" y="130" fill="#bbb" fontSize="10">Ward 10</text>

                    {/* Hotspot Circles */}
                    {hotspots.map(hs => {
                      const pos = mapCoords(hs.lat, hs.lng);
                      return (
                        <g key={hs.issue_id} style={{ cursor: 'pointer' }} onClick={async () => {
                          const res = await getDashboardIssues({ sort_by: 'priority_score' });
                          const match = res.issues.find((i: any) => i.id === hs.issue_id);
                          if (match) setSelectedIssue(match);
                        }}>
                          <circle 
                            cx={pos.x} 
                            cy={pos.y} 
                            r={hs.priority_score * 25} 
                            fill="rgba(183, 114, 36, 0.15)" 
                            stroke="#b77224" 
                            strokeWidth="0.5" 
                          />
                          <circle cx={pos.x} cy={pos.y} r="4" fill="#b7131a" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Issues List Table */}
            <div className="col-12">
              <div className="table-container m-0">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Priority</th>
                      <th>Title</th>
                      <th>Locality</th>
                      <th>Category</th>
                      <th>Supporters</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <Loader2 className="spinner-border spinner-border-sm text-primary" /> Loading issues...
                        </td>
                      </tr>
                    ) : issues.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">No issues matching active filters.</td>
                      </tr>
                    ) : (
                      issues.map((issue, idx) => (
                        <tr 
                          key={issue.id} 
                          style={{ cursor: 'pointer', backgroundColor: selectedIssue?.id === issue.id ? 'rgba(97, 58, 245, 0.05)' : '' }}
                          onClick={() => {
                            setSelectedIssue(issue);
                            setParentIssueIdToMerge('');
                          }}
                        >
                          <td className="fw-bold" style={{ width: '60px' }}>#{idx + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <span className="fw-bold text-primary">{Math.round(issue.priority_score * 100)}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>{issue.title}</div>
                            <div className="body-3 text-muted">{issue.summary.substring(0, 50)}...</div>
                          </td>
                          <td>{issue.location_name}</td>
                          <td>
                            <span className="badge badge-primary">{issue.category}</span>
                          </td>
                          <td className="text-center fw-medium">{issue.upvote_count}</td>
                          <td>
                            <span className={`badge ${
                              issue.status === 'open' ? 'badge-danger' : 
                              issue.status === 'under_review' ? 'badge-warning' : 
                              issue.status === 'resolved' ? 'badge-success' : 'badge-info'
                            }`}>{issue.status.replace('_', ' ')}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Detailed Drill-down Panel (Selected Issue) */}
        <div className="col-lg-4 col-12">
          {selectedIssue ? (
            <div className="card shadow rounded-lg border-0 bg-white p-4 sticky-lg-top" style={{ top: '90px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2">
                <div>
                  <h4 className="fw-bold m-0" style={{ color: 'var(--primary-900)', fontSize: '1.2rem' }}>Issue Inspector</h4>
                  <span className="body-3 text-muted">ID: {selectedIssue.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="btn btn-light btn-sm"
                  style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
                >
                  ✕
                </button>
              </div>

              {/* Basic Meta */}
              <div className="mb-3">
                <span className="badge badge-primary mr-2">{selectedIssue.category}</span>
                <span className="badge badge-info">{selectedIssue.status.replace('_', ' ')}</span>
                <h5 className="fw-bold mt-2 mb-1">{selectedIssue.title}</h5>
                <div className="d-flex align-items-center gap-1 text-muted body-2">
                  <MapPin size={12} />
                  <span>{selectedIssue.location_name} (Coordinates: {selectedIssue.lat.toFixed(4)}, {selectedIssue.lng.toFixed(4)})</span>
                </div>
              </div>

              {/* Summary and Original */}
              <div className="bg-light p-3 rounded mb-3 border">
                <h6 className="fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>AI Summary / सारांश:</h6>
                <p className="body-2 m-0 text-gray-800">{selectedIssue.summary}</p>
                {selectedIssue.raw_text && selectedIssue.raw_text !== selectedIssue.normalized_text && (
                  <div className="mt-2 pt-2 border-top">
                    <span className="label-2 text-muted">Raw citizen input ({selectedIssue.language}):</span>
                    <p className="body-3 m-0 text-gray-600 italic">"{selectedIssue.raw_text}"</p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {selectedIssue.media_url && (
                <div className="mb-3 p-2 bg-light rounded text-center border">
                  {selectedIssue.media_url.endsWith('.mp3') || selectedIssue.media_url.includes('voice') ? (
                    <audio controls src={`http://127.0.0.1:8000${selectedIssue.media_url}`} style={{ width: '100%' }} />
                  ) : (
                    <img 
                      src={`http://127.0.0.1:8000${selectedIssue.media_url}`} 
                      alt="Proof" 
                      style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px' }} 
                    />
                  )}
                </div>
              )}

              {/* Score Breakdown factors */}
              <div className="border rounded p-3 mb-3 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-primary-900 body-2">AI Priority Score Breakdown</span>
                  <span className="h4 fw-bold m-0 text-primary">{Math.round(selectedIssue.priority_score * 100)}%</span>
                </div>
                
                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                  {[
                    { label: 'Demand (30%)', val: selectedIssue.score_breakdown.community_demand },
                    { label: 'Infra Gap (25%)', val: selectedIssue.score_breakdown.infrastructure_gap },
                    { label: 'AI Urgency (20%)', val: selectedIssue.score_breakdown.ai_urgency },
                    { label: 'Vulnerability (15%)', val: selectedIssue.score_breakdown.vulnerability },
                    { label: 'Recency (10%)', val: selectedIssue.score_breakdown.recency }
                  ].map((f, idx) => (
                    <div key={idx}>
                      <div className="d-flex justify-content-between mb-1">
                        <span>{f.label}</span>
                        <span className="fw-bold">{Math.round(f.val * 100)}%</span>
                      </div>
                      <div className="w-100 bg-gray-50 rounded" style={{ height: '4px' }}>
                        <div className="bg-primary h-100" style={{ width: `${f.val * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="border rounded p-3 mb-3 bg-light">
                <h6 className="fw-bold mb-2" style={{ fontSize: '0.85rem' }}>Update Status & Log Action</h6>
                <div className="d-flex gap-1 mb-2">
                  {['open', 'under_review', 'planned', 'in_progress', 'resolved'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusUpdate(st)}
                      className={`btn btn-sm ${selectedIssue.status === st ? 'btn-primary' : 'btn-outline-primary'}`}
                      style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '0.2rem 0.4rem', borderRadius: '4px' }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional audit log comment..."
                  className="form-control btn-sm py-1"
                  style={{ fontSize: '0.8rem', borderRadius: '4px' }}
                />
              </div>

              {/* Duplicate Merge Tool (if AI missed duplicates) */}
              <div className="border rounded p-3 bg-white border-warning">
                <h6 className="fw-bold text-warning mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                  <Merge size={14} />
                  <span>Manual Duplicate Merger</span>
                </h6>
                <p className="body-3 text-muted mb-2">
                  Merge this issue into another parent thread. This relocates upvotes and comments.
                </p>
                <form onSubmit={handleMerge} className="d-flex gap-2">
                  <input
                    type="text"
                    required
                    value={parentIssueIdToMerge}
                    onChange={(e) => setParentIssueIdToMerge(e.target.value)}
                    placeholder="Enter Parent Issue ID"
                    className="form-control"
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', borderRadius: '4px' }}
                  />
                  <button 
                    type="submit" 
                    disabled={merging || !parentIssueIdToMerge}
                    className="btn btn-warning btn-sm"
                    style={{ borderRadius: '4px', padding: '0.3rem 0.6rem' }}
                  >
                    Merge
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="card shadow rounded-lg border-0 bg-white p-5 text-center sticky-lg-top" style={{ top: '90px' }}>
              <FileText size={48} className="text-muted mx-auto mb-3" />
              <h5 className="fw-semibold">No Issue Highlighted</h5>
              <p className="text-muted body-2">Select a row in the table to review evidence, update status, check priority components, or merge duplicates.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
