import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import TrendDashboard from './components/trend/TrendDashboard';
import CreateIncident from './components/incident/CreateIncident';
import IncidentListing from './components/incident/IncidentListing';
import IncidentReview from './components/incident/IncidentReview';
import IncidentInspection from './components/incident/IncidentInspection';
import IncidentInvestigation from './components/incident/IncidentInvestigation';
import RootCauseAnalysis from './components/incident/RootCauseAnalysis';
import IncidentResolution from './components/incident/IncidentResolution';
import IncidentAction from './components/incident/IncidentAction';
import IncidentWorkflow from './components/incident/IncidentWorkflow';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incident/dashboard" element={<Dashboard />} />
          <Route path="/incident/trend" element={<TrendDashboard />} />
          <Route path="/incident/create-new-incident" element={<CreateIncident />} />
          <Route path="/incident/listing" element={<IncidentListing />} />
          <Route path="/incident/review" element={<IncidentReview />} />
          <Route path="/incident/inspection-listing" element={<IncidentInspection />} />
          <Route path="/incident/investigation" element={<IncidentInvestigation />} />
          <Route path="/incident/root-cause-analysis" element={<RootCauseAnalysis />} />
          <Route path="/incident/resolution" element={<IncidentResolution />} />
          <Route path="/incident/action" element={<IncidentAction />} />
          <Route path="/incident/workflow" element={<IncidentWorkflow />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
