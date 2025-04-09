import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/components/LandingPage'
import '@/index.css'
import DashboardPage from '@/app/dashboard/page'
import BusinessesPage from '@/app/businesses/page'
import IndividualsPage from '@/app/individuals/page'
import ReviewsPage from '@/app/reviews/page'
import DocumentsPage from '@/app/documents/page'
import AgentsPage from '@/app/agents/page'
import BusinessOnboardingPage from '@/app/agents/business-onboarding/page'
import AgentTestResultsPage from '@/app/agent-test-results/page'
import AgentTestResultsListPage from '@/app/agent-test-results-list/page'
import UploadCsvPage from '@/app/upload-csv/page'
import ApiIntegrationPage from '@/app/api-integration/page'
import ManualDataEntryPage from '@/app/manual-data-entry/page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/agents" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/individuals" element={<IndividualsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/business-onboarding" element={<BusinessOnboardingPage />} />
        <Route path="/agent-test-results-list" element={<AgentTestResultsListPage />} />
        <Route path="/agent-test-results/:id" element={<AgentTestResultsPage />} />
        <Route path="/upload-csv" element={<UploadCsvPage />} />
        <Route path="/api-integration" element={<ApiIntegrationPage />} />
        <Route path="/manual-data-entry" element={<ManualDataEntryPage />} />
      </Routes>
    </Router>
  )
}

export default App
