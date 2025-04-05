// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchIssues } from '../services/getissueService';
import IssueMap from '../components/map/IssueMap';
import IssueList from '../components/issues/IssueList';
import './Dashboard.css';

export const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const issuesData = await fetchIssues();
        console.log('Issues in component:', issuesData);
        setIssues(issuesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  if (loading) return <div className="loading">Loading issues...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Urban Issues Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="map-section">
          <h2>Issues Map</h2>
          <IssueMap issues={issues} />
        </div>
        
        <div className="stats-section">
          <h2>Statistics</h2>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Issues</h3>
              <p>{issues.length}</p>
            </div>
            <div className="stat-card">
              <h3>Open Issues</h3>
              <p>{issues.filter(i => i.status === 'OPEN').length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Issues</h3>
              <p>{issues.filter(i => i.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="recent-issues">
        <h2>Recent Issues</h2>
        <IssueList issues={issues.slice(0, 5)} />
      </div>
    </div>
  );
};