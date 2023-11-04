import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";

const Main = () => {

  return (
    <div className="flex h-screen w-full">
      <Sidebar/>
      <div className="flex flex-col flex-grow">
        <Header/>
        <div className="overflow-y-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Main;