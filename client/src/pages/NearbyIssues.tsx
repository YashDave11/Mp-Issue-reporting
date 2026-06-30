import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageSquare, Heart, RefreshCw, Filter } from 'lucide-react';
import { getNearbyIssues } from '../utils/api';
import type { IssueRecord } from '../types';

export const NearbyIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Default User Location: Jodhpur Ward 7
  const [userLat] = useState(26.2389);
  const [userLng] = useState(73.0243);
  
  // Map Highlight State
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await getNearbyIssues(userLat, userLng, 10.0);
      if (res.status === 'success' && res.issues) {
        setIssues(res.issues);
      }
    } catch (err) {
      console.error("Failed to fetch nearby issues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [userLat, userLng]);

  const filteredIssues = categoryFilter === 'all' 
    ? issues 
    : issues.filter(i => i.category === categoryFilter);

  // SVG Map boundaries mapping
  // We map latitude 26.23 to 26.25, and longitude 73.01 to 73.04 into a 400x300 viewBox
  const mapCoords = (lat: number, lng: number) => {
    const minLat = 26.23;
    const maxLat = 26.25;
    const minLng = 73.01;
    const maxLng = 73.04;
    
    // Map to width=500, height=400
    const x = ((lng - minLng) / (maxLng - minLng)) * 500;
    // SVG y-axis is inverted: top is 0, bottom is max
    const y = 400 - (((lat - minLat) / (maxLat - minLat)) * 400);
    
    return { x, y };
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Issues Near Me</h1>
          <p className="text-muted m-0">मेरे निकट के जन-मुद्दे (Jodhpur Constituency)</p>
        </div>
        <button 
          onClick={fetchIssues} 
          className="btn btn-light d-flex align-items-center gap-2"
          style={{ borderRadius: '20px' }}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card shadow-sm border-0 mb-4 bg-white rounded-lg">
        <div className="card-body p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <Filter size={18} className="text-primary" />
            <span className="fw-semibold">Filter Category:</span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {['all', 'roads', 'water', 'sanitation', 'school infrastructure', 'health', 'public safety'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-light'}`}
                style={{ borderRadius: '15px', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Issues Feed */}
        <div className="col-lg-6 col-12 order-lg-1 order-2">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-2" role="status"></div>
              <div>Loading nearby issues...</div>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-lg border shadow-sm">
              <MapPin size={48} className="text-muted mx-auto mb-3" />
              <h4>No Issues Found</h4>
              <p className="text-muted">Be the first to report an issue in this category!</p>
              <button onClick={() => navigate('/report')} className="btn btn-primary mt-2">Report Issue</button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredIssues.map((issue) => (
                <div 
                  key={issue.id} 
                  className={`card rounded-lg border-0 shadow-sm ${selectedIssueId === issue.id ? 'border-primary' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: selectedIssueId === issue.id ? '5px solid var(--bs-primary)' : '1px solid rgba(0,0,0,0.05)'
                  }}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    // scroll map marker into view or similar
                  }}
                  onDoubleClick={() => navigate(`/issues/${issue.id}`)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge badge-primary">{issue.category}</span>
                      <span className={`badge ${
                        issue.status === 'open' ? 'badge-danger' : 
                        issue.status === 'under_review' ? 'badge-warning' : 
                        issue.status === 'resolved' ? 'badge-success' : 'badge-info'
                      }`}>{issue.status.replace('_', ' ')}</span>
                    </div>

                    <h4 className="card-title h5 mb-2">{issue.title}</h4>
                    <p className="body-2 text-muted mb-3 line-clamp-2">{issue.summary}</p>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                        <MapPin size={14} />
                        <span>{issue.location_name} ({issue.distance_km} km away)</span>
                      </div>
                      
                      <div className="d-flex gap-3">
                        <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                          <Heart size={14} className="text-danger" fill="red" />
                          <span>{issue.upvote_count}</span>
                        </span>
                        <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                          <MessageSquare size={14} />
                          <span>{issue.comment_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Custom SVG Map View (Simulating Jodhpur Wards) */}
        <div className="col-lg-6 col-12 order-lg-2 order-1">
          <div className="card shadow rounded-lg border-0 bg-white sticky-lg-top" style={{ top: '90px' }}>
            <div className="card-body p-3">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span>Constituency Hotspots Map</span>
              </h5>
              
              <div 
                className="position-relative bg-light rounded" 
                style={{ height: '400px', border: '1px solid var(--gray-100)', overflow: 'hidden' }}
              >
                {/* SVG Visualizing Jodhpur Ward Layout */}
                <svg viewBox="0 0 500 400" className="w-100 h-100">
                  {/* Grid Lines for reference */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e3e8f0" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Draw Ward boundaries as polygon sketches */}
                  {/* Ward 9 - Left */}
                  <polygon points="20,100 150,50 180,250 80,350" fill="rgba(97, 58, 245, 0.03)" stroke="#ccc" strokeDasharray="3" />
                  <text x="70" y="200" fill="#999" fontSize="12" fontWeight="bold">Ward 9</text>
                  
                  {/* Ward 7 - Center */}
                  <polygon points="150,50 320,80 300,280 180,250" fill="rgba(97, 58, 245, 0.05)" stroke="#ccc" strokeDasharray="3" />
                  <text x="220" y="170" fill="#999" fontSize="12" fontWeight="bold">Ward 7</text>
                  
                  {/* Ward 8 - Bottom Center */}
                  <polygon points="180,250 300,280 380,380 80,350" fill="rgba(97, 58, 245, 0.02)" stroke="#ccc" strokeDasharray="3" />
                  <text x="240" y="320" fill="#999" fontSize="12" fontWeight="bold">Ward 8</text>
                  
                  {/* Ward 10 - Right */}
                  <polygon points="320,80 480,120 450,300 300,280" fill="rgba(97, 58, 245, 0.04)" stroke="#ccc" strokeDasharray="3" />
                  <text x="380" y="210" fill="#999" fontSize="12" fontWeight="bold">Ward 10</text>

                  {/* Draw User Location Pin */}
                  {(() => {
                    const userPos = mapCoords(userLat, userLng);
                    return (
                      <g>
                        <circle cx={userPos.x} cy={userPos.y} r="18" fill="rgba(97, 58, 245, 0.15)" className="pulse-element" />
                        <circle cx={userPos.x} cy={userPos.y} r="6" fill="var(--bs-primary)" stroke="#fff" strokeWidth="2" />
                        <text x={userPos.x + 10} y={userPos.y - 10} fill="var(--bs-primary)" fontSize="10" fontWeight="bold">You are here</text>
                      </g>
                    );
                  })()}

                  {/* Draw Issue Pins */}
                  {filteredIssues.map(issue => {
                    const pos = mapCoords(issue.lat, issue.lng);
                    const isSelected = selectedIssueId === issue.id;
                    
                    return (
                      <g 
                        key={issue.id} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedIssueId(issue.id)}
                        onDoubleClick={() => navigate(`/issues/${issue.id}`)}
                      >
                        {/* Heat Range Indicator */}
                        <circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r={isSelected ? "20" : "12"} 
                          fill={issue.category === 'roads' ? 'rgba(183, 114, 36, 0.2)' : 'rgba(97, 58, 245, 0.15)'}
                          style={{ transition: 'all 0.2s' }}
                        />
                        {/* Center Pin */}
                        <circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r="6" 
                          fill={
                            issue.category === 'roads' ? '#b77224' :
                            issue.category === 'water' ? '#00aaff' :
                            issue.category === 'sanitation' ? '#3c9718' : '#b7131a'
                          } 
                          stroke={isSelected ? "#fff" : "transparent"} 
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Map Overlay Card showing details of currently highlighted issue */}
                {selectedIssueId && (
                  <div 
                    className="position-absolute bottom-0 left-0 right-0 p-3 bg-white border-top d-flex justify-content-between align-items-center"
                    style={{ zIndex: 10, width: '100%' }}
                  >
                    {(() => {
                      const selectedIssue = issues.find(i => i.id === selectedIssueId);
                      if (!selectedIssue) return null;
                      return (
                        <>
                          <div style={{ flexGrow: 1, marginRight: '1rem', overflow: 'hidden' }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge badge-primary">{selectedIssue.category}</span>
                              <span className="body-3 text-muted">{selectedIssue.location_name}</span>
                            </div>
                            <h6 className="fw-semibold m-0 text-truncate">{selectedIssue.title}</h6>
                          </div>
                          <button 
                            onClick={() => navigate(`/issues/${selectedIssue.id}`)}
                            className="btn btn-primary btn-sm flex-shrink-0"
                          >
                            Open Details
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
