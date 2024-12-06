import React from 'react';
import { SignInPanel, Notifications } from 'lt-components';
import { NotificationStore, UserStore } from '../../stores';
import { config } from '../../config';

/** 
 * The sign in page
 */
export const SignIn = () => {
  return (
    <div className='fill-space'>
      <SignInPanel
        logo={`${process.env.PUBLIC_URL}/images/vertical-logo.png`}
        clientId={config.auth.clientId}
        handleSuccess={handleSuccess}
        handleFailure={handleFailure}
      />
      <Notifications/>
    </div>
  );
};

// HELPERS

/**
 * Handler for a successful user login (stores token and sends to server)
 * @param response - the response from google oauth
 */
const handleSuccess = async(response: any) => {
  try {
    // Need to create redirectURI so server can act on behalf of app
    const redirectURI = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;

    // Send one time auth code to server to receive personal details back
    const result = await fetch(`${config.api.auth}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        code: response.code,
        redirectURI,
      }),
    });

    // Grab the user that the server returned
    const user = await result.json();

    // Check if user was retrieved
    if (!user || !user.roles) {
      throw new Error('User not found');
    }

    // Determine whether the user is an admin
    user.isAdmin = user.roles.includes('ROLE_ADMIN');

    // After server validates the login, set the user and store the user in the cookies
    UserStore.signIn(user, true);
  }
  catch (err) {
    console.log(err);
    NotificationStore.addNotification('error', err.message, 'Sign In Error');
  }
};

/**
 * Handler for a failed user login (log error and say access denied)
 * @param response - the response from google oauth
 */
const handleFailure = (response: any) => {
  // Format error message
  let message = response.error;
  if (response.details) message += `: ${response.details}`;

  console.log(response);
  NotificationStore.addNotification('error', message, 'Error with sign in');
};