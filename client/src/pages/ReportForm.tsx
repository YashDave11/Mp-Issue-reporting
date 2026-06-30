import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Image, MapPin, Send, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { checkDuplicates, createIssue, uploadMedia, upvoteIssue } from '../utils/api';

const WARDS = [
  { name: 'Ward 7', lat: 26.2389, lng: 73.0243 },
  { name: 'Ward 8', lat: 26.2410, lng: 73.0280 },
  { name: 'Ward 9', lat: 26.2350, lng: 73.0190 },
  { name: 'Ward 10', lat: 26.2450, lng: 73.0320 }
];

export const ReportForm = () => {
  const navigate = useNavigate();
  
  // Form State
  const [text, setText] = useState('');
  const [selectedWard, setSelectedWard] = useState(WARDS[0]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [duplicateCandidates, setDuplicateCandidates] = useState<any[]>([]);
  const [showDuplicateScreen, setShowDuplicateScreen] = useState(false);
  const [inputTextForDedupe, setInputTextForDedupe] = useState('');

  // Start Recording Mock
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  // Stop Recording Mock
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    
    // Simulate audio file creation
    // Set a mock voice url (using a known seeded name or mock file)
    setVoiceUrl('/uploads/mock_voice_sadak.mp3');
    if (!text) {
      setText('Sadak toot gayi hai school ke paas (Voice Note)');
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setLoading(true);
        setLoadingStage('Uploading photo...');
        const url = await uploadMedia(file);
        setPhotoUrl(url);
      } catch (err) {
        alert('Photo upload failed');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Initial Submit (checks duplicates first)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !voiceUrl) {
      alert('Please enter issue description or record a voice note.');
      return;
    }
    
    try {
      setLoading(true);
      setLoadingStage('Checking duplicates...');
      
      const res = await checkDuplicates(text, selectedWard.lat, selectedWard.lng);
      if (res.candidates && res.candidates.length > 0) {
        setDuplicateCandidates(res.candidates);
        setInputTextForDedupe(res.detected_text || text);
        setShowDuplicateScreen(true);
      } else {
        // No duplicates, proceed to create directly
        await handleConfirmCreate(text);
      }
    } catch (err) {
      console.error(err);
      // Fallback: create directly if dedupe endpoint fails
      await handleConfirmCreate(text);
    } finally {
      setLoading(false);
    }
  };

  // Confirms creation of new issue
  const handleConfirmCreate = async (descText: string) => {
    try {
      setLoading(true);
      setLoadingStage('AI pipeline is translating, classifying, and prioritizing...');
      
      const payload = {
        text: descText,
        location_name: selectedWard.name,
        lat: selectedWard.lat,
        lng: selectedWard.lng,
        voice_url: voiceUrl || undefined,
        image_urls: photoUrl ? [photoUrl] : []
      };
      
      const res = await createIssue(payload);
      if (res.status === 'success' && res.issue) {
        navigate(`/issues/${res.issue.id}`);
      }
    } catch (err) {
      alert('Failed to submit issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Citizen chooses an existing duplicate thread instead
  const handleSupportDuplicate = async (issueId: string) => {
    try {
      setLoading(true);
      setLoadingStage('Adding you as supporter...');
      await upvoteIssue(issueId);
      navigate(`/issues/${issueId}`, { state: { upvoted: true } });
    } catch (err) {
      // If upvote fails (e.g. already supported), just navigate
      navigate(`/issues/${issueId}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
        <div className="card shadow rounded-lg p-5 glass-panel">
          <Loader2 className="text-primary pulse-element mx-auto mb-4" size={60} />
          <h3 className="h4 fw-bold">{loadingStage}</h3>
          <p className="text-muted mt-2">Please wait while the Peoples Priorities AI system works.</p>
        </div>
      </div>
    );
  }

  if (showDuplicateScreen) {
    return (
      <div className="container py-4" style={{ maxWidth: '600px' }}>
        <div className="card shadow rounded-lg p-4 border-warning bg-white">
          <div className="text-center mb-4">
            <AlertTriangle className="text-warning mx-auto mb-2" size={48} />
            <h2 className="h3 fw-bold text-primary-900">Similar Issue Already Exists</h2>
            <p className="text-muted">समान मुद्दा पहले ही दर्ज है।</p>
            <p className="body-2">
              People near you have already reported this issue. Please support the existing thread to help it get prioritized faster!
            </p>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            {duplicateCandidates.map((c) => (
              <div key={c.issue_id} className="card border rounded p-3 bg-light">
                <h5 className="fw-semibold mb-1" style={{ color: 'var(--primary-900)' }}>{c.title}</h5>
                <p className="body-2 text-muted mb-2">{c.summary}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge badge-primary">{c.location_name}</span>
                  <div className="d-flex gap-2">
                    <span className="body-2 text-muted">{c.upvote_count} supporters</span>
                    <span className="badge badge-success">Match: {Math.round(c.similarity_score * 100)}%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSupportDuplicate(c.issue_id)}
                  className="btn btn-primary btn-sm mt-3 w-100 py-2"
                  style={{ borderRadius: '8px' }}
                >
                  This affects me too! / यह मुझे भी प्रभावित करता है
                </button>
              </div>
            ))}
          </div>

          <div className="d-flex flex-column gap-2 border-top pt-3">
            <button
              onClick={() => handleConfirmCreate(inputTextForDedupe)}
              className="btn btn-outline-primary w-100"
              style={{ borderRadius: '8px' }}
            >
              My issue is different, create new issue anyway
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setShowDuplicateScreen(false)}
              className="btn btn-light w-100"
              style={{ borderRadius: '8px' }}
            >
              Go back and edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow rounded-lg p-4 bg-white">
        <h2 className="h3 fw-bold mb-1 text-center" style={{ color: 'var(--primary-900)' }}>Report an Issue</h2>
        <p className="text-muted text-center mb-4">नया मुद्दा रिपोर्ट करें</p>

        <form onSubmit={handleSubmit}>
          {/* Locality Selector */}
          <div className="form-group">
            <label className="form-label d-flex align-items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>Select Ward / Locality | वार्ड / क्षेत्र चुनें</span>
            </label>
            <select 
              className="form-select"
              value={selectedWard.name}
              onChange={(e) => {
                const w = WARDS.find(item => item.name === e.target.value);
                if (w) setSelectedWard(w);
              }}
            >
              {WARDS.map(w => (
                <option key={w.name} value={w.name}>{w.name} (Jodhpur)</option>
              ))}
            </select>
          </div>

          {/* Voice Input Section */}
          <div className="form-group border rounded p-3 bg-light text-center mb-4">
            <label className="form-label mb-2 fw-semibold">
              Option A: Record Voice Note | विकल्प A: आवाज रिकॉर्ड करें
            </label>
            
            {isRecording ? (
              <div className="py-2">
                <div 
                  className="pulse-element bg-danger text-white mx-auto d-flex align-items-center justify-content-center mb-2"
                  style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                >
                  <Mic size={24} />
                </div>
                <div className="fw-semibold text-danger">Recording... {recordingSeconds}s</div>
                
                {/* Visualizer wave mock */}
                <div className="d-flex justify-content-center gap-1 mt-2">
                  <div className="bg-danger" style={{ width: '4px', height: '12px', borderRadius: '2px', animation: 'pulse 1s infinite' }}></div>
                  <div className="bg-danger" style={{ width: '4px', height: '24px', borderRadius: '2px', animation: 'pulse 0.8s infinite' }}></div>
                  <div className="bg-danger" style={{ width: '4px', height: '16px', borderRadius: '2px', animation: 'pulse 1.2s infinite' }}></div>
                </div>

                <button 
                  type="button" 
                  onClick={stopRecording} 
                  className="btn btn-danger btn-sm mt-3"
                  style={{ borderRadius: '20px' }}
                >
                  Stop & Save Note
                </button>
              </div>
            ) : (
              <div className="py-2">
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn btn-outline-primary btn-pill px-4 py-2"
                >
                  <Mic size={18} />
                  <span>Start Voice Recording</span>
                </button>
                {voiceUrl && (
                  <div className="text-success mt-2 fw-medium" style={{ fontSize: '0.85rem' }}>
                    ✓ Voice note recorded: mock_voice.mp3
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Text Input Section */}
          <div className="form-group">
            <label className="form-label d-flex align-items-center gap-2">
              <Send size={16} className="text-primary" />
              <span>Option B: Type Description | विकल्प B: विवरण लिखें</span>
            </label>
            <textarea
              className="form-control"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. School boundary wall is broken and unsafe... (या बोलकर रिकॉर्ड करें)"
            ></textarea>
          </div>

          {/* Photo Upload Section */}
          <div className="form-group border-top pt-3">
            <label className="form-label d-flex align-items-center gap-2">
              <Image size={16} className="text-primary" />
              <span>Attach Proof Photo (Optional) | फोटो अपलोड करें</span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              className="form-control"
            />
            {photoUrl && (
              <div className="mt-2 text-center">
                <img 
                  src={`http://127.0.0.1:8000${photoUrl}`} 
                  alt="Proof preview" 
                  style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} 
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-3 mt-4 d-flex justify-content-center gap-2"
            style={{ borderRadius: '10px', fontSize: '1.05rem' }}
          >
            <span>Analyze & Submit / दर्ज करें</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
