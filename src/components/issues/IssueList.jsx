// src/components/IssueList.jsx
import React from 'react';

const IssueList = ({ issues }) => {
  return (
    <div className="issue-list">
      <h2>Reported Issues</h2>
      <div className="issues-container">
        {issues.map((issue) => (
          <div key={issue.id} className="issue-card">
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            {issue.imageUrl && (
              <img 
                src={issue.imageUrl} 
                alt={issue.title} 
                style={{ maxWidth: '200px' }} 
              />
            )}
            <p>Status: {issue.status || 'UNKNOWN'}</p>
            <p>Reported on: {new Date(issue.createdAt).toLocaleDateString()}</p>
            {issue.location && (
              <p>Location: {issue.location.lat}, {issue.location.lng}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueList;
