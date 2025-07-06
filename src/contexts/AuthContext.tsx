import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface GuestUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  isGuest: true;
}

interface AuthContextType {
  user: User | GuestUser | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | GuestUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for guest user in localStorage
    const guestUser = localStorage.getItem('guestUser');
    if (guestUser) {
      try {
        const parsedGuestUser = JSON.parse(guestUser);
        setUser(parsedGuestUser);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing guest user:', error);
        localStorage.removeItem('guestUser');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Auth state changed:', user ? user.email : 'No user');
      // Clear guest user if Firebase auth user exists
      if (user) {
        localStorage.removeItem('guestUser');
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('guestUser'); // Clear guest mode
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      localStorage.removeItem('guestUser'); // Clear guest mode
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('❌ Email sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      localStorage.removeItem('guestUser'); // Clear guest mode
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      console.error('❌ Email sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async () => {
    try {
      setLoading(true);
      const guestUser: GuestUser = {
        uid: `guest_${Date.now()}`,
        email: 'guest@breakpoint.app',
        displayName: 'Guest Player',
        photoURL: null,
        isGuest: true
      };
      
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      setUser(guestUser);
    } catch (error) {
      console.error('❌ Guest sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user && 'isGuest' in user && user.isGuest) {
        // Guest user logout
        localStorage.removeItem('guestUser');
        setUser(null);
      } else {
        // Firebase user logout
        await signOut(auth);
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  const isGuest = user ? 'isGuest' in user && user.isGuest : false;

  const value: AuthContextType = {
    user,
    loading,
    isGuest,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};