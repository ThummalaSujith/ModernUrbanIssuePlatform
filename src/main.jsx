import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth'; 
import '@aws-amplify/ui-react/styles.css';
import App from './App';
import './index.css';
import amplifyconfig from './amplifyconfiguration.json';

// Correct Amplify configuration
Amplify.configure({
  ...amplifyconfig,
  API: {
    endpoints: [
      // Your existing AdminQueries API
      {
        name: 'AdminQueries',
        endpoint: amplifyconfig.aws_cloud_logic_custom.find(api => api.name === 'AdminQueries')?.endpoint,
        region: amplifyconfig.aws_project_region,
        custom_header: async () => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await fetchAuthSession()).tokens?.idToken?.toString()}`
        })
      },
      // External FormSubmissionAPI
      {
        name: 'FormSubmissionAPI',
        endpoint: 'https://8ckklc5esd.execute-api.eu-west-2.amazonaws.com/prod',
        
        region: amplifyconfig.aws_project_region,
        custom_header: async () => ({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await fetchAuthSession()).tokens?.idToken?.toString()}`
        })
      }
    ]
  },
  Auth: {
    authenticationFlowType: 'USER_PASSWORD_AUTH' // Force username/password auth
  }
});

// Updated Authenticator for username-only
function AuthenticatedApp() {
  return (
    <Authenticator
      loginMechanisms={['username']} // Only username login
      variation="modal"
      signUpFields={[
        {
          label: 'Username',
          key: 'username',
          required: true,
          placeholder: 'Choose a username'
        },
        {
          label: 'Password',
          key: 'password',
          required: true,
          placeholder: 'Create a password',
          type: 'password'
        }
      ]}
      socialProviders={[]} // Remove social providers
    >
      {({ signOut, user }) => (
        <App signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

// Render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthenticatedApp />
  </React.StrictMode>
);