import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { api } from "@renderer/util/api";

export type Session = {
  sessionId: string
  userId: string,
  username: string,
  puuid: string | undefined
};

export type AuthError = {
  message: string
};

export type Credentials = {
  email: string,
  password: string
}

export type AuthContext = {
  session: Session | null,
  signOut: () => void,
  signUp: (data: SignUpData) => Promise<AuthError | null>,
  signIn: (credentials: Credentials) => Promise<AuthError | null>,
};

const AuthContext = createContext<AuthContext>({
  session: null,
  signOut: () => {},
  signIn: () => new Promise((_, reject) => reject(null)),
  signUp: () => new Promise((_, reject) => reject(null))
})

export type AuthProviderProps = {
  children: ReactNode
}

export type SignUpData = {
  username: string,
  email: string,
  password: string
}

const AuthProvider = ({ children }: AuthProviderProps) => {

  const [session, setSession] = useState<{ loading: boolean, session: Session | null }>({ loading: true, session: null });

  useEffect(() => {
    const getSession = async() => {
      
      try {        

        const res = await fetch(api('/v1/auth/session'), {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
  
        if (res.ok) {
          setSession({
            loading: false,
            session: {
              username: data.user.username,
              userId: data.user._id,
              sessionId: data.sessionId,
              puuid: data.user.puuid
            }
          });
        } else {
          setSession({ ...session, loading: false });
        }
      } catch {
        setSession({ ...session, loading: false });
      }

    }

    getSession();

  }, [])

  const signUp = async(userData: SignUpData) => {

    try {
      const res = await fetch(api('/v1/auth/signup'), {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(userData)
      })

      const data = await res.json();

      if (res.ok) {
        setSession({
          loading: false,
          session: {
            username: data.user.username,
            userId: data.user._id,
            sessionId: data.sessionId,
            puuid: data.user.puuid
          }
        });
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

    try {
      const res = await fetch(api('/v1/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credentials)
      })

      const data = await res.json();

      if (res.ok) {
        setSession({
          loading: false,
          session: {
            username: data.user.username,
            userId: data.user._id,
            sessionId: data.sessionId,
            puuid: data.user.puuid
          }
        });
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
      await fetch(api('/v1/auth/logout'), {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSession({ ...session, session: null });

    } catch {  }

  };

  const context: AuthContext = {
    session: session.session,
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