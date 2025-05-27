
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
}

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(() => {
    // Mock session for demo purposes
    const mockSession = {
      user: {
        id: 'demo-user-123',
        email: 'demo@pharmacy.com'
      }
    };
    return mockSession;
  });

  const signOut = () => {
    setSession(null);
  };

  return {
    session,
    signOut
  };
};
