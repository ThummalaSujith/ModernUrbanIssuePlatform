import { fetchAuthSession } from 'aws-amplify/auth';

export const postIssue = async (issueData) => {
  try {
    // Validate input
    if (!issueData?.description?.trim()) throw new Error('Description is required');
    if (!issueData?.imageBase64) throw new Error('Image data is missing');
    if (!issueData?.imageType) throw new Error('Image type is missing');
    if (!issueData?.location) throw new Error('Location is required');

    // Get authentication tokens
    const { tokens } = await fetchAuthSession();
    if (!tokens?.idToken) {
      throw new Error('Authentication required - Please sign in');
    }

    const idToken = tokens.idToken.toString();

    // Make API call using fetch
    const response = await fetch(
      'https://8ckklc5esd.execute-api.eu-west-2.amazonaws.com/prod/submit',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(issueData)
      }
    );

    // Properly handle fetch response
    const responseBody = await response.json();
    
    if (!response.ok) {
      throw new Error(responseBody.message || `Request failed with status ${response.status}`);
    }

    return responseBody;

  } catch (error) {
    console.error('Submission Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      input: issueData
    });
    
    throw new Error(error.message || 'Failed to submit issue. Please try again.');
  }
};