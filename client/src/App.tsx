import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GovBanner } from './components/GovBanner';
import { Navbar } from './components/Navbar';
import { CitizenHome } from './pages/CitizenHome';
import { ReportForm } from './pages/ReportForm';
import { NearbyIssues } from './pages/NearbyIssues';
import { IssueDetail } from './pages/IssueDetail';
import { StaffDashboard } from './pages/StaffDashboard';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* Official Government Top Banner */}
        <GovBanner />
        
        {/* Navigation bar with portal toggle buttons */}
        <Navbar />

        {/* Page content routers */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<CitizenHome />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/issues" element={<NearbyIssues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
