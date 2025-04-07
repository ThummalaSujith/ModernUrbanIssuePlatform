import React, {useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import IssueForm from './components/issues/IssueForm';
import { Dashboard } from "./components/Dashboard";

import { Provider } from 'react-redux';

import { store } from './redux/store';

import {fetchIssues} from "./services/getissueService"

const App = () => {

  useEffect(() => {
    fetchIssues().then(data => {
      console.log("✅ Fetched Issues from DynamoDB:", data);
    }).catch(err => {
      console.error("❌ Fetch Error:", err);
    });
  }, []);



  return (
    <Provider store={store}>
    <Router>
      <PageLayout />
    </Router>

    </Provider>
  );
}

const PageLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/report", "/dashboard"];
  const showNavbar = !hideNavbarRoutes.some(path => location.pathname.startsWith(path));


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
