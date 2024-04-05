import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ClientRequestBuilder } from "@renderer/util/request";
import { IUser } from "@fyp/types";
import { useQueryClient } from "@tanstack/react-query";

export type Session = {
  sessionId: string
  userId: string,
  username: string,
  summoner?: Pick<IUser, "summoner">["summoner"]
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
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async() => {

      try {

        const res = await new ClientRequestBuilder()
          .route('/v1/auth/session')
          .fetch();

        const data = await res.json();

        if (res.ok) {
          setSession({
            loading: false,
            session: {
              username: data.user.username,
              userId: data.user._id,
              sessionId: data.sessionId,
              summoner: data.user.summoner
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

      const res = await new ClientRequestBuilder()
      .route('/v1/auth/signup')
      .method('POST')
      .body(userData)
      .fetch();

      const data = await res.json();

      if (res.ok) {
        setSession({
          loading: false,
          session: {
            username: data.user.username,
            userId: data.user._id,
            sessionId: data.sessionId,
            summoner: data.user.summoner
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
        message: "Server Error: Couldn't log in."
      };
    }

  };

  const signIn = async(credentials: Credentials) => {

    try {

      const res = await new ClientRequestBuilder()
      .route('/v1/auth/login')
      .method('POST')
      .body(credentials)
      .fetch();

      const data = await res.json();

      if (res.ok) {
        setSession({
          loading: false,
          session: {
            username: data.user.username,
            userId: data.user._id,
            sessionId: data.sessionId,
            summoner: data.user.summoner
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
        message: "Server Error: Couldn't log in."
      };
    }

  };

  const signOut = async() => {

    try {

      await new ClientRequestBuilder()
        .route('/v1/auth/logout')
        .fetch();

      queryClient.removeQueries();
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
