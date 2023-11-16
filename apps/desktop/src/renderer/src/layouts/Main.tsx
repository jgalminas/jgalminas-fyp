import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";

const Main = () => {

  return (
    <div className="flex h-screen w-full bg-woodsmoke-900">
      <Sidebar/>
      <div className="flex flex-col flex-grow">
        <Header/>
        <div className="overflow-y-auto w-full max-w-[60rem] self-center">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Main;