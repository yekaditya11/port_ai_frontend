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
import ObservationDashboard from './components/observation/ObservationDashboard';
import CreateObservation from './components/observation/CreateObservation';
import ObservationListing from './components/observation/ObservationListing';
import ObservationInspection from './components/observation/ObservationInspection';
import ObservationClosure from './components/observation/ObservationClosure';
import ObservationReview from './components/observation/ObservationReview';
import ObservationDetailView from './components/observation/ObservationDetailView';
import ObservationAction from './components/observation/ObservationAction';
import ObservationRCA from './components/observation/ObservationRCA';
import ObservationAnalyzer from './components/observation/ObservationAnalyzer';
import ObservationWorkflow from './components/observation/ObservationWorkflow';
import ObservationLog from './components/observation/ObservationLog';
import ObservationConfiguration from './components/observation/ObservationConfiguration';
import DensityReport from './components/observation/reports/DensityReport';
import ListReport from './components/observation/reports/ListReport';
import PerformanceReport from './components/observation/reports/PerformanceReport';
import ChatAI from './components/chat/ChatAI';

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
          <Route path="/observation/dashboard" element={<ObservationDashboard />} />
          <Route path="/observation/create-new-observation" element={<CreateObservation />} />
          <Route path="/observation/listing" element={<ObservationListing />} />
          <Route path="/observation/inspection" element={<ObservationInspection />} />
          <Route path="/observation/closure" element={<ObservationClosure />} />
          <Route path="/observation/review" element={<ObservationReview />} />
          <Route path="/observation/review/:id" element={<ObservationDetailView />} />
          <Route path="/observation/action" element={<ObservationAction />} />
          <Route path="/observation/root-cause" element={<ObservationRCA />} />
          <Route path="/observation/analyser" element={<ObservationAnalyzer />} />
          <Route path="/observation/workflow" element={<ObservationWorkflow />} />
          <Route path="/observation/observation-log" element={<ObservationLog />} />
          <Route path="/observation/reports/density-report" element={<DensityReport />} />
          <Route path="/observation/reports/observation-list" element={<ListReport />} />
          <Route path="/observation/reports/observer-performance" element={<PerformanceReport />} />
          <Route path="/observation/configuration" element={<ObservationConfiguration />} />
          <Route path="/chat-ai" element={<ChatAI />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
