import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, MapPin, Calendar, Send, Mic, Image, Loader2, Play } from 'lucide-react';
import { getIssueDetail, upvoteIssue, addComment, uploadMedia } from '../utils/api';
import type { IssueRecord, CommentRecord } from '../types';

export const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationState = useLocation();

  const [issue, setIssue] = useState<IssueRecord | null>(null);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Comment Form State
  const [commentText, setCommentText] = useState('');
  const [commentPhotoUrl, setCommentPhotoUrl] = useState<string | null>(null);
  const [commentVoiceUrl, setCommentVoiceUrl] = useState<string | null>(null);
  
  // Comment Form UI States
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getIssueDetail(id);
      if (res.status === 'success') {
        setIssue(res.issue);
        setComments(res.comments);
        setHasUpvoted(res.user_has_upvoted);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load issue detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // If we arrived with upvote state pre-applied
    if (locationState.state && (locationState.state as any).upvoted) {
      setHasUpvoted(true);
    }
  }, [id]);

  const handleUpvote = async () => {
    if (!issue || hasUpvoted) return;
    try {
      setHasUpvoted(true);
      const res = await upvoteIssue(issue.id);
      if (res.status === 'success') {
        setIssue(res.issue);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setSubmittingComment(true);
        const url = await uploadMedia(e.target.files[0]);
        setCommentPhotoUrl(url);
      } catch (err) {
        alert("Upload failed");
      } finally {
        setSubmittingComment(false);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setCommentVoiceUrl('/uploads/mock_comment_voice.mp3');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || (!commentText.trim() && !commentVoiceUrl && !commentPhotoUrl)) return;

    try {
      setSubmittingComment(true);
      const res = await addComment(id, commentText, commentVoiceUrl || undefined, commentPhotoUrl || undefined);
      if (res.status === 'success') {
        setComments(res.comments);
        setIssue(res.issue);
        // Reset comment form
        setCommentText('');
        setCommentPhotoUrl(null);
        setCommentVoiceUrl(null);
      }
    } catch (err) {
      alert("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-2">Loading issue detail...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container py-5 text-center">
        <h4>Issue not found</h4>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-2">Go Home</button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn btn-light btn-sm mb-3">
        ← Back
      </button>

      {/* Main Issue Panel */}
      <div className="card shadow-sm border-0 mb-4 bg-white rounded-lg overflow-hidden">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge badge-primary">{issue.category}</span>
            <span className={`badge ${
              issue.status === 'open' ? 'badge-danger' : 
              issue.status === 'under_review' ? 'badge-warning' : 
              issue.status === 'resolved' ? 'badge-success' : 'badge-info'
            }`}>{issue.status.replace('_', ' ')}</span>
          </div>

          <h1 className="h3 fw-bold mb-2" style={{ color: 'var(--primary-900)' }}>{issue.title}</h1>
          
          <div className="d-flex gap-3 text-muted mb-4" style={{ fontSize: '0.85rem' }}>
            <span className="d-flex align-items-center gap-1">
              <MapPin size={14} />
              <span>{issue.location_name} (Jodhpur)</span>
            </span>
            <span className="d-flex align-items-center gap-1">
              <Calendar size={14} />
              <span>Reported: {new Date(issue.created_at).toLocaleDateString()}</span>
            </span>
          </div>

          {/* Media references (Image/Voice) */}
          {issue.media_url && (
            <div className="mb-4 text-center bg-light p-3 rounded-lg border">
              {issue.media_url.endsWith('.mp3') || issue.media_url.includes('voice') ? (
                <div className="d-flex align-items-center justify-content-center gap-3 py-2">
                  <Play size={20} className="text-primary" />
                  <span className="fw-semibold">Listen to Voice Note</span>
                  <audio controls src={`http://127.0.0.1:8000${issue.media_url}`} />
                </div>
              ) : (
                <img 
                  src={`http://127.0.0.1:8000${issue.media_url}`} 
                  alt="Issue Proof" 
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                />
              )}
            </div>
          )}

          <div className="bg-light p-3 rounded-lg border mb-4">
            <h5 className="fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>AI Summary / सारांश</h5>
            <p className="body-2 m-0 text-gray-800">{issue.summary}</p>
            {issue.raw_text && issue.raw_text !== issue.normalized_text && (
              <div className="mt-3 pt-3 border-top">
                <span className="label-2 text-muted">Original Input ({issue.language}):</span>
                <p className="body-2 m-0 text-gray-600 italic">"{issue.raw_text}"</p>
              </div>
            )}
          </div>

          {/* Explainable AI Scoring breakdown */}
          <div className="border rounded-lg p-3 mb-4 bg-white">
            <h5 className="fw-bold mb-3" style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>
              AI Priority Score Explanation
            </h5>
            
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="h3 fw-bold m-0 text-primary">{Math.round(issue.priority_score * 100)}</div>
              <div>
                <div className="fw-bold body-2">Explainable Score Rank</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Combines community demand, urgency metrics, and local public infrastructure datasets.
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              {[
                { label: 'Community Demand (30%)', score: issue.score_breakdown.community_demand, desc: `${issue.upvote_count} upvotes & ${issue.comment_count} comments` },
                { label: 'Infrastructure Gap (25%)', score: issue.score_breakdown.infrastructure_gap, desc: 'Shortage in local facility metrics' },
                { label: 'AI Urgency (20%)', score: issue.score_breakdown.ai_urgency, desc: 'Safety/Severity rating from AI' },
                { label: 'Locality Vulnerability (15%)', score: issue.score_breakdown.vulnerability, desc: 'Demographic vulnerability of area' },
                { label: 'Recency (10%)', score: issue.score_breakdown.recency, desc: 'Freshness of report activity' }
              ].map((item, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-medium">{item.label}:</span>
                    <span className="fw-bold text-primary">{Math.round(item.score * 100)}%</span>
                  </div>
                  <div className="w-100 bg-gray-50 rounded" style={{ height: '6px', overflow: 'hidden' }}>
                    <div className="bg-primary h-100" style={{ width: `${item.score * 100}%` }}></div>
                  </div>
                  <div className="text-muted mt-1 mb-2" style={{ fontSize: '0.7rem' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upvote Button CTA */}
          <button
            onClick={handleUpvote}
            disabled={hasUpvoted}
            className={`btn w-100 py-3 d-flex justify-content-center align-items-center gap-2 rounded-lg ${
              hasUpvoted ? 'btn-success' : 'btn-primary'
            }`}
            style={{ fontSize: '1.05rem' }}
          >
            <Heart size={20} fill={hasUpvoted ? "white" : "none"} />
            <span>
              {hasUpvoted 
                ? 'Supported! / समर्थन दिया गया' 
                : 'This affects me too! / यह मुझे भी प्रभावित करता है'}
            </span>
          </button>
        </div>
      </div>

      {/* Community Comments Thread */}
      <div className="card shadow-sm border-0 bg-white rounded-lg p-4 mb-4">
        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--primary-900)' }}>
          <MessageSquare size={20} />
          <span>Community Context & Evidence ({comments.length})</span>
        </h4>

        {/* Comment Input Form */}
        <form onSubmit={handleCommentSubmit} className="mb-4 pb-4 border-bottom">
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add more details, pictures, or voice context..."
            ></textarea>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex gap-2">
              {/* Voice Record inside comment */}
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="btn btn-danger btn-sm"
                  style={{ borderRadius: '12px' }}
                >
                  Stop Recording ({recordingSeconds}s)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderRadius: '12px' }}
                >
                  <Mic size={14} />
                  <span>Record Voice</span>
                </button>
              )}

              {/* Photo upload inside comment */}
              <label 
                className="btn btn-outline-primary btn-sm m-0" 
                style={{ borderRadius: '12px', cursor: 'pointer' }}
              >
                <Image size={14} />
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingComment || (!commentText.trim() && !commentVoiceUrl && !commentPhotoUrl)}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '12px', padding: '0.5rem 1rem' }}
            >
              {submittingComment ? <Loader2 className="spinner-border spinner-border-sm" /> : <Send size={14} />}
              <span>Submit Context</span>
            </button>
          </div>
          
          {commentVoiceUrl && (
            <div className="text-success mt-2 fw-medium" style={{ fontSize: '0.8rem' }}>
              ✓ Voice attachment saved
            </div>
          )}
          {commentPhotoUrl && (
            <div className="text-success mt-2 fw-medium" style={{ fontSize: '0.8rem' }}>
              ✓ Photo attachment saved
            </div>
          )}
        </form>

        {/* Comments Feed */}
        <div className="d-flex flex-column gap-3">
          {comments.map((c) => (
            <div key={c.id} className="border-bottom pb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold body-2" style={{ color: 'var(--primary-900)' }}>
                  Supporter ({c.author_hash.substring(0, 9)})
                </span>
                <span className="body-3 text-muted">
                  {new Date(c.created_at).toLocaleDateString()} at {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="body-2 text-gray-800 m-0">{c.text}</p>
              
              {c.voice_url && (
                <div className="mt-2 bg-light p-2 rounded d-inline-flex align-items-center gap-2">
                  <Play size={12} className="text-primary" />
                  <audio controls src={`http://127.0.0.1:8000${c.voice_url}`} style={{ height: '30px', width: '220px' }} />
                </div>
              )}
              {c.image_url && (
                <div className="mt-2">
                  <img 
                    src={`http://127.0.0.1:8000${c.image_url}`} 
                    alt="Comment attachment" 
                    style={{ maxWidth: '200px', maxHeight: '120px', borderRadius: '4px' }} 
                  />
                </div>
              )}

              {/* AI Insight banner */}
              {c.ai_note && (
                <div 
                  className="mt-2 py-1 px-2 bg-primary-50 rounded text-primary d-inline-block"
                  style={{ fontSize: '0.75rem', fontWeight: 600 }}
                >
                  AI Note: {c.ai_note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
