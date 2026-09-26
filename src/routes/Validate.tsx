import { db } from "../services/firebaseConnection";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";

interface ValidateProps {
  children: ReactNode;
}

export function ValidateUserName({ children }: ValidateProps) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const { userName } = useParams();

  useEffect(() => {
    async function fetchUserName() {
      const docRef = doc(db, "usernames", userName as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
      setLoading(false);
    }

    fetchUserName();
  }, [userName]);

  if (loading) {
    return <div></div>;
  }

  if (!isValid) {
    return <Navigate to="/notFound" />;
  }

  return <>{children}</>;
}
