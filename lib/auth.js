import { supabase } from './supabase';

/**
 * Sends a one-time password (OTP) or magic link to the provided email.
 * @param {string} email - The user's email address.
 * @returns {Promise<{ error: object | null }>} - The result of the operation.
 */
export async function sendOTP(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Option to specify redirect URL if using a Magic Link
        // emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return { error };
  }
}

/**
 * Verifies the 6-digit OTP token entered by the user.
 * @param {string} email - The user's email address.
 * @param {string} token - The 6-digit OTP code.
 * @returns {Promise<{ data: object | null, error: object | null }>} - The session data or error.
 */
export async function verifyOTP(email, token) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return { data: null, error };
  }
}

/**
 * Logs out the current user and clears the session.
 * @returns {Promise<{ error: object | null }>} - The result of the operation.
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error during logout:', error.message);
    return { error };
  }
}

/**
 * Initiates the Google OAuth login flow.
 * @returns {Promise<{ error: object | null }>} - The result of the operation.
 */
export async function loginWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error with Google login:', error.message);
    return { error };
  }
}
