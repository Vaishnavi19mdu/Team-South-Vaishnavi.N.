import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  getUserProfile,
  logIn as loginService,
  logOut as logoutService,
  signUp as signupService,
  isProfileActive,
} from '../services/authService';
import { UserProfile } from '../types/auth';
import { UserRole } from '../utils/constants/roles';
import { SignupBasicData } from '../screens/auth/SignupBasicScreen';
import { SignupHostelData } from '../screens/auth/SignupHostelScreen';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (role: UserRole, basicData: SignupBasicData, hostelData: SignupHostelData) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const p = await loginService(email, password);
    setProfile(p);
    return p;
  };

  const signup = async (role: UserRole, basicData: SignupBasicData, hostelData: SignupHostelData) => {
    const p = await signupService(role, basicData, hostelData);
    // createUserWithEmailAndPassword signs the user in automatically, so
    // onAuthStateChanged will also fire — but setting it here immediately
    // means App.tsx can read the fresh profile synchronously right after
    // this promise resolves, instead of waiting a tick for that listener.
    setProfile(p);
    return p;
  };

  const logout = async () => {
    await logoutService();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      const p = await getUserProfile(firebaseUser.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, isLoading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

// Re-exported for convenience in route guards
export { isProfileActive };