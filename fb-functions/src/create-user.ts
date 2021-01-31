import * as functions from 'firebase-functions';
import { admin } from './shared';

/**
 * Create a Firebase user and return the new user and a custom token
 * for the user. This ensures the newly created user is not
 * logged in on the front end which changes the
 */
export const createUser = functions.https.onCall(async (data, context) => {
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'This function must be called with one argument "email" containing the users email');
  }

  const password = data.password;
  if (!password) {
    throw new functions.https.HttpsError('invalid-argument', 'This function must be called with one argument "password" containing the users password');
  }

  const name = data.name;
  if (!name) {
    throw new functions.https.HttpsError('invalid-argument', 'This function must be called with one argument "name" containing the users name');
  }

  try {
    return await admin.auth().createUser({
      email: email,
      emailVerified: true,
      password: password,
      displayName: name,
    });
  } catch (error) {
    throw new functions.https.HttpsError('already-exists', error);
  }
});
