// contexts/AuthContext.jsx - Enhanced version with better integration
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from './SessionContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use session context
  const { 
    sessionActive, 
    sessionLoading, 
    checkSession, 
    cleanupSession, 
    updateActivity,
    startHeartbeat,
    stopHeartbeat 
  } = useSession();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log('Initializing auth...');
        
        // First, try to get current user directly (this will validate the session)
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          console.log('User found, setting user and starting heartbeat');
          setUser(currentUser);
          // Update session context and start heartbeat only if user is valid
          updateActivity();
          startHeartbeat();
          // Ensure session context knows we're active
          await checkSession();
        } else {
          console.log('No valid user found');
          // Only cleanup if we're sure there's no valid session
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't set auth error on initialization - user might just not be logged in
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized && !sessionLoading) {
      initializeAuth();
    }
  }, [sessionLoading, checkSession, startHeartbeat, updateActivity, isInitialized]);

  // Sync auth state with session state - but be more careful about cleanup
  useEffect(() => {
    if (isInitialized && !sessionLoading) {
      // Only clear user if session is definitively expired AND we had a user before
      if (!sessionActive && user) {
        console.log('Session expired, clearing user data');
        setUser(null);
        setAuthError('Your session has expired. Please sign in again.');
        stopHeartbeat();
      }
      setLoading(false);
    }
  }, [sessionActive, sessionLoading, isInitialized, stopHeartbeat]); // Removed 'user' from dependencies to avoid loops

  // Login function with enhanced error handling and session management
  const signin = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      console.log('Attempting signin for:', email);
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signin successful, setting user:', data.user?.email);
        setUser(data.user);
        
        // Update activity and start heartbeat BEFORE checking session
        updateActivity();
        startHeartbeat();
        
        // Small delay to ensure session is established
        setTimeout(async () => {
          await checkSession();
        }, 100);
        
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Login failed';
        console.log('Signin failed:', errorMessage);
        setAuthError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login network error:', error);
      const errorMessage = error.name === 'TypeError' ? 
        'Network error. Please check your connection and try again.' : 
        'An unexpected error occurred. Please try again.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateActivity, startHeartbeat, checkSession]);

  // Register function with enhanced error handling
  const signup = useCallback(async (userData) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Validate required fields
      const requiredFields = ['email', 'password', 'name'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
        setAuthError(errorMessage);
        return { success: false, message: errorMessage };
      }
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        updateActivity();
        startHeartbeat();
        await checkSession();
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Registration failed';
        setAuthError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.name === 'TypeError' ? 
        'Network error. Please check your connection and try again.' : 
        'An unexpected error occurred. Please try again.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateActivity, startHeartbeat, checkSession]);

  // Logout function with cleanup
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Stop heartbeat first
      stopHeartbeat();
      
      // Call server logout endpoint
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        console.warn('Server logout failed:', error);
        // Continue with local cleanup even if server logout fails
      }
      
      // Clean up session
      await cleanupSession();
      
      // Clear user state
      setUser(null);
      setAuthError(null);
      
      // Clear any stored form data
      sessionStorage.removeItem('pendingTripForm');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setAuthError(null);
      return { success: false, message: 'Logout failed, but local session cleared' };
    } finally {
      setLoading(false);
    }
  }, [cleanupSession, stopHeartbeat]);

  // Get current user info with better error handling
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('getCurrentUser success:', data.user?.email);
        return data.user;
      } else if (response.status === 401) {
        // Unauthorized - session is invalid
        console.log('getCurrentUser: Unauthorized (401)');
        return null;
      } else {
        console.log('getCurrentUser: Other error status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Get current user network error:', error);
      // Don't return null immediately on network error - might be temporary
      // Let the caller decide how to handle this
      throw error;
    }
  }, []);

  // Check if user is authenticated with session validation
  const isAuthenticated = useCallback(() => {
    return sessionActive && user !== null && !loading;
  }, [sessionActive, user, loading]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (sessionActive) {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      } else {
        setUser(null);
        return null;
      }
    }
    return null;
  }, [sessionActive, getCurrentUser]);

  // Clear auth error
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        updateActivity();
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.message || 'Profile update failed';
        setAuthError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = 'Failed to update profile. Please try again.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateActivity]);

  // Password reset request
  const requestPasswordReset = useCallback(async (email) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const response = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'Password reset email sent' };
      } else {
        const errorMessage = data.message || 'Failed to send password reset email';
        setAuthError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      const errorMessage = 'Network error. Please try again.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // User state
    user,
    loading: loading || sessionLoading,
    authError,
    sessionActive,
    isInitialized,
    
    // Auth methods
    signin,
    signup,
    logout,
    getCurrentUser,
    isAuthenticated,
    refreshUser,
    updateUserProfile,
    requestPasswordReset,
    
    // Utility methods
    clearError,
    updateActivity, // Expose activity update for manual calls
    
    // Session info
    sessionInfo: {
      active: sessionActive,
      loading: sessionLoading
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};