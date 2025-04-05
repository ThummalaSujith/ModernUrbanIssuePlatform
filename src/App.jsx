import React from 'react';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import IssueForm from './components/issues/IssueForm';
import { Dashboard } from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <PageLayout />
    </Router>
  );
}

const PageLayout = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/report";

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<IssueForm />} />
      </Routes>
    </div>
  );
}

export default App;
