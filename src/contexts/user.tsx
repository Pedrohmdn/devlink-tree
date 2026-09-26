import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth, db } from "../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

interface UserProviderProps {
  children: ReactNode;
}

export interface UserData {
  userId: string;
  userName?: string;
}

interface UserContextType {
  signed: boolean;
  loading: boolean;
  user: UserData | null;
}

export const UserContext = createContext({} as UserContextType);

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          setUser({
            userId: user.uid,
            userName: docSnap.data()?.userName,
          });
        } catch (error) {
          console.error(error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);
  
  return (
    <UserContext.Provider value={{ loading, user, signed: !!user }}>
      {children}
    </UserContext.Provider>
  );
}
