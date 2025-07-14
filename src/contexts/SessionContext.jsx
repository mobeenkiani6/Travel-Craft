// contexts/SessionContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  const heartbeatInterval = useRef(null);
  const sessionCleanupSent = useRef(false);
  const lastActivityTime = useRef(Date.now());

 const checkSession = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/heartbeat`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 401) {
      // Not logged in - no need to log error
      setSessionActive(false);
      return false;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    setSessionActive(data.authenticated);
    return data.authenticated;
  } catch (error) {
    console.error('❌ Session check failed (network/server error):', error);
    setSessionActive(false);
    return false;
  } finally {
    setSessionLoading(false);
  }
};


  const cleanupSession = async () => {
    if (sessionCleanupSent.current) return;
    sessionCleanupSent.current = true;

    try {
      await fetch(`${API_URL}/auth/cleanup-session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      setSessionActive(false);
      console.log('✅ Session cleaned up');
    } catch (error) {
      console.error('❌ Session cleanup failed:', error);
    }
  };

  const updateActivity = () => {
    lastActivityTime.current = Date.now();
  };

  const startHeartbeat = () => {
    if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);

    heartbeatInterval.current = setInterval(async () => {
      const inactiveTime = Date.now() - lastActivityTime.current;
      const maxInactiveTime = 25 * 60 * 1000; // 25 minutes

      if (inactiveTime > maxInactiveTime) {
        console.warn('⚠️ User inactive for too long, cleaning up session...');
        await cleanupSession();
        stopHeartbeat();
      } else {
        await checkSession();
      }
    }, 2 * 60 * 1000); // every 2 minutes
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopHeartbeat();
    } else {
      updateActivity();
      checkSession().then((isActive) => {
        if (isActive) startHeartbeat();
      });
    }
  };

  const handleBeforeUnload = () => {
    cleanupSession();
  };

  const handleUserActivity = () => {
    updateActivity();
  };

  useEffect(() => {
    checkSession(); // Initial check when component mounts

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event =>
      document.addEventListener(event, handleUserActivity, { passive: true })
    );

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      activityEvents.forEach(event =>
        document.removeEventListener(event, handleUserActivity)
      );
      stopHeartbeat();
    };
  }, []);

  useEffect(() => {
    if (sessionActive) {
      startHeartbeat();
    } else {
      stopHeartbeat();
    }
  }, [sessionActive]);

  return (
    <SessionContext.Provider
      value={{
        sessionActive,
        sessionLoading,
        checkSession,
        cleanupSession,
        updateActivity,
        startHeartbeat,
        stopHeartbeat
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
