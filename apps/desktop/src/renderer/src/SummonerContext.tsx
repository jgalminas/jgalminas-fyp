import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@fyp/types";
import { useAuth } from "./auth/AuthContext";

export type Summoner = Pick<IUser, "summoner">["summoner"];

export type SummonerContext = {
  summoner: Summoner,
  setSummoner: (summoner: Summoner) => void
};

const SummonerContext = createContext<SummonerContext>({
  summoner: undefined,
  setSummoner: () => {}
})

export type SummonerProviderProps = {
  children: ReactNode
}

const SummonerProvider = ({ children }: SummonerProviderProps) => {

  const [summoner, setSummoner] = useState<Summoner>(undefined);

  const { session } = useAuth();

  useEffect(() => {
    if (session?.summoner) {
      setSummoner(session.summoner);
    }
  }, [session])

  const context: SummonerContext = {
    summoner: summoner,
    setSummoner: (summoner) => setSummoner(summoner) 
  };

  return (
    <SummonerContext.Provider value={context}>
      { children }
    </SummonerContext.Provider>
  )
}

export const useSummoner = () => useContext(SummonerContext);

export default SummonerProvider;