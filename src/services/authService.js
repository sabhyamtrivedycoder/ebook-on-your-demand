// Google Auth & User Session Service

export const DEFAULT_GOOGLE_CLIENT_ID = localStorage.getItem('pagecraft_google_client_id') || '';

/**
 * Get current logged in user from localStorage
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('pagecraft_current_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error reading user session', e);
  }
  return null;
}

/**
 * Save user session
 */
export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem('pagecraft_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pagecraft_current_user');
    }
    window.dispatchEvent(new Event('auth_state_changed'));
  } catch (e) {
    console.error('Error saving user session', e);
  }
}

/**
 * Parse Google JWT Credential token
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT', e);
    return null;
  }
}

/**
 * Initialize real Google Identity Services if client ID is configured
 */
export function initGoogleAuth(clientId, callback) {
  if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
    return false;
  }

  if (!clientId) return false;

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          const payload = parseJwt(response.credential);
          if (payload) {
            const user = {
              id: payload.sub,
              name: payload.name || payload.given_name || 'Google User',
              email: payload.email,
              avatar: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${payload.name || 'User'}`,
              provider: 'google',
              credits: 3,
              joinedAt: new Date().toISOString()
            };
            setCurrentUser(user);
            if (callback) callback(user);
          }
        }
      }
    });
    return true;
  } catch (err) {
    console.error('Failed to initialize Google Accounts', err);
    return false;
  }
}
