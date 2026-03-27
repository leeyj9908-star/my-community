import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase-client';

const AuthContext = createContext(null);

/**
 * AuthProvider: 로그인 상태를 전역으로 관리하는 Context Provider
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username, password) => {
    const email = `${username}@mycommunity.app`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    return { data, error };
  };

  const signIn = async (username, password) => {
    const email = `${username}@mycommunity.app`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const username = user?.user_metadata?.username ?? null;

  return (
    <AuthContext.Provider value={{ user, username, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
