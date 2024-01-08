import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";

const Main = () => {

  return (
    <div className="flex h-screen w-full bg-woodsmoke-900">
      <Sidebar/>
      <div id="page" className="flex flex-col flex-grow relative">
        <Header/>
        <div className="flex flex-col overflow-y-auto w-full">
          <div className="w-full max-w-[80rem] self-center">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;