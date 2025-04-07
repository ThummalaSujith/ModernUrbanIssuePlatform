import { post } from 'aws-amplify/api';
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

    const idToken = tokens.idToken.toString();  //converting to plain string

    // Make API call
    const response = await post({
      apiName: 'FormSubmissionAPI',
      path: '/submit',
      options: {
        body: issueData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`  // Using the actual token here
        }
      }
    });

    const { statusCode, body } = await response.response;
    
    if (statusCode === 401) {
      throw new Error('Session expired. Please sign in again.');
    }

    const responseBody = await body.json();
    
    if (statusCode >= 400) {
      throw new Error(responseBody.message || `Request failed with status ${statusCode}`);
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