import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, Mic, CheckCircle } from 'lucide-react';

export const CitizenHome = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="text-center mb-5">
        <div 
          className="pulse-element d-flex align-items-center justify-content-center bg-primary-50 text-primary mx-auto mb-4" 
          style={{ width: '80px', height: '80px', borderRadius: '50%' }}
        >
          <Mic size={40} />
        </div>
        <h1 className="h1 mb-2">Raise or Support Local Issues</h1>
        <h2 className="h4 text-muted fw-normal">स्थानीय मुद्दों को उठाएं या समर्थन दें</h2>
        <p className="lead mt-3">
          Peoples Priorities AI helps you report civic problems in your own voice, translates it, and works with the MP office to prioritize local development.
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        <button 
          onClick={() => navigate('/report')}
          className="btn btn-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-3 shadow-sm"
          style={{ borderRadius: '14px', transition: 'all 0.2s' }}
        >
          <PlusCircle size={24} />
          <div className="text-start">
            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>Report a New Issue</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>नया मुद्दा रिपोर्ट करें (Voice / Text)</div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/issues')}
          className="btn btn-outline-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-3 shadow-sm bg-white"
          style={{ borderRadius: '14px', transition: 'all 0.2s' }}
        >
          <MapPin size={24} />
          <div className="text-start">
            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>See Issues Near Me</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>मेरे निकट के मुद्दे देखें (Map & List)</div>
          </div>
        </button>
      </div>

      {/* Feature cards explaining workflow */}
      <div className="row mt-5 g-3">
        <div className="col-12 text-center mb-2">
          <span className="badge badge-primary">How it works | यह कैसे काम करता है</span>
        </div>
        
        <div className="col-md-6 col-12">
          <div className="card h-100 rounded-lg border-0 shadow-sm">
            <div className="card-body d-flex gap-3 align-items-start">
              <Mic className="text-primary mt-1" size={24} />
              <div>
                <h5 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>1. Speak or Type</h5>
                <p className="text-muted m-0" style={{ fontSize: '0.8rem' }}>Report in Hindi or English using text or voice note.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="card h-100 rounded-lg border-0 shadow-sm">
            <div className="card-body d-flex gap-3 align-items-start">
              <CheckCircle className="text-success mt-1" size={24} />
              <div>
                <h5 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>2. Avoid Duplicates</h5>
                <p className="text-muted m-0" style={{ fontSize: '0.8rem' }}>If the issue is already reported, support it with one tap.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
