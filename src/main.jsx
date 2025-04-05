import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { 
  Authenticator,
  withAuthenticator 
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App';
import './index.css';
import amplifyconfig from './amplifyconfiguration.json';

// Enhanced Amplify configuration
Amplify.configure({
  ...amplifyconfig,
  API: {
    endpoints: [
      // Original Amplify-created API
      {
        name: 'urbanissue',
        endpoint: amplifyconfig.aws_cloud_logic_custom.find(api => api.name === 'urbanissue')?.endpoint,
        region: amplifyconfig.aws_project_region,
        custom_header: async () => {
          const { tokens } = await fetchAuthSession();
          return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens?.idToken?.toString()}`
          };
        }
      },
      // New console-created FormSubmissionAPI
      {
        name: 'FormSubmissionAPI',
        endpoint: 'https://8ckklc5esd.execute-api.eu-west-2.amazonaws.com/prod',
        region: amplifyconfig.aws_project_region,
        service: 'execute-api', // Required for non-Amplify-created APIs
        custom_header: async () => {
          const { tokens } = await fetchAuthSession();
          return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens?.idToken?.toString()}`
          };
        }
      }
    ]
  }
});

// Using Authenticator component (recommended)
function AuthenticatedApp() {
  return (
    <Authenticator
      loginMechanisms={['email']}
      socialProviders={['google', 'facebook']}
      variation="modal"
    >
      {({ signOut, user }) => (
        <App signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthenticatedApp />
  </React.StrictMode>
);