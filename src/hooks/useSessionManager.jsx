// useSessionManager.js - React Hook for Session Management
import { useEffect, useRef, useState } from 'react';

const useSessionManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const heartbeatInterval = useRef(null);
  const sessionCleanupSent = useRef(false);

  // Check session status
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/heartbeat', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup session on server
  const cleanupSession = async () => {
    if (sessionCleanupSent.current) return;
    sessionCleanupSent.current = true;
    
    try {
      await fetch('/api/auth/cleanup-session', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  };

  // Handle page visibility change (tab switch, minimize)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // User switched tab or minimized browser
      // Stop heartbeat to conserve resources
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    } else {
      // User returned to tab
      // Check session status and restart heartbeat
      checkSession();
      startHeartbeat();
    }
  };

  // Start heartbeat to keep session alive
  const startHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    heartbeatInterval.current = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
  };

  // Handle beforeunload event (browser/tab close)
  const handleBeforeUnload = (event) => {
    // Try to cleanup session
    cleanupSession();
    
    // Note: Modern browsers ignore custom messages in beforeunload
    // This is mainly for session cleanup
  };

  // Handle unload event as backup
  const handleUnload = () => {
    cleanupSession();
  };

  useEffect(() => {
    // Initial session check
    checkSession();

    // Set up event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start heartbeat
    startHeartbeat();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, []);

  return {
    isAuthenticated,
    loading,
    checkSession,
    cleanupSession
  };
};

export default useSessionManager;

// Alternative: SessionManager Component for class-based approach
export class SessionManager {
  constructor() {
    this.isAuthenticated = false;
    this.heartbeatInterval = null;
    this.sessionCleanupSent = false;
    this.init();
  }

  init() {
    this.checkSession();
    this.setupEventListeners();
    this.startHeartbeat();
  }

  async checkSession() {
    try {
      const response = await fetch('/api/auth/heartbeat', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isAuthenticated = data.authenticated;
        return data.authenticated;
      } else {
        this.isAuthenticated = false;
        return false;
      }
    } catch (error) {
      console.error('Session check failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async cleanupSession() {
    if (this.sessionCleanupSent) return;
    this.sessionCleanupSent = true;
    
    try {
      await fetch('/api/auth/cleanup-session', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  }

  setupEventListeners() {
    window.addEventListener('beforeunload', () => this.cleanupSession());
    window.addEventListener('unload', () => this.cleanupSession());
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
        }
      } else {
        this.checkSession();
        this.startHeartbeat();
      }
    });
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      this.checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.cleanupSession();
  }
}