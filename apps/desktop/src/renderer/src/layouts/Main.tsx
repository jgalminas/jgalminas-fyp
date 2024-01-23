import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";
import { useSubscription } from "@renderer/core/hooks/useSubscription";

const Main = () => {

  useSubscription((event) => {
    if (event.type === 'AI_HIGHLIGHTS') {
      window.api.file.createHighlights(event.payload);
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