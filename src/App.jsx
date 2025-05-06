import React, {useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import IssueForm from './components/issues/IssueForm';
import { Dashboard } from "./components/Dashboard";

import { Provider } from 'react-redux';

import { store } from './redux/store';

import {fetchIssues} from "./services/getissueService"

import IssueDetails from "./components/issues/IssueDetails"


import { APIProvider } from "@vis.gl/react-google-maps";
import IssueMap from './components/map/IssueMap';
import DetailedMap from './components/map/DetailedMap';
import Profile from './components/Profile';

const App = () => {

  useEffect(() => {
    fetchIssues().then(data => {
      console.log("✅ Fetched Issues from DynamoDB:", data);
    }).catch(err => {
      console.error("❌ Fetch Error:", err);
    });
  }, []);



  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Provider store={store}>
        <Router>
          <PageLayout />
        </Router>
      </Provider>
    </APIProvider>
  );

}

const PageLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/report", "/dashboard","/issue/","/Map","/profile"];
  const showNavbar = !hideNavbarRoutes.some(path => location.pathname.startsWith(path));


  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<IssueForm />} />
        <Route path="/issue/:id" element={<IssueDetails />} /> 
        <Route path="/Map" element={<DetailedMap/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
