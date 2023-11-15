import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import env from "../../../env";

export type User = {
  userId: string
}

export type Session = {
  sessionId: string
  userId: string
}; //TODO

export type AuthError = {
  message: string
};

export type Credentials = {
  email: string,
  password: string
}

export type AuthContext = {
  user: User | null,
  signOut: () => void,
  signUp: (data: SignUpData) => Promise<AuthError | null>,
  signIn: (credentials: Credentials) => Promise<AuthError | null>,
};

const AuthContext = createContext<AuthContext>({
  user: null,
  signOut: () => {},
  signIn: () => new Promise((_, reject) => reject(null)),
  signUp: () => new Promise((_, reject) => reject(null))
})

export type AuthProviderProps = {
  children: ReactNode
}

export type SignUpData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

const AuthProvider = ({ children }: AuthProviderProps) => {

  const [session, setSession] = useState<{ loading: boolean, session: Session | null }>({ loading: true, session: null });

  useEffect(() => {

    const getSession = async() => {
      
      try {        

        const res = await fetch(env.VITE_API_URL + '/api/v1/auth/session');
        const data = await res.json();
  
        if (res.ok) {
          setSession({ loading: false, session: { userId: data.id, sessionId: data.sessionId } });
        } else {
          setSession({ ...session, loading: false });
        }
      } catch {
        setSession({ ...session, loading: false });
      }

    }

    getSession();

  }, [])

  const user = (!session.session) ? null : {
    userId: session.session.userId
  };

  const signUp = async(userData: SignUpData) => {

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(userData)
      })

      const data = await res.json();

      if (res.ok) {
        setSession({ loading: false, session: { userId: data.id, sessionId: data.sessionId } });
        return null;
      } else {
        setSession({ ...session, loading: false });
        return {
          message: data.message
        }
      }

    } catch {
      setSession({ ...session, loading: false });
      return {
        message: "TODO - Couldn't sign up."
      };
    }

  };

  const signIn = async(credentials: Credentials) => {
    
    const x = window.api.auth.getSession();
    const y = window.api.auth.logIn("x");

    

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(credentials)
      })

      const data = await res.json();

      if (res.ok) {
        setSession({ loading: false, session: { userId: data.id, sessionId: data.sessionId } });
        return null;
      } else {
        setSession({ ...session, loading: false });
        return {
          message: data.message
        }
      }

    } catch {
      setSession({ ...session, loading: false });
      return {
        message: "TODO - Couldn't log in."
      };
    }

  };

  const signOut = async() => {

    try {
      const res = await fetch('/api/v1/auth/logout');

      if (res.ok) {
        setSession({ ...session, session: null });
      }

    } catch {  }

  };

  const context: AuthContext = {
    user: user,
    signOut,
    signUp,
    signIn
  };

  return (
    <AuthContext.Provider value={context}>
      { !session.loading && children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;