import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";
import { useSubscription } from "@renderer/core/hooks/useSubscription";
import { useAuth } from "@renderer/auth/AuthContext";

const Main = () => {

  const { session } = useAuth();

  useSubscription((event) => {
    if (event.payload.recording && session && session.puuid) {
      window.api.file.createHighlights({
        match: event.payload.match,
        recording: event.payload.recording,
        puuid: session.puuid
      })
    }
  }, [])

  return (
    <div className="flex h-screen w-full bg-woodsmoke-900">
      <Sidebar/>
      <div id="page" className="flex flex-col flex-grow relative">
        <Header/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Main;