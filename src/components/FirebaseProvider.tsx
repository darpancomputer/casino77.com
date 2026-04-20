import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue, set, get, child } from 'firebase/database';
import { auth, rtdb } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser) {
        const profileRef = ref(rtdb, `users/${firebaseUser.uid}`);
        
        // Listen to profile changes in Realtime Database
        unsubscribeProfile = onValue(profileRef, (snapshot) => {
          if (snapshot.exists()) {
            setProfile(snapshot.val() as UserProfile);
          } else {
            // Create profile if it doesn't exist
            const isAdminEmail = firebaseUser.email === 'admin@himalaya.com' || firebaseUser.email === 'sundarrawal132@gmail.com';
            let phoneNumber = firebaseUser.phoneNumber || '';
            
            if (!phoneNumber && firebaseUser.email?.endsWith('@himalaya.com') && !isAdminEmail) {
              phoneNumber = firebaseUser.email.split('@')[0];
            }

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || (isAdminEmail ? 'System Admin' : 'User'),
              email: firebaseUser.email || '',
              phoneNumber: phoneNumber,
              balance: 0,
              role: isAdminEmail ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
              lastBonusClaimedAt: '',
              bonusStreak: 0,
              turnover: 0,
              totalDeposited: 0,
            };
            set(profileRef, newProfile);
            setProfile(newProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("RTDB Error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
