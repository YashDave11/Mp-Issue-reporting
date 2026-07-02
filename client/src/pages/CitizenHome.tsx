import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MapPin, PlusCircle, CheckCircle, BarChart2, Globe, 
  Settings, ShieldAlert, Award, FileText, ChevronRight, HelpCircle 
} from 'lucide-react';

type Lang = 'en' | 'hi';

const LANG_KEY = 'pp_lang';

export const CitizenHome = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem(LANG_KEY) as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
    // Reload navbar if present or trigger page re-render
    window.dispatchEvent(new Event('storage'));
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate('/issues', { state: { category: categoryName } });
  };

  // Translations dictionary matching the DigiLocker guidelines
  const t = {
    en: {
      govPortal: "Constituency Grievance & Development Engine",
      constituency: "Jodhpur Lok Sabha Constituency | Jodhpur, Rajasthan",
      title: "Peoples Priorities AI",
      tagline: "Your voice shapes your constituency's future",
      subtext: "Peoples Priorities AI is a key civic-tech platform under the Constituency Development Programme. Submit local suggestions via text, voice, or photo. Our AI system transcribes, translates, and filters duplicates so your MP Office can prioritize what matters most.",
      reportBtn: "Report an Issue / Suggestion",
      reportSub: "File via Voice, Text, or Photo",
      seeIssuesBtn: "See Issues Near Me",
      seeIssuesSub: "View local heatmaps & ranked feed",
      categoryHeading: "Departments & Grievance Categories",
      categorySub: "Browse reported issues by sector to support existing claims",
      stepsHeading: "How Peoples Priorities AI Works",
      stepsSub: "From citizen submission to executive decision making",
      step1: "Speak or Type",
      step1Desc: "Submit reports in Hindi or English. AI automatically transcribes voice notes and translates regional inputs.",
      step2: "Smart Duplicate Check",
      step2Desc: "Before publishing, AI searches for similar nearby issues. Citizens can upvote existing issues to raise priority.",
      step3: "Ranked Priorities",
      step3Desc: "MP Office accesses a ranked cockpit based on community demand, infrastructure gap, and urgency scores.",
      statsHeading: "Platform Trust & Active Statistics",
      statIssues: "Total Issues Reported",
      statSupporters: "Verified Citizen Upvotes",
      statResolved: "Resolved & Closed",
      footerTag: "Peoples Priorities AI is an interactive citizen-participation portal built for localized constituency priority mapping and public project prioritization.",
      footerSec1: "Grievance Categories",
      footerSec2: "Important Portals",
      rights: "© 2026 Constituency Development Engine Jodhpur. Developed for Public Engagement."
    },
    hi: {
      govPortal: "निर्वाचन क्षेत्र शिकायत एवं विकास इंजन",
      constituency: "जोधपुर लोकसभा क्षेत्र | जोधपुर, राजस्थान",
      title: "पीपल्स प्रायॉरिटीज AI",
      tagline: "आपकी आवाज़ आपके क्षेत्र का भविष्य बनाती है",
      subtext: "पीपल्स प्रायॉरिटीज AI निर्वाचन क्षेत्र विकास कार्यक्रम के तहत एक प्रमुख नागरिक-तकनीकी मंच है। स्थानीय समस्याएं या सुझाव टेक्स्ट, आवाज़ या फ़ोटो के माध्यम से सबमिट करें। हमारा AI सिस्टम अनुवाद और डुप्लीकेट जांच करता है ताकि आपका सांसद कार्यालय सबसे महत्वपूर्ण कार्यों को प्राथमिकता दे सके।",
      reportBtn: "समस्या / सुझाव दर्ज करें",
      reportSub: "आवाज़, टेक्स्ट या फ़ोटो द्वारा दर्ज करें",
      seeIssuesBtn: "मेरे निकट के मुद्दे देखें",
      seeIssuesSub: "स्थानीय हीटमैप और रैंक की गई सूची देखें",
      categoryHeading: "विभाग और शिकायत श्रेणियां",
      categorySub: "मौजूदा दावों का समर्थन करने के लिए श्रेणी के अनुसार मुद्दे खोजें",
      stepsHeading: "कागजी कार्रवाई के बिना सीधा प्राथमिकता मानचित्रण",
      stepsSub: "नागरिक सबमिशन से लेकर सांसद कार्यालय के निर्णय लेने तक की प्रक्रिया",
      step1: "बोलें या टाइप करें",
      step1Desc: "हिंदी या अंग्रेजी में रिपोर्ट सबमिट करें। AI स्वचालित रूप से आवाज़ को ट्रांसक्राइब और अनुवादित करता है।",
      step2: "स्मार्ट डुप्लिकेट जांच",
      step2Desc: "प्रकाशन से पहले, AI समान निकटवर्ती मुद्दों की खोज करता है। नागरिक प्राथमिकता बढ़ाने के लिए मौजूदा मुद्दों का समर्थन कर सकते हैं।",
      step3: "रैंक की गई प्राथमिकताएं",
      step3Desc: "सांसद कार्यालय सामुदायिक मांग, बुनियादी ढांचे के अंतर और तात्कालिकता स्कोर के आधार पर रैंकिंग देखता है।",
      statsHeading: "नागरिक विश्वास और सक्रिय आंकड़े",
      statIssues: "कुल दर्ज शिकायतें",
      statSupporters: "सत्यापित नागरिक समर्थन",
      statResolved: "सुलझाए गए और बंद मुद्दे",
      footerTag: "पीपल्स प्रायॉरिटीज AI स्थानीय निर्वाचन क्षेत्र प्राथमिकताओं के मानचित्रण और सार्वजनिक परियोजनाओं के सुदृढ़ीकरण के लिए बनाया गया एक नागरिक-भागीदारी पोर्टल है।",
      footerSec1: "शिकायत श्रेणियां",
      footerSec2: "महत्वपूर्ण पोर्टल",
      rights: "© 2026 निर्वाचन क्षेत्र विकास इंजन जोधपुर। जनभागीदारी के लिए विकसित।"
    }
  }[lang];

  const categories = [
    { name: "roads", label: lang === 'en' ? "Roads & Highways" : "सड़कें और राजमार्ग", bg: "#FFECE6", color: "#E04F2E", count: "4 Issues" },
    { name: "water", label: lang === 'en' ? "Water & Drains" : "पेयजल और नालियां", bg: "#E6F4FF", color: "#1A73E9", count: "3 Issues" },
    { name: "sanitation", label: lang === 'en' ? "Sanitation & Trash" : "स्वच्छता और कचरा", bg: "#EAFCE8", color: "#1B800F", count: "3 Issues" },
    { name: "school infrastructure", label: lang === 'en' ? "School Buildings" : "स्कूल और शिक्षा", bg: "#FFF9E6", color: "#B88E00", count: "2 Issues" },
    { name: "health", label: lang === 'en' ? "Health Clinics" : "चिकित्सालय और स्वास्थ्य", bg: "#E6FAF8", color: "#00A396", count: "2 Issues" },
    { name: "public safety", label: lang === 'en' ? "Streetlights & Safety" : "स्ट्रीटलाइट और सुरक्षा", bg: "#F1EEFF", color: "#502EE3", count: "1 Issue" }
  ];

  return (
    <div className="bg-digi-gray" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Government Navy Authority Top Bar */}
      <div className="bg-gov-navy text-white py-2" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            <span>{t.govPortal}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-md-inline text-white-50">{t.constituency}</span>
            <button 
              onClick={toggleLanguage}
              className="btn btn-sm btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-1 fw-bold"
              style={{ fontSize: '0.78rem' }}
            >
              <Globe size={13} />
              {lang === 'en' ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tri-color national accent strip */}
      <div className="gov-flag-strip"></div>

      {/* 2. Institutional Branding Header */}
      <header className="bg-white py-3 shadow-card-subtle border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div 
              className="bg-primary-blue text-white d-flex align-items-center justify-content-center rounded-lg-digi shadow-blue-glow" 
              style={{ width: 44, height: 44 }}
            >
              <BarChart2 size={24} />
            </div>
            <div>
              <h2 className="m-0 h4 fw-bold text-gov-navy" style={{ letterSpacing: '-0.5px' }}>{t.title}</h2>
              <p className="m-0 text-muted" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Constituency Development Portal
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-lavender-surface text-purple-accent px-3 py-2 rounded-pill-digi fw-bold" style={{ fontSize: '0.75rem' }}>
              Jodhpur Ward 7 - 10
            </span>
          </div>
        </div>
      </header>

      {/* 3. Hero & Action Buttons Section */}
      <section className="bg-white py-5 shadow-card-subtle" style={{ borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="row align-items-center g-4">
            
            {/* Onboarding text */}
            <div className="col-lg-7 col-12">
              <span className="text-primary-blue fw-bold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1.5px' }}>
                Digital Civic Initiative · डिजिटल नागरिक पहल
              </span>
              <h1 className="my-2 display-thin text-deep-navy font-headline" style={{ fontSize: '2.2rem', fontWeight: 300, lineHeight: 1.25 }}>
                {t.tagline}
              </h1>
              <p className="text-muted leading-relaxed font-body" style={{ fontSize: '0.95rem', lineHeight: 1.65, maxWidth: '600px' }}>
                {t.subtext}
              </p>
            </div>

            {/* Core Action CTAs */}
            <div className="col-lg-5 col-12">
              <div className="bg-digi-gray p-4 rounded-3xl-digi border d-flex flex-column gap-3 shadow-card-subtle">
                
                {/* Report Grievance CTA */}
                <button
                  onClick={() => navigate('/report')}
                  className="btn btn-primary bg-primary-blue w-100 py-3 text-start d-flex align-items-center gap-3 border-0 rounded-2xl-digi shadow-blue-glow animate-hover"
                  style={{ transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="bg-white text-primary-blue rounded-xl-digi p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <div className="fw-bold text-white" style={{ fontSize: '0.95rem' }}>{t.reportBtn}</div>
                    <div className="text-white-50" style={{ fontSize: '0.75rem' }}>{t.reportSub}</div>
                  </div>
                  <ChevronRight size={18} className="ms-auto text-white-50" />
                </button>

                {/* View Heatmaps CTA */}
                <button
                  onClick={() => navigate('/issues')}
                  className="btn btn-white w-100 py-3 text-start d-flex align-items-center gap-3 rounded-2xl-digi digi-interactive-card bg-white"
                  style={{ transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="bg-lavender-surface text-purple-accent rounded-xl-digi p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="fw-bold text-gov-navy" style={{ fontSize: '0.95rem' }}>{t.seeIssuesBtn}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t.seeIssuesSub}</div>
                  </div>
                  <ChevronRight size={18} className="ms-auto text-muted" />
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Document-Issuer Style Category Grid */}
      <section className="py-5 bg-digi-gray">
        <div className="container">
          
          <div className="text-center mb-4">
            <h2 className="section-heading text-gov-navy mb-1" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {t.categoryHeading}
            </h2>
            <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>
              {t.categorySub}
            </p>
          </div>

          <div className="row g-3">
            {categories.map((cat) => (
              <div className="col-lg-4 col-sm-6 col-12" key={cat.name}>
                <div 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="card bg-white h-100 rounded-2xl-digi digi-interactive-card cursor-pointer shadow-card-subtle"
                  style={{ border: '1px solid #e2e8f0', cursor: 'pointer' }}
                >
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div 
                      className="rounded-xl-digi d-flex align-items-center justify-content-center"
                      style={{ 
                        width: 50, 
                        height: 50, 
                        backgroundColor: cat.bg, 
                        color: cat.color,
                        flexShrink: 0
                      }}
                    >
                      {cat.name === 'roads' && <Settings size={24} />}
                      {cat.name === 'water' && <Award size={24} />}
                      {cat.name === 'sanitation' && <FileText size={24} />}
                      {cat.name === 'school infrastructure' && <ShieldAlert size={24} />}
                      {cat.name === 'health' && <HelpCircle size={24} />}
                      {cat.name === 'public safety' && <Mic size={24} />}
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="m-0 text-gov-navy card-title" style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                        {cat.label}
                      </h3>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {cat.count}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. How It Works Timeline */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="text-center mb-5">
            <h2 className="section-heading text-gov-navy mb-1" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {t.stepsHeading}
            </h2>
            <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>
              {t.stepsSub}
            </p>
          </div>

          <div className="row g-4">
            
            <div className="col-md-4 col-12 text-center">
              <div 
                className="bg-lavender-surface text-purple-accent d-flex align-items-center justify-content-center mx-auto mb-3 rounded-full-pill-digi shadow-card-subtle"
                style={{ width: 60, height: 60 }}
              >
                <Mic size={28} />
              </div>
              <h4 className="fw-bold text-gov-navy mb-2" style={{ fontSize: '1rem' }}>1. {t.step1}</h4>
              <p className="text-muted px-2" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                {t.step1Desc}
              </p>
            </div>

            <div className="col-md-4 col-12 text-center">
              <div 
                className="bg-lavender-surface text-purple-accent d-flex align-items-center justify-content-center mx-auto mb-3 rounded-full-pill-digi shadow-card-subtle"
                style={{ width: 60, height: 60 }}
              >
                <CheckCircle size={28} />
              </div>
              <h4 className="fw-bold text-gov-navy mb-2" style={{ fontSize: '1rem' }}>2. {t.step2}</h4>
              <p className="text-muted px-2" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                {t.step2Desc}
              </p>
            </div>

            <div className="col-md-4 col-12 text-center">
              <div 
                className="bg-lavender-surface text-purple-accent d-flex align-items-center justify-content-center mx-auto mb-3 rounded-full-pill-digi shadow-card-subtle"
                style={{ width: 60, height: 60 }}
              >
                <BarChart2 size={28} />
              </div>
              <h4 className="fw-bold text-gov-navy mb-2" style={{ fontSize: '1rem' }}>3. {t.step3}</h4>
              <p className="text-muted px-2" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                {t.step3Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Active Grievance Statistics Counter */}
      <section className="py-5 bg-digi-gray">
        <div className="container">
          
          <div className="text-center mb-4">
            <h2 className="section-heading text-gov-navy mb-1" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {t.statsHeading}
            </h2>
          </div>

          <div className="row g-3 justify-content-center">
            
            <div className="col-md-3 col-sm-6 col-12 text-center">
              <div className="bg-white p-4 rounded-2xl-digi shadow-card-subtle border">
                <span className="text-primary-blue fw-bold" style={{ fontSize: '2rem', display: 'block', lineHeight: 1.1 }}>15</span>
                <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.statIssues}</span>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 col-12 text-center">
              <div className="bg-white p-4 rounded-2xl-digi shadow-card-subtle border">
                <span className="text-primary-blue fw-bold" style={{ fontSize: '2rem', display: 'block', lineHeight: 1.1 }}>461</span>
                <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.statSupporters}</span>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 col-12 text-center">
              <div className="bg-white p-4 rounded-2xl-digi shadow-card-subtle border">
                <span className="text-success fw-bold" style={{ fontSize: '2rem', display: 'block', lineHeight: 1.1 }}>9</span>
                <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.statResolved}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Government-Standard Footer */}
      <footer className="text-white mt-auto" style={{ backgroundColor: '#121224', borderTop: '4px solid #1a73e9' }}>
        
        {/* Flag line footer accent */}
        <div className="gov-flag-strip"></div>

        <div className="container py-5">
          <div className="row g-4">
            
            <div className="col-lg-5 col-12">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary-blue text-white rounded-lg-digi d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                  <BarChart2 size={18} />
                </div>
                <span className="fw-bold h5 m-0 text-white" style={{ letterSpacing: '-0.3px' }}>{t.title}</span>
              </div>
              <p className="text-white-50" style={{ fontSize: '0.8rem', lineHeight: 1.6, maxWidth: 380 }}>
                {t.footerTag}
              </p>
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <h5 className="fw-bold text-white mb-3" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t.footerSec1}
              </h5>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                <li><span onClick={() => handleCategoryClick('roads')} style={{ cursor: 'pointer', color: '#8bb5ff' }}>Roads & Transports</span></li>
                <li><span onClick={() => handleCategoryClick('water')} style={{ cursor: 'pointer', color: '#8bb5ff' }}>Drinking Water Supply</span></li>
                <li><span onClick={() => handleCategoryClick('sanitation')} style={{ cursor: 'pointer', color: '#8bb5ff' }}>Sanitation & Sewers</span></li>
                <li><span onClick={() => handleCategoryClick('school infrastructure')} style={{ cursor: 'pointer', color: '#8bb5ff' }}>Primary School Infrastructure</span></li>
              </ul>
            </div>

            <div className="col-lg-4 col-sm-6 col-12">
              <h5 className="fw-bold text-white mb-3" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t.footerSec2}
              </h5>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                <div>
                  <span className="text-white-50">Local Administration: </span>
                  <span className="text-white fw-semibold">District Collectorate Jodhpur</span>
                </div>
                <div>
                  <span className="text-white-50">Grievance Portal: </span>
                  <span className="text-white fw-semibold">Rajasthan Sampark Portal</span>
                </div>
                <div>
                  <span className="text-white-50">National Platform: </span>
                  <span className="text-white fw-semibold">MyGov India</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright strip */}
        <div style={{ backgroundColor: '#0a0a18', paddingTop: '1rem', paddingBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-white-50" style={{ fontSize: '0.75rem' }}>
            <span>{t.rights}</span>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 text-decoration-none">Terms of Service</a>
              <a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
};
