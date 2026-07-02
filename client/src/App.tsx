import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RequireAuth } from './components/RequireAuth';
import { CitizenHome } from './pages/CitizenHome';
import { LoginPage } from './pages/LoginPage';
import { ReportForm } from './pages/ReportForm';
import { NearbyIssues } from './pages/NearbyIssues';
import { IssueDetail } from './pages/IssueDetail';
import { StaffDashboard } from './pages/StaffDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<CitizenHome />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/issues" element={<NearbyIssues />} />
              <Route path="/issues/:id" element={<IssueDetail />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth allowedRoles={['staff', 'moderator']}>
                    <StaffDashboard />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
